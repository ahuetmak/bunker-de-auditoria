# AGENTS.md

## Cursor Cloud specific instructions

### Overview

**Bunker** is a Dual Audit Orchestrator that runs two image-analysis engines in parallel:
- **Hive AI** — detects AI-generated images / deepfakes
- **Sightengine** — detects Photoshop manipulation / scam content

The server exposes a simple HTTP API (`/health`, `/audit`).

### Commands

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Dev (watch) | `npm run dev` |
| Start | `npm start` |
| Lint | `npm run lint` |
| Tests | `npm test` |

### Environment variables

The server runs without API keys (health endpoint works), but `/audit` returns 503 until these are set in a `.env` file or exported:
- `HIVE_KEY` — Hive AI API token
- `SE_USER` — Sightengine user ID
- `SE_KEY` — Sightengine API key

See `.env.example` for the template.

### Non-obvious notes

- Node.js >= 22 is required (uses native `fetch` and `node --test`).
- `npm run dev` uses `node --watch` for hot reload — no need for nodemon.
- Tests use the **Node.js built-in test runner** (`node:test`), not Jest or Vitest.
- ESLint uses flat config (`eslint.config.js`), not legacy `.eslintrc`.
