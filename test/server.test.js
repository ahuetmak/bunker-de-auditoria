import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";

const PORT = 0;
let server;
let baseUrl;

function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200);
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }

  if (req.method === "POST" && req.url === "/audit") {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      const body = Buffer.concat(chunks).toString();
      try {
        const { imageUrl } = JSON.parse(body);
        if (!imageUrl) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: "imageUrl is required" }));
          return;
        }
        res.writeHead(200);
        res.end(JSON.stringify({ received: imageUrl }));
      } catch {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: "Not found" }));
}

describe("HTTP server", () => {
  before(() => {
    return new Promise((resolve) => {
      server = createServer(handler);
      server.listen(PORT, () => {
        const addr = server.address();
        baseUrl = `http://localhost:${addr.port}`;
        resolve();
      });
    });
  });

  after(() => {
    return new Promise((resolve) => {
      server.close(resolve);
    });
  });

  it("GET /health returns 200 with status ok", async () => {
    const res = await fetch(`${baseUrl}/health`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.status, "ok");
  });

  it("POST /audit returns 400 when imageUrl is missing", async () => {
    const res = await fetch(`${baseUrl}/audit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.error, "imageUrl is required");
  });

  it("POST /audit returns 200 with valid imageUrl", async () => {
    const res = await fetch(`${baseUrl}/audit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl: "https://example.com/image.jpg" }),
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.received, "https://example.com/image.jpg");
  });

  it("returns 404 for unknown routes", async () => {
    const res = await fetch(`${baseUrl}/unknown`);
    assert.equal(res.status, 404);
  });
});
