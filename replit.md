# Jornada da Cabrita

Uma jornada web interativa com 5 fases: mini-jogos, cartas e um platformer 2D.

## Run & Operate

- `pnpm --filter @workspace/cabrita-journey run dev` — run the frontend (port 20770)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS
- API: Express 5 (minimal — app is mostly frontend)
- Build: Vite

## Where things live

- `artifacts/cabrita-journey/src/phases/` — all 5 phase components + triumph screen
- `artifacts/cabrita-journey/src/App.tsx` — phase orchestrator (state machine)
- `artifacts/cabrita-journey/src/index.css` — global styles & keyframe animations
- `attached_assets/` — sprite sheets and carta image (referenced via `@assets` alias)

## Product

5-phase interactive web journey:
1. **Fase 1** — Botão Fujão: dark screen, button flees from cursor/touch with shake timers
2. **Fase 2** — Carta 1: envelope animation + typewriter text + image reveal + black fade
3. **Fase 3** — Enigma do Emoji 🐥: trick emoji puzzle — correct one is in the page title
4. **Fase 4** — Advertência: letter warning about the 2D game
5. **Fase 5** — Mini-game 2D: platformer with Pink Monster player, enemy sprites, rocks, floating carta collectible, and portal

## Architecture decisions

- All phases are independent React components, orchestrated by a simple `phase` state in `App.tsx`
- Phase 5 uses HTML5 Canvas with `requestAnimationFrame` game loop — no external game engine
- Sprite sheets use dynamic frame extraction (`img.width / frameCount`) via `@assets` Vite alias
- Mobile controls in Phase 5 use `onPointerDown/Up/Leave` for reliable touch handling
- Phase 2 black overlay is split into two layers for timing precision (image expand + fade to black)

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Sprites require the `@assets` Vite alias (resolves to `attached_assets/`)
- Phase 5 canvas resizes on `window.resize` — always reads `canvas.width/height` in render
- Enemy patrol boundaries use per-enemy platform index from `ENEMY_DEFS`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
