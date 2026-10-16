import "dotenv/config";
import crypto from "node:crypto";
import cors from "cors";
import express, { type Request, type Response } from "express";
import { prisma } from "./prisma.js";

const app = express();
const port = Number(process.env.PORT ?? 3000);
const frontendUrl = (process.env.FRONTEND_URL ?? "http://localhost:5173").replace(/\/$/, "");
const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
const githubCallbackUrl = process.env.GITHUB_CALLBACK_URL ?? `http://localhost:${port}/api/auth/github/callback`;
const isProduction = process.env.NODE_ENV === "production";
const sessionMaxAgeSeconds = 60 * 60 * 24 * 30;
const cookieSameSite = process.env.COOKIE_SAME_SITE ?? (isProduction ? "none" : "lax");

type SameSite = "lax" | "strict" | "none";

if (!githubClientId || !githubClientSecret) {
  console.warn("GITHUB_CLIENT_ID/GITHUB_CLIENT_SECRET não configurados; o login OAuth ficará indisponível.");
}

app.disable("x-powered-by");
app.use(cors({ origin: frontendUrl, credentials: true }));
app.use(express.json());

function parseCookies(request: Request) {
  const header = request.headers.cookie ?? "";
  return Object.fromEntries(header.split(";").filter(Boolean).map((part) => {
    const separator = part.indexOf("=");
    const key = separator >= 0 ? part.slice(0, separator).trim() : part.trim();
    const value = separator >= 0 ? part.slice(separator + 1).trim() : "";
    return [key, decodeURIComponent(value)];
  }));
}

function setCookie(response: Response, name: string, value: string, options: { maxAge?: number; httpOnly?: boolean; sameSite?: SameSite; secure?: boolean } = {}) {
  const attributes = [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    `Max-Age=${options.maxAge ?? sessionMaxAgeSeconds}`,
    "HttpOnly",
    `SameSite=${options.sameSite ?? cookieSameSite}`,
  ];
  if (options.secure ?? isProduction) attributes.push("Secure");
  response.append("Set-Cookie", attributes.join("; "));
}

function clearCookie(response: Response, name: string) {
  response.append("Set-Cookie", `${name}=; Path=/; Max-Age=0; HttpOnly; SameSite=${cookieSameSite}${isProduction ? "; Secure" : ""}`);
}

function randomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("hex");
}

function redirectToLoginError(response: Response, message: string) {
  const url = new URL(frontendUrl);
  url.searchParams.set("authError", message);
  response.redirect(url.toString());
}

async function githubFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "bestiario-encontros",
      ...(init?.headers ?? {}),
    },
  });
  if (!response.ok) throw new Error(`GitHub respondeu ${response.status}`);
  return response.json() as Promise<T>;
}

app.get("/api/health", (_request, response) => {
  response.json({ ok: true, service: "bestiario-api" });
});

app.get("/api/auth/github", (_request, response) => {
  if (!githubClientId || !githubClientSecret) {
    response.status(503).json({ error: "GitHub OAuth não está configurado no servidor." });
    return;
  }
  const state = randomToken(24);
  setCookie(response, "oauth_state", state, { maxAge: 600, sameSite: "lax" });
  const authorizationUrl = new URL("https://github.com/login/oauth/authorize");
  authorizationUrl.searchParams.set("client_id", githubClientId);
  authorizationUrl.searchParams.set("redirect_uri", githubCallbackUrl);
  authorizationUrl.searchParams.set("scope", "read:user user:email");
  authorizationUrl.searchParams.set("state", state);
  response.redirect(authorizationUrl.toString());
});

app.get("/api/auth/github/callback", async (request, response) => {
  const { code, state } = request.query;
  const cookies = parseCookies(request);
  clearCookie(response, "oauth_state");

  const stateMatches = typeof state === "string" && Boolean(cookies.oauth_state) && Buffer.byteLength(state) === Buffer.byteLength(cookies.oauth_state) && crypto.timingSafeEqual(Buffer.from(state), Buffer.from(cookies.oauth_state));
  if (typeof code !== "string" || !stateMatches) {
    redirectToLoginError(response, "state_invalido");
    return;
  }
  if (!githubClientId || !githubClientSecret) {
    redirectToLoginError(response, "oauth_nao_configurado");
    return;
  }

  try {
    const tokenResponse = await githubFetch<{ access_token?: string }>("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: githubClientId, client_secret: githubClientSecret, code, redirect_uri: githubCallbackUrl }),
    });
    if (!tokenResponse.access_token) throw new Error("GitHub não forneceu um token de acesso.");

    const githubUser = await githubFetch<{ id: number; login: string; name: string | null; avatar_url: string | null; email: string | null }>("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
    });
    const emails = await githubFetch<Array<{ email: string; primary: boolean; verified: boolean }>>("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
    });
    const githubEmail = emails.find((item) => item.primary && item.verified) ?? emails.find((item) => item.verified);
    const email = githubEmail?.email ?? githubUser.email;
    if (!email) throw new Error("A conta GitHub não possui um e-mail verificado disponível.");

    const existingAccount = await prisma.oAuthAccount.findUnique({
      where: { provider_providerAccountId: { provider: "github", providerAccountId: String(githubUser.id) } },
      include: { user: true },
    });
    const user = existingAccount?.user ?? await prisma.user.upsert({
      where: { email: email.toLowerCase() },
      update: { name: githubUser.name ?? githubUser.login, image: githubUser.avatar_url, emailVerified: githubEmail?.verified ? new Date() : undefined },
      create: { email: email.toLowerCase(), name: githubUser.name ?? githubUser.login, image: githubUser.avatar_url, emailVerified: githubEmail?.verified ? new Date() : undefined },
    });

    await prisma.oAuthAccount.upsert({
      where: { provider_providerAccountId: { provider: "github", providerAccountId: String(githubUser.id) } },
      update: { userId: user.id },
      create: { userId: user.id, provider: "github", providerAccountId: String(githubUser.id) },
    });

    const session = await prisma.session.create({ data: { token: randomToken(), userId: user.id, expiresAt: new Date(Date.now() + sessionMaxAgeSeconds * 1000) } });
    setCookie(response, "session_token", session.token);
    response.redirect(frontendUrl);
  } catch (error) {
    console.error("Falha no callback do GitHub:", error);
    redirectToLoginError(response, "falha_no_login");
  }
});

app.get("/api/auth/me", async (request, response) => {
  const token = parseCookies(request).session_token;
  if (!token) {
    response.status(401).json({ user: null });
    return;
  }
  const session = await prisma.session.findUnique({ where: { token }, include: { user: true } });
  if (!session || session.expiresAt <= new Date()) {
    if (session) await prisma.session.delete({ where: { id: session.id } });
    clearCookie(response, "session_token");
    response.status(401).json({ user: null });
    return;
  }
  response.json({ user: { id: session.user.id, email: session.user.email, name: session.user.name, image: session.user.image } });
});

app.post("/api/auth/logout", async (request, response) => {
  const token = parseCookies(request).session_token;
  if (token) await prisma.session.deleteMany({ where: { token } });
  clearCookie(response, "session_token");
  response.status(204).end();
});

app.use((_request, response) => response.status(404).json({ error: "Rota não encontrada." }));

const server = app.listen(port, "0.0.0.0", () => {
  console.log(`API de autenticação ouvindo em http://localhost:${port}`);
});

async function shutdown() {
  server.close();
  await prisma.$disconnect();
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
