import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { computeVerdict } from "../src/audit.js";

describe("computeVerdict", () => {
  it("returns 'ai_generated' when Hive AI score is above 0.85", () => {
    const hive = {
      status_code: 200,
      output: [{ classes: [{ class: "ai_generated", score: 0.95 }] }],
    };
    const se = { scam: { prob: 0.1 } };
    assert.equal(computeVerdict(hive, se), "ai_generated");
  });

  it("returns 'manipulated' when Sightengine scam score is above 0.80", () => {
    const hive = {
      status_code: 200,
      output: [{ classes: [{ class: "ai_generated", score: 0.1 }] }],
    };
    const se = { scam: { prob: 0.9 } };
    assert.equal(computeVerdict(hive, se), "manipulated");
  });

  it("returns 'suspicious' when scores are in the mid range", () => {
    const hive = {
      status_code: 200,
      output: [{ classes: [{ class: "ai_generated", score: 0.6 }] }],
    };
    const se = { scam: { prob: 0.3 } };
    assert.equal(computeVerdict(hive, se), "suspicious");
  });

  it("returns 'authentic' when all scores are low", () => {
    const hive = {
      status_code: 200,
      output: [{ classes: [{ class: "ai_generated", score: 0.1 }] }],
    };
    const se = { scam: { prob: 0.1 } };
    assert.equal(computeVerdict(hive, se), "authentic");
  });

  it("returns 'inconclusive' when Hive returns an error", () => {
    const hive = { error: true, status: 401, message: "Unauthorized" };
    const se = { scam: { prob: 0.1 } };
    assert.equal(computeVerdict(hive, se), "inconclusive");
  });

  it("returns 'inconclusive' when Sightengine returns an error", () => {
    const hive = {
      status_code: 200,
      output: [{ classes: [{ class: "ai_generated", score: 0.1 }] }],
    };
    const se = { error: true, status: 403, message: "Forbidden" };
    assert.equal(computeVerdict(hive, se), "inconclusive");
  });

  it("returns 'inconclusive' when both return errors", () => {
    const hive = { error: true };
    const se = { error: true };
    assert.equal(computeVerdict(hive, se), "inconclusive");
  });

  it("returns 'inconclusive' when scores cannot be extracted", () => {
    const hive = { status_code: 200, output: [] };
    const se = {};
    assert.equal(computeVerdict(hive, se), "inconclusive");
  });
});
