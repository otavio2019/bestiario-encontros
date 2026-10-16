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

O projeto não usa backend, banco, autenticação, API privada ou runtime proprietário. Os inimigos são armazenados em `localStorage` no navegador.

## GitHub Pages

O frontend é publicado automaticamente por [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) a cada push na branch `main`. O workflow executa os testes, o TypeScript e a build antes de publicar.

Como o GitHub Pages serve apenas arquivos estáticos, o workflow também copia `index.html` para `404.html`, permitindo recarregar rotas internas da SPA. O frontend não deve guardar segredos, tokens ou credenciais.

No repositório do GitHub, habilite **Settings → Pages → Source: GitHub Actions** uma vez. A URL esperada será `https://SEU_USUARIO.github.io/bestiario-encontros/`.

## Docker e Prisma

O Docker Compose sobe um PostgreSQL local para o futuro backend:

```bash
cp .env.example .env
docker compose up -d postgres
pnpm db:generate
pnpm db:push
pnpm db:studio
```

O schema inicial em [`prisma/schema.prisma`](prisma/schema.prisma) já prevê usuários, sessões e contas OAuth. Ele é uma base para implementar login no backend, mas ainda não implementa autenticação sozinho.

Para testar a versão estática em Docker:

```bash
docker build -t bestiario-encontros .
docker run --rm -p 8080:80 bestiario-encontros
```

O login deverá ficar em uma API separada, hospedada em um serviço que execute Node/Docker e tenha PostgreSQL. O GitHub Pages continua servindo somente o frontend, consumindo essa API por HTTPS.

## Licença e conteúdo

O código é MIT. O catálogo inicial é composto por criações originais e uma entrada identificada como referência compatível com SRD. D&D e seus elementos protegidos pertencem aos respectivos titulares. Consulte o [SRD oficial](https://www.dndbeyond.com/srd) antes de distribuir conteúdo adicional.
