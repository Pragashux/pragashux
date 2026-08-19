# AGENTS.md

Guidance for AI agents and developers working in this repository.

## Project overview

**pragashux** is a React + TypeScript portfolio landing page for Pragash (presented as Jack, a 3D creator). It uses Vite, Tailwind CSS, Framer Motion, and Lucide React.

## Cursor Cloud specific instructions

### Repository state

- **Branch:** `main`
- **Stack:** Vite + React 18 + TypeScript + Tailwind CSS 3

### Available VM tooling

| Tool | Version (approx.) |
|---------|-------------------|
| Node.js | 22.x |
| npm | 10.x |
| pnpm | 10.x |
| yarn | 1.22.x |
| Python | 3.12.x |
| Git | 2.43.x |

Docker is not installed in the default cloud VM.

### Services

| Service | Required? | How to run |
|---------|-----------|------------|
| Vite dev server | For local preview | `npm run dev` → `http://127.0.0.1:5173` |
| Vite preview | Production build preview | `npm run preview` → `http://127.0.0.1:4173` |

### Install

```bash
npm install
```

### Lint / test / build

```bash
npm run build
npm run preview
```

No dedicated lint or unit-test scripts are configured yet.

### Adding dependencies

After changing `package.json`, keep `package-lock.json` committed. Update this file if the dev-server command or ports change.
