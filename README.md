# Portfolio-MF

An interactive, basketball-inspired 3D portfolio for Matías Fandiño, built with React, TypeScript, Three.js, and React Three Fiber.

## Features

- Navigable 3D basketball court with interactive hoop, court zones, and player stats.
- Portfolio panels for projects, professional experience, and skills.
- Responsive profile and navigation UI.

## Getting started

Requires Node.js and pnpm.

```sh
pnpm install
pnpm dev
```

## Scripts

```sh
pnpm lint
pnpm build
pnpm preview
```

## Browser regression checks

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm test:e2e
```

The suite starts Vite and checks modal focus/restore behavior, Profile label spacing,
and initial HTML metadata at desktop (1432×1191) and phone (390×844) viewports.
To use an existing Chromium install, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to its
executable path. Browser traces are kept on failure; generated artifacts are ignored.
