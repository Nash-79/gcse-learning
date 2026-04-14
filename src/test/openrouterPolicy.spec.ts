import { describe, expect, it } from "vitest";
import { getOrderedPolicyCandidates, normalizePolicyInput } from "../../server/routes/openrouterPolicy";

describe("OpenRouter policy helpers", () => {
  it("orders candidates from saved policy configuration instead of route defaults", () => {
    expect(getOrderedPolicyCandidates("google/gemma-3-4b-it:free", {
      primaryModel: "qwen/qwen3-4b:free",
      fallbackModelIds: [
        "meta-llama/llama-3.2-3b-instruct:free",
        "google/gemma-3-4b-it:free",
      ],
    })).toEqual([
      "qwen/qwen3-4b:free",
      "meta-llama/llama-3.2-3b-instruct:free",
      "google/gemma-3-4b-it:free",
    ]);
  });

  it("normalizes duplicate models and applies sane attempt bounds", () => {
    const policy = normalizePolicyInput("google/gemma-3-4b-it:free", {
      routeKey: "tutor_stream",
      primaryModel: "google/gemma-3-4b-it:free",
      fallbackModelIds: [
        "google/gemma-3-4b-it:free",
        "qwen/qwen3-4b:free",
        "qwen/qwen3-4b:free",
      ],
      maxAttempts: 99,
    });

    expect(policy.primaryModel).toBe("google/gemma-3-4b-it:free");
    expect(policy.fallbackModelIds).toEqual(["qwen/qwen3-4b:free"]);
    expect(policy.maxAttempts).toBeLessThanOrEqual(4);
  });
});
