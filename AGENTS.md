# AGENTS.md

Guidance for AI agents and developers working in this repository.

## Project overview

**pragashux** hosts **AI LearnOS** (Flutter Android LMS + FastAPI backend) and **A11y Lens** (Figma plugin).

## Cursor Cloud specific instructions

### Available VM tooling

| Tool    | Version (approx.) |
|---------|-------------------|
| Node.js | 22.x              |
| npm     | 10.x              |
| pnpm    | 10.x              |
| yarn    | 1.22.x            |
| Python  | 3.12.x            |
| Git     | 2.43.x            |
| Flutter | /opt/flutter      |

Docker is not installed in the default cloud VM.

### Services

| Service | Required? | How to run |
|---------|-----------|------------|
| LearnOS API | For live backend | `cd backend && uvicorn app.main:app --host 127.0.0.1 --port 8000` |
| Flutter app | Primary client | `flutter run` (demo mode uses mock repositories without the API) |

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
export PATH="/opt/flutter/bin:$PATH"
flutter analyze
flutter test
```

Backend:

```bash
cd backend
python3 -m pip install -r requirements.txt
python3 -m pytest
```

Figma plugin (`a11y-lens/`):

```bash
npm run typecheck
npm test
npm run build
```
