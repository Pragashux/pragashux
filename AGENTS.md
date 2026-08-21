# AGENTS.md

Guidance for AI agents and developers working in this repository.

## Project overview

**pragashux** is Pragash Santhakumar's story-driven UX portfolio (Next.js 15, React 19, TypeScript). Project and biography content is centralized in `src/content/site.ts`.

## Cursor Cloud specific instructions

### Repository state

- **Branch:** `main` (feature work on `cursor/*`)
- **Stack:** Next.js App Router
- **Install:** `npm install`

### Available VM tooling

| Tool    | Version (approx.) |
|---------|-------------------|
| Node.js | 22.x              |
| npm     | 10.x              |
| Python  | 3.12.x            |

Docker is not installed in the default cloud VM.

### Services

| Service | Required? | How to run |
|---------|-----------|------------|
| Next.js portfolio | Yes | `npm install && npm run dev` |

Dev server: `http://127.0.0.1:3000`

### Lint / test / build

```bash
npm install
npm run lint
npm run build
```

There is no dedicated test suite yet. Visual QA: homepage, a featured case study (`/work/finro`), `/resume`, desktop (~1440) and mobile (~390) widths.

### Adding or editing projects

1. Add images under `public/projects/`.
2. Edit `src/content/site.ts`.
3. Do not invent metrics, companies, quotes, or research findings. Use `[CONTENT NEEDED]` when facts are missing.
