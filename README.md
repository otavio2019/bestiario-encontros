# Bestiário de Encontros

Biblioteca local para criar e consultar inimigos compatíveis com D&D 5e (2014) e D&D 2024.

## Recursos

- Biblioteca de inimigos com busca, filtros, duplicação e exclusão.
- Editor de fichas com cálculos auxiliares de modificadores, CDs e bônus de ataque.
- Calculadora de encontro: informe nível da party, quantidade de personagens e quantidade do inimigo.
- Matemática de 2014 com limiares e multiplicador por quantidade de monstros.
- Matemática de 2024 com orçamento de XP por personagem, sem multiplicador de quantidade.
- Importação e exportação JSON.
- Dados salvos localmente no navegador.
- Impressão e salvamento como PDF pelo navegador.

## Executar localmente

Requer Node.js 20+ e pnpm.

```bash
pnpm install
pnpm dev
```

Para gerar uma build estática:

```bash
pnpm check
pnpm test
pnpm build
pnpm preview
```

O frontend continua funcionando sem backend e mantém a biblioteca local em `localStorage`. Quando a API estiver configurada, o cabeçalho também oferece login com GitHub.

## GitHub Pages

O frontend é publicado automaticamente por [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) a cada push na branch `main`. O workflow executa os testes, o TypeScript e a build antes de publicar.

Como o GitHub Pages serve apenas arquivos estáticos, o workflow também copia `index.html` para `404.html`, permitindo recarregar rotas internas da SPA. O frontend não deve guardar segredos, tokens ou credenciais.

No repositório do GitHub, habilite **Settings → Pages → Source: GitHub Actions** uma vez. A URL esperada será `https://SEU_USUARIO.github.io/bestiario-encontros/`.

Em **Settings → Secrets and variables → Actions → Variables**, crie `VITE_API_URL` com a URL pública da API. O workflow injeta essa variável no build do frontend.

## Login OAuth, Docker e Prisma

O backend OAuth fica em `server/` e expõe:

- `GET /api/auth/github` — inicia o login no GitHub;
- `GET /api/auth/github/callback` — valida o retorno OAuth;
- `GET /api/auth/me` — retorna o usuário da sessão atual;
- `POST /api/auth/logout` — encerra a sessão;
- `GET /api/health` — verifica se a API está disponível.

As sessões são tokens aleatórios armazenados no PostgreSQL e enviados ao navegador em cookie `HttpOnly`. O token OAuth do GitHub não é persistido no banco.

Para configurar o GitHub OAuth, crie uma OAuth App em **GitHub → Settings → Developer settings → OAuth Apps**. Use como callback local:

```txt
http://localhost:3000/api/auth/github/callback
```

Preencha `.env` a partir do exemplo:

```bash
cp .env.example .env
```

Para executar o banco e a API localmente:

```bash
docker compose up -d postgres
pnpm db:generate
pnpm db:migrate
pnpm api:dev
```

Em outro terminal, execute o frontend:

```bash
pnpm dev
```

O botão **Entrar com GitHub** chamará `VITE_API_URL`, que por padrão é `http://localhost:3000`.

Para executar banco e API juntos pelo Docker:

```bash
docker compose up --build
```

O schema inicial em [`prisma/schema.prisma`](prisma/schema.prisma), a migration em [`prisma/migrations/0001_init/migration.sql`](prisma/migrations/0001_init/migration.sql) e o cliente Prisma já estão preparados para usuários, sessões e contas OAuth.

Para abrir o Prisma Studio:

```bash
pnpm db:studio
```

Para testar a versão estática em Docker:

```bash
docker build -t bestiario-encontros .
docker run --rm -p 8080:80 bestiario-encontros
```

Em produção, hospede a API em um serviço que execute Node/Docker e tenha PostgreSQL. Configure `FRONTEND_URL` com a URL do GitHub Pages, `VITE_API_URL` com a URL pública da API e `GITHUB_CALLBACK_URL` com a URL pública `/api/auth/github/callback`. Como são domínios diferentes, mantenha `COOKIE_SAME_SITE=none` e HTTPS na API.

## Licença e conteúdo

O código é MIT. O catálogo inicial é composto por criações originais e uma entrada identificada como referência compatível com SRD. D&D e seus elementos protegidos pertencem aos respectivos titulares. Consulte o [SRD oficial](https://www.dndbeyond.com/srd) antes de distribuir conteúdo adicional.
