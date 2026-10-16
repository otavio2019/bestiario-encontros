export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
};

export const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:3000").replace(/\/$/, "");

export async function getCurrentUser(): Promise<AuthUser | null> {
  const response = await fetch(`${API_URL}/api/auth/me`, { credentials: "include" });
  if (response.status === 401) return null;
  if (!response.ok) throw new Error("Não foi possível consultar a sessão.");
  const payload = await response.json() as { user: AuthUser | null };
  return payload.user;
}

export async function logout() {
  await fetch(`${API_URL}/api/auth/logout`, { method: "POST", credentials: "include" });
}
