# AGENTS.md

## Cursor Cloud specific instructions

### Overview

**Bunker** es un Cloudflare Worker que orquesta auditoría dual de imágenes:
- **Hive AI** — detecta imágenes generadas por IA / deepfakes
- **Sightengine** — detecta manipulación con Photoshop / scam

### Commands

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Dev (local workerd) | `npm run dev` |
| Deploy | `npm run deploy` |
| Lint | `npm run lint` |
| Tests | `npm test` |
| Prod logs | `npm run tail` |

### Non-obvious notes

- `wrangler dev` corre el Worker en **workerd** (runtime real de Cloudflare), no Node.js. El servidor local escucha en **puerto 8787**.
- Las variables secretas locales van en **`.dev.vars`** (no `.env`). Este archivo está en `.gitignore`.
- Para producción las secrets se configuran con `wrangler secret put <NAME>`.
- `src/audit.js` usa solo Web APIs (`fetch`, `URL`, `URLSearchParams`) — es 100% compatible con Workers sin polyfills.
- Los tests corren con `node:test` (built-in), no Jest/Vitest. Importan el handler directamente y lo invocan con `Request`/`Response` estándar.
- ESLint usa flat config con `globals.serviceworker` para el source y `globals.node` para tests.
- El deploy requiere autenticación con Cloudflare: `wrangler login` o `CLOUDFLARE_API_TOKEN` env var.
