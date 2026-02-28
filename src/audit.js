/**
 * Orquestador de Auditoría Dual
 * Ejecuta en paralelo dos motores de detección:
 *   - Hive AI: detecta imágenes generadas por IA / deepfakes
 *   - Sightengine: detecta edición con Photoshop / manipulación
 */

export async function runAudit(imageUrl, env) {
  const [hiveResult, seResult] = await Promise.all([
    auditHive(imageUrl, env),
    auditSightengine(imageUrl, env),
  ]);

  const verdict = computeVerdict(hiveResult, seResult);
  return { hive: hiveResult, sightengine: seResult, verdict };
}

async function auditHive(imageUrl, env) {
  const res = await fetch("https://api.thehive.ai/api/v2/task/sync", {
    method: "POST",
    headers: {
      "Authorization": `token ${env.HIVE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      media: { url: imageUrl },
      models: [{ slug: "ai_generated_image_detection" }],
    }),
  });

  if (!res.ok) {
    return { error: true, status: res.status, message: await res.text() };
  }
  return res.json();
}

async function auditSightengine(imageUrl, env) {
  const params = new URLSearchParams({
    url: imageUrl,
    models: "scam,properties",
    api_user: env.SE_USER,
    api_key: env.SE_KEY,
  });

  const res = await fetch(
    `https://api.sightengine.com/1.0/check.json?${params}`,
  );

  if (!res.ok) {
    return { error: true, status: res.status, message: await res.text() };
  }
  return res.json();
}

export function computeVerdict(hive, se) {
  if (hive?.error || se?.error) return "inconclusive";

  const aiScore = extractHiveAiScore(hive);
  const scamScore = se?.scam?.prob ?? null;

  if (aiScore === null && scamScore === null) return "inconclusive";
  if (aiScore !== null && aiScore > 0.85) return "ai_generated";
  if (scamScore !== null && scamScore > 0.80) return "manipulated";
  if (
    (aiScore !== null && aiScore > 0.5) ||
    (scamScore !== null && scamScore > 0.5)
  )
    return "suspicious";

  return "authentic";
}

function extractHiveAiScore(hive) {
  try {
    const classes =
      hive?.status_code === 200
        ? hive?.output?.[0]?.classes ?? []
        : [];
    const aiClass = classes.find((c) => c.class === "ai_generated");
    return aiClass?.score ?? null;
  } catch {
    return null;
  }
}
