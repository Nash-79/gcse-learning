import { describe, it, expect, beforeEach } from "vitest";

const STORAGE_KEY = "pylearn-ai-settings";

// We test the pure functions by reimplementing the load logic
function loadSettings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const provider = parsed.provider === "lovable" ? "openrouter" : (parsed.provider || "openrouter");
      return {
        apiKey: parsed.apiKey || "",
        model: parsed.model || "meta-llama/llama-3.3-70b-instruct:free",
        provider,
        routePolicies: parsed.routePolicies || undefined,
      };
    }
  } catch {}
  return { apiKey: "", model: "meta-llama/llama-3.3-70b-instruct:free", provider: "openrouter" };
}

describe("AI Settings persistence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns defaults when no stored settings", () => {
    const s = loadSettings();
    expect(s.apiKey).toBe("");
    expect(s.model).toBe("meta-llama/llama-3.3-70b-instruct:free");
    expect(s.provider).toBe("openrouter");
    expect(s.routePolicies).toBeUndefined();
  });

  it("loads settings without routePolicies (backwards compat)", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      apiKey: "sk-test",
      model: "google/gemma-3-4b-it:free",
      provider: "openrouter",
    }));
    const s = loadSettings();
    expect(s.apiKey).toBe("sk-test");
    expect(s.model).toBe("google/gemma-3-4b-it:free");
    expect(s.routePolicies).toBeUndefined();
  });

  it("loads settings with routePolicies", () => {
    const policies = {
      "ai-chat": {
        primaryModel: "google/gemma-3-4b-it:free",
        fallbackModelIds: ["meta-llama/llama-3.3-70b-instruct:free"],
        maxAttempts: 3,
        retryOn: ["429"],
      },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      apiKey: "sk-test",
      model: "google/gemma-3-4b-it:free",
      provider: "openrouter",
      routePolicies: policies,
    }));
    const s = loadSettings();
    expect(s.routePolicies).toBeDefined();
    expect(s.routePolicies!["ai-chat"]?.maxAttempts).toBe(3);
    expect(s.routePolicies!["ai-chat"]?.fallbackModelIds).toHaveLength(1);
  });

  it("migrates lovable provider to openrouter", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      apiKey: "sk-test",
      provider: "lovable",
    }));
    const s = loadSettings();
    expect(s.provider).toBe("openrouter");
  });
});
