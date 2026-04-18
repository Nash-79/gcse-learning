import { describe, it, expect, beforeEach } from "vitest";

const STORAGE_KEY = "pylearn-ai-settings";
const SESSION_API_KEY = "pylearn-ai-settings-api-key";

function loadSettings() {
  const readSessionApiKey = () => sessionStorage.getItem(SESSION_API_KEY) || "";

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const legacyApiKey = typeof parsed.apiKey === "string" ? parsed.apiKey : "";
      if (legacyApiKey && !readSessionApiKey()) {
        sessionStorage.setItem(SESSION_API_KEY, legacyApiKey);
      }
      const provider = parsed.provider === "lovable" ? "lovable" : (parsed.provider || "openrouter");
      return {
        apiKey: readSessionApiKey(),
        model: parsed.model || "meta-llama/llama-3.3-70b-instruct:free",
        provider,
        routePolicies: parsed.routePolicies || undefined,
      };
    }
  } catch {}
  return { apiKey: readSessionApiKey(), model: "meta-llama/llama-3.3-70b-instruct:free", provider: "openrouter" };
}

describe("AI Settings persistence", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
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

  it("preserves lovable provider", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      apiKey: "sk-test",
      provider: "lovable",
    }));
    const s = loadSettings();
    expect(s.provider).toBe("lovable");
  });

  it("prefers session storage for api keys", () => {
    sessionStorage.setItem(SESSION_API_KEY, "sk-session");
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      apiKey: "sk-legacy",
      provider: "openrouter",
    }));
    const s = loadSettings();
    expect(s.apiKey).toBe("sk-session");
  });
});
