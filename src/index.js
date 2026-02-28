import { createServer } from "node:http";
import { config, validateConfig } from "./config.js";
import { runAudit } from "./audit.js";

const server = createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.method === "GET" && req.url === "/health") {
    const { valid, missing } = validateConfig();
    res.writeHead(200);
    res.end(JSON.stringify({ status: "ok", keysConfigured: valid, missing }));
    return;
  }

  if (req.method === "POST" && req.url === "/audit") {
    try {
      const body = await readBody(req);
      const { imageUrl } = JSON.parse(body);

      if (!imageUrl) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "imageUrl is required" }));
        return;
      }

      const { valid, missing } = validateConfig();
      if (!valid) {
        res.writeHead(503);
        res.end(
          JSON.stringify({
            error: "Missing API keys",
            missing,
          }),
        );
        return;
      }

      const result = await runAudit(imageUrl, {
        HIVE_KEY: config.hiveKey,
        SE_USER: config.seUser,
        SE_KEY: config.seKey,
      });

      res.writeHead(200);
      res.end(JSON.stringify(result));
    } catch (err) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: "Not found" }));
});

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString()));
    req.on("error", reject);
  });
}

server.listen(config.port, () => {
  console.log(`🛡️  Bunker Audit Server running on http://localhost:${config.port}`);
  console.log(`   Health: GET  /health`);
  console.log(`   Audit:  POST /audit  { "imageUrl": "..." }`);

  const { valid, missing } = validateConfig();
  if (!valid) {
    console.log(`⚠️  Missing API keys: ${missing.join(", ")}`);
    console.log(`   Set them in .env or as environment variables`);
  }
});
