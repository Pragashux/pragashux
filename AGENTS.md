# AGENTS.md

Guidance for AI agents and developers working in this repository.

## Project overview

**pragashux** contains:

1. **Vibrant LMS** — Flutter student/admin LMS at the repository root (`lib/`, `android/`, `ios/`).
2. **Snailtechs Academy website** — React + TypeScript + Tailwind marketing site in `web/`.

## Cursor Cloud specific instructions

### Repository state

- Default branch: `main`
- Website app lives in `web/`
- Flutter app remains at the repo root

### Available VM tooling

| Tool | Version (approx.) |
|------|-------------------|
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
| Academy website (Vite) | For web preview | `cd web && npm install && npm run dev` → http://127.0.0.1:5173 |
| Flutter LMS | Optional | `flutter pub get && flutter run` |

### Lint / test / build

**Website (`web/`)**

```bash
cd web
npm install
npm run lint
npm run build
npm run preview   # http://127.0.0.1:4173
```

**Flutter LMS (root)**

```bash
flutter analyze
flutter test
```

### Local preview

Academy website:

```bash
cd web
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

### Content rules for Snailtechs Academy

- Edit structured data in `web/src/data/` rather than hardcoding copy in components.
- Fees live in `web/src/data/pricing.ts`. Keep values `null` until the academy confirms numbers (UI shows `₹XX,XXX`).
- Do not invent placement percentages, salary stats, hiring partners, awards, or unverified testimonials.
