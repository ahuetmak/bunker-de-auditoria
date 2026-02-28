# Bunker

Orquestador de Auditoría Dual — detecta imágenes generadas por IA y manipulación digital.

## Motores

| Motor | Detección |
|-------|-----------|
| **Hive AI** | Imágenes generadas por IA / deepfakes |
| **Sightengine** | Edición con Photoshop / manipulación / scam |

## Quick Start

```bash
npm install
cp .env.example .env   # Completar con tus API keys
npm run dev
```

## API

### `GET /health`

Verifica el estado del servidor y si las API keys están configuradas.

### `POST /audit`

Ejecuta la auditoría dual sobre una imagen.

```bash
curl -X POST http://localhost:3000/audit \
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
| `npm run dev` | Servidor con hot-reload |
| `npm start` | Servidor en producción |
| `npm run lint` | Ejecutar ESLint |
| `npm test` | Ejecutar tests |

## Variables de Entorno

| Variable | Descripción |
|----------|-------------|
| `HIVE_KEY` | Token de API de Hive AI |
| `SE_USER` | User ID de Sightengine |
| `SE_KEY` | API Key de Sightengine |
| `PORT` | Puerto del servidor (default: 3000) |
