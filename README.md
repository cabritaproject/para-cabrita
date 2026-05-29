# 💜 Jornada da Cabrita

Uma experiência web interativa com 11 fases: mini-jogos, cartas, puzzles e uma proposta especial no final.

🌐 **[Jogar agora](https://cabritaproject.github.io/para-cabrita/)**

---

## Fases

| # | Nome | Descrição |
|---|------|-----------|
| 1 | **Botão Fujão** | Botão que foge do cursor — tente clicar! |
| 2 | **Carta 1** | Envelope com animação + texto em typewriter |
| 3 | **Enigma do Emoji** | Puzzle de emojis com uma pegadinha escondida |
| 4 | **Advertência** | Carta de aviso sobre o jogo que vem a seguir |
| 5 | **Mini-game 2D** | Platformer com Pink Monster, inimigos, trampolins e uma carta para coletar |
| 6 | **Carta 2** | Mensagem revelada após completar o jogo |
| 7 | **Escolha de Imagem I** | Selecione a imagem que mais combina |
| 8 | **Escolha de Imagem II** | Segunda seleção de imagem |
| 9 | **Jogo da Cesta** | Pegue 10 sorvetes 🍦 sem errar — depois capture a carta! |
| 10 | **Sliding Puzzle** | Monte a imagem deslizando as peças e responda à pergunta |
| 11 | **Assinatura** | Assine com o mouse ou o dedo e finalize a jornada |

---

## Como rodar localmente

### Pré-requisitos

- [Node.js 20+](https://nodejs.org/)
- [pnpm 9+](https://pnpm.io/installation)

```bash
# Instalar pnpm (se não tiver)
npm install -g pnpm
```

### Rodando

```bash
# Clone o repositório
git clone https://github.com/cabritaproject/para-cabrita.git
cd para-cabrita

# Instalar dependências
pnpm install

# Rodar o frontend (escolha uma porta)
cd artifacts/cabrita-journey
PORT=3000 BASE_PATH=/ pnpm dev
```

Acesse: `http://localhost:3000`

### Build para produção (GitHub Pages)

```bash
pnpm --filter @workspace/cabrita-journey exec vite build --config vite.config.github.ts
```

O build é gerado em `artifacts/cabrita-journey/dist/`.

---

## Stack

- **Frontend:** React 18 + Vite + Tailwind CSS + TypeScript
- **Animações:** CSS keyframes + Canvas 2D (`requestAnimationFrame`)
- **Estrutura:** pnpm monorepo
- **Deploy:** GitHub Actions → GitHub Pages

## Estrutura do projeto

```
artifacts/
  cabrita-journey/
    src/
      phases/         ← todas as 11 fases
      App.tsx         ← orquestrador de fases
      index.css       ← animações globais
attached_assets/      ← sprites e imagens
.github/
  workflows/
    deploy.yml        ← CI/CD automático
```

---

Feito com 💜
