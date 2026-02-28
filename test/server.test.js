import { describe, it } from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.js";

const ENV_EMPTY = {};
const ENV_FULL = { HIVE_KEY: "test", SE_USER: "test", SE_KEY: "test" };

function req(method, path, body) {
  const url = `https://bunker.test${path}`;
  const opts = { method };
  if (body) {
    opts.body = JSON.stringify(body);
    opts.headers = { "Content-Type": "application/json" };
  }
  return new Request(url, opts);
}

describe("Workers handler", () => {
  it("GET /health returns 200 with status ok", async () => {
    const res = await worker.fetch(req("GET", "/health"), ENV_EMPTY);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, "ok");
    assert.equal(data.keysConfigured, false);
    assert.deepEqual(data.missing, ["HIVE_KEY", "SE_USER", "SE_KEY"]);
  });

  it("GET /health reports keysConfigured true when all keys present", async () => {
    const res = await worker.fetch(req("GET", "/health"), ENV_FULL);
    const data = await res.json();
    assert.equal(data.keysConfigured, true);
    assert.deepEqual(data.missing, []);
  });

  it("POST /audit returns 400 when imageUrl is missing", async () => {
    const res = await worker.fetch(req("POST", "/audit", {}), ENV_FULL);
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.error, "imageUrl is required");
  });

  it("POST /audit returns 503 when API keys are missing", async () => {
    const res = await worker.fetch(
      req("POST", "/audit", { imageUrl: "https://example.com/img.jpg" }),
      ENV_EMPTY,
    );
    assert.equal(res.status, 503);
    const data = await res.json();
    assert.equal(data.error, "Missing API keys");
  });

  it("returns 404 for unknown routes", async () => {
    const res = await worker.fetch(req("GET", "/unknown"), ENV_EMPTY);
    assert.equal(res.status, 404);
    const data = await res.json();
    assert.equal(data.error, "Not found");
  });
});
