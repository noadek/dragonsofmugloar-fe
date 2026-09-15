# Dragons of Mugloar

A web front end for the [Dragons of Mugloar](https://dragonsofmugloar.com) game. Start a game, take quests from the message board, buy items in the shop, and try to beat your high score before you run out of lives.

Built with Next.js (App Router), React, Zustand, Tailwind CSS and shadcn/ui on Base UI.

## Prerequisites

- **Node.js 20.9 or newer** (required by Next.js 16)
- **pnpm 10**. The exact version is pinned in `package.json` under `packageManager`. The easiest way to get it is Corepack, which ships with Node:

  ```bash
  corepack enable
  ```

## Setup

```bash
git clone <repository-url>
cd dragons-of-mugloar-fe
pnpm install
```

No environment variables are needed. The app talks directly to the public API at `https://dragonsofmugloar.com/api/v2` (set in `src/services/game.service.ts`).

## Running the app

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The page reloads as you edit files.

### Production build

```bash
pnpm build
pnpm start
```

`pnpm start` serves the build on [http://localhost:3000](http://localhost:3000).

## Scripts

| Command             | What it does                            |
| ------------------- | --------------------------------------- |
| `pnpm dev`          | Start the development server            |
| `pnpm build`        | Create a production build               |
| `pnpm start`        | Serve the production build              |
| `pnpm lint`         | Run ESLint                              |
| `pnpm format`       | Format all files with Prettier          |
| `pnpm format:check` | Check formatting without changing files |

To type-check without building, run `pnpm exec tsc --noEmit`.

## Project structure

```
src/
  app/          Root layout, page and global styles
  components/   Game UI (quest board, shop, status bar, dialogs, toasts)
    ui/         shadcn/ui components
  lib/          Message decoding, probability risk tiers, helpers
  providers/    Game store React context
  services/     API client and response types
  stores/       Zustand game store (state and actions)
```
