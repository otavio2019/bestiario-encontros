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
pnpm build
pnpm preview
```

O projeto não usa backend, banco, autenticação, API privada ou runtime proprietário. Os inimigos são armazenados em `localStorage` no navegador.

## Licença e conteúdo

O código é MIT. O catálogo inicial é composto por criações originais e uma entrada identificada como referência compatível com SRD. D&D e seus elementos protegidos pertencem aos respectivos titulares. Consulte o [SRD oficial](https://www.dndbeyond.com/srd) antes de distribuir conteúdo adicional.
