import { runAudit } from "./audit.js";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function validateEnv(env) {
  const missing = [];
  if (!env.HIVE_KEY) missing.push("HIVE_KEY");
  if (!env.SE_USER) missing.push("SE_USER");
  if (!env.SE_KEY) missing.push("SE_KEY");
  return { valid: missing.length === 0, missing };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/health") {
      const { valid, missing } = validateEnv(env);
      return json({ status: "ok", keysConfigured: valid, missing });
    }

    if (request.method === "POST" && url.pathname === "/audit") {
      try {
        const body = await request.json();
        const { imageUrl } = body;

        if (!imageUrl) {
          return json({ error: "imageUrl is required" }, 400);
        }

        const { valid, missing } = validateEnv(env);
        if (!valid) {
          return json({ error: "Missing API keys", missing }, 503);
        }

        const result = await runAudit(imageUrl, env);
        return json(result);
      } catch (err) {
        return json({ error: err.message }, 500);
      }
    }

    return json({ error: "Not found" }, 404);
  },
};
