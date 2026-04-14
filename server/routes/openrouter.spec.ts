// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";
import { executeOpenRouterPolicy } from "./openrouter";

vi.mock("./openrouterStore.js", () => ({
  loadModelCatalogFromDb: vi.fn(async () => null),
  saveModelCatalogToDb: vi.fn(async () => undefined),
}));

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    status: init?.status ?? 200,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
}

describe("executeOpenRouterPolicy", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    delete process.env.LOVABLE_API_KEY;
  });

  it("uses the saved route policy order for retries and returns final-model metadata", async () => {
    const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => undefined);
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse({
        data: [
          {
            id: "google/gemma-3-4b-it:free",
            name: "Gemma 3 4B IT",
            pricing: { prompt: 0, completion: 0 },
          },
          {
            id: "qwen/qwen3-4b:free",
            name: "Qwen 3 4B",
            pricing: { prompt: 0, completion: 0 },
          },
        ],
      }))
      .mockResolvedValueOnce(jsonResponse({ error: "rate limited" }, { status: 429 }))
      .mockResolvedValueOnce(jsonResponse({
        choices: [{ message: { content: "ok" } }],
      }));

    vi.stubGlobal("fetch", fetchMock);

    const result = await executeOpenRouterPolicy("test-key", {
      model: "google/gemma-3-4b-it:free",
      messages: [{ role: "user", content: "Explain loops" }],
    }, {
      routeKey: "helper_chat",
      selectionIntent: "reasoning_first",
      primaryModel: "qwen/qwen3-4b:free",
      fallbackModelIds: ["google/gemma-3-4b-it:free"],
      maxAttempts: 2,
      slowThresholdMs: 4000,
      retryOn: ["rate_limit", "provider_error"],
    });

    const firstAttemptBody = JSON.parse(fetchMock.mock.calls[1][1].body as string);
    const secondAttemptBody = JSON.parse(fetchMock.mock.calls[2][1].body as string);

    expect(firstAttemptBody.model).toBe("qwen/qwen3-4b:free");
    expect(secondAttemptBody.model).toBe("google/gemma-3-4b-it:free");
    expect(result.meta.selectedPolicyModelIds).toEqual([
      "qwen/qwen3-4b:free",
      "google/gemma-3-4b-it:free",
    ]);
    expect(result.meta.finalModelId).toBe("google/gemma-3-4b-it:free");
    expect(result.meta.finalModelLabel).toBe("Gemma 3 4B IT");
    expect(result.meta.usedFallback).toBe(true);
    expect(result.meta.policySource).toBe("settings_saved");
    expect(result.meta.attempts.map((attempt) => attempt.outcome)).toEqual(["rate_limit", "success"]);
    expect(consoleSpy).toHaveBeenCalledWith(
      "[openrouter.policy]",
      expect.stringContaining("\"finalModelId\":\"google/gemma-3-4b-it:free\"")
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      "[openrouter.policy]",
      expect.stringContaining("\"selectedPolicyModelIds\":[\"qwen/qwen3-4b:free\",\"google/gemma-3-4b-it:free\"]")
    );
  });

  it("defaults to the requested model when no saved route policy is provided", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse({
        data: [
          {
            id: "google/gemma-3-4b-it:free",
            name: "Gemma 3 4B IT",
            pricing: { prompt: 0, completion: 0 },
          },
        ],
      }))
      .mockResolvedValueOnce(jsonResponse({
        choices: [{ message: { content: "ok" } }],
      }));

    vi.stubGlobal("fetch", fetchMock);

    const result = await executeOpenRouterPolicy("test-key", {
      model: "google/gemma-3-4b-it:free",
      messages: [{ role: "user", content: "Test" }],
    });

    const lastCall = fetchMock.mock.calls[fetchMock.mock.calls.length - 1];
    const attemptBody = JSON.parse(lastCall[1].body as string);
    expect(attemptBody.model).toBe("google/gemma-3-4b-it:free");
    expect(result.meta.selectedPolicyModelIds).toEqual(["google/gemma-3-4b-it:free"]);
    expect(result.meta.policySource).toBe("settings_generated");
    expect(result.meta.usedFallback).toBe(false);
  });

  it("uses Lovable fallback when OpenRouter candidates are exhausted", async () => {
    process.env.LOVABLE_API_KEY = "lovable-key";

    const fetchMock = vi.fn(async (url: string) => {
      if (url.includes("/models")) {
        return jsonResponse({
          data: [
            {
              id: "google/gemma-3-4b-it:free",
              name: "Gemma 3 4B IT",
              pricing: { prompt: 0, completion: 0 },
            },
          ],
        });
      }
      if (url.includes("openrouter.ai/api/v1/chat/completions")) {
        return jsonResponse({ error: "provider error" }, { status: 500 });
      }
      if (url.includes("ai.gateway.lovable.dev/v1/chat/completions")) {
        return jsonResponse({
          choices: [{ message: { content: "lovable answer" } }],
        });
      }
      return jsonResponse({ error: "unexpected url" }, { status: 500 });
    });

    vi.stubGlobal("fetch", fetchMock);

    const result = await executeOpenRouterPolicy("openrouter-key", {
      model: "google/gemma-3-4b-it:free",
      messages: [{ role: "user", content: "Explain pseudocode" }],
    }, {
      routeKey: "topic_chat",
      selectionIntent: "balanced",
      primaryModel: "google/gemma-3-4b-it:free",
      fallbackModelIds: [],
      maxAttempts: 1,
      slowThresholdMs: 4000,
      retryOn: ["provider_error"],
    });

    const lovableCall = fetchMock.mock.calls.find((call) =>
      String(call[0]).includes("ai.gateway.lovable.dev/v1/chat/completions")
    );
    expect(lovableCall).toBeDefined();
    const lovableBody = JSON.parse(lovableCall![1].body as string);

    expect(lovableCall![0]).toBe("https://ai.gateway.lovable.dev/v1/chat/completions");
    expect(lovableCall![1].headers.Authorization).toBe("Bearer lovable-key");
    expect(lovableBody.model).toBe("google/gemini-2.5-flash");
    expect(result.meta.finalModelId).toBe("lovable/google/gemini-2.5-flash");
    expect(result.meta.finalModelLabel).toBe("Lovable Gemini 2.5 Flash");
    expect(result.meta.usedFallback).toBe(true);
    expect(result.meta.selectedPolicyModelIds).toEqual([
      "google/gemma-3-4b-it:free",
      "lovable/google/gemini-2.5-flash",
    ]);
  });
});
