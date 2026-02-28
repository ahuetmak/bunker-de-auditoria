# Bunker

Orquestador de Auditoría Dual en **Cloudflare Workers** — detecta imágenes generadas por IA y manipulación digital.

## Motores

| Motor | Detección |
|-------|-----------|
| **Hive AI** | Imágenes generadas por IA / deepfakes |
| **Sightengine** | Edición con Photoshop / manipulación / scam |

## Quick Start

```bash
npm install
cp .env.example .dev.vars   # Completar con tus API keys reales
npm run dev                  # Inicia wrangler dev en http://localhost:8787
```

## Deploy a Cloudflare

```bash
# Configurar secrets en producción
wrangler secret put HIVE_KEY
wrangler secret put SE_USER
wrangler secret put SE_KEY

# Deploy
npm run deploy
```

## API

### `GET /health`

Verifica el estado del Worker y si las API keys están configuradas.

### `POST /audit`

Ejecuta la auditoría dual sobre una imagen.

```bash
curl -X POST https://bunker.<tu-subdomain>.workers.dev/audit \
  -H "Content-Type: application/json" \
  -d '{"imageUrl": "https://example.com/image.jpg"}'
```

**Respuesta:**

```json
{
  "hive": { "..." },
  "sightengine": { "..." },
  "verdict": "authentic | suspicious | ai_generated | manipulated | inconclusive"
}
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Worker local con wrangler dev (workerd) |
| `npm run deploy` | Deploy a Cloudflare Workers |
| `npm run lint` | Ejecutar ESLint |
| `npm test` | Ejecutar tests |
| `npm run tail` | Logs en tiempo real de producción |

## Secrets

| Variable | Descripción |
|----------|-------------|
| `HIVE_KEY` | Token de API de Hive AI |
| `SE_USER` | User ID de Sightengine |
| `SE_KEY` | API Key de Sightengine |

Local: configura en `.dev.vars`. Producción: `wrangler secret put <NAME>`.
