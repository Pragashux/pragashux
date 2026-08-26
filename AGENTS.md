# AGENTS.md

Guidance for AI agents and developers working in this repository.

## Project overview

**pragashux** is a greenfield portfolio repository. As of the initial setup, the only committed file is `README.md`. There is no application code, dependency manifest, or service configuration yet.

## Cursor Cloud specific instructions

### Repository state

- **Branch:** `main`
- **Contents:** `README.md` only (plus this file after setup)
- **No install step required** until a package manager manifest (e.g. `package.json`, `requirements.txt`) is added.

### Available VM tooling

The cloud development VM includes:

| Tool    | Version (approx.) |
|---------|-------------------|
| Node.js | 22.x              |
| npm     | 10.x              |
| pnpm    | 10.x              |
| yarn    | 1.22.x            |
| Python  | 3.12.x            |
| Git     | 2.43.x            |

Docker is not installed in the default cloud VM.

### Services

| Service | Required? | How to run |
|---------|-----------|------------|
| *(none)* | — | No application services exist yet. |

When a portfolio stack is added (e.g. Next.js, Vite, Astro), document the dev server command here and add the appropriate dependency install to the VM update script.

### A11y Lens (Figma plugin)

The WCAG 2.2 checker lives in `a11y-lens/`.

```bash
cd a11y-lens
npm install
npm test
npm run build
npm run preview   # UI at http://127.0.0.1:5173/ (sample data, no Figma)
```

Import in Figma Desktop via **Plugins → Development → Import plugin from manifest…** and choose `a11y-lens/manifest.json`.

### Lint / test / build

Flutter (repo root):

```bash
flutter analyze
flutter test
```

Figma plugin (`a11y-lens/`):

```bash
npm run typecheck
npm test
npm run build
```

### Local preview (static / placeholder)

Until a framework is scaffolded, you can preview the repo root as static files:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Then open `http://127.0.0.1:8000/` (or curl it) to verify the workspace is being served.

### Adding a real application

When portfolio code is introduced:

1. Add the dependency manifest and lockfile.
2. Update the VM update script (via Cursor environment settings) with the install command (e.g. `pnpm install`).
3. Expand this file with dev-server startup, env vars, and lint/test commands.
