import { describe, it, expect } from "vitest";
import { extractMeta } from "@/lib/aiResponseMeta";

describe("extractMeta", () => {
  it("returns undefined for null/undefined", () => {
    expect(extractMeta(null)).toBeUndefined();
    expect(extractMeta(undefined)).toBeUndefined();
  });

  it("returns undefined when no meta field", () => {
    expect(extractMeta({ content: "hello" })).toBeUndefined();
  });

  it("extracts valid meta", () => {
    const result = extractMeta({
      content: "hello",
      meta: {
        finalModelId: "google/gemma-3-4b-it:free",
        finalModelLabel: "Gemma 3 4B",
        usedFallback: true,
        degraded: false,
        attemptCount: 2,
        elapsedMs: 1500,
      },
    });
    expect(result).toBeDefined();
    expect(result!.finalModelId).toBe("google/gemma-3-4b-it:free");
    expect(result!.finalModelLabel).toBe("Gemma 3 4B");
    expect(result!.usedFallback).toBe(true);
    expect(result!.degraded).toBe(false);
    expect(result!.attemptCount).toBe(2);
    expect(result!.elapsedMs).toBe(1500);
  });

  it("handles partial meta gracefully", () => {
    const result = extractMeta({
      meta: { finalModelLabel: "Test Model" },
    });
    expect(result).toBeDefined();
    expect(result!.finalModelLabel).toBe("Test Model");
    expect(result!.usedFallback).toBeUndefined();
    expect(result!.attemptCount).toBeUndefined();
  });

  it("ignores non-object meta", () => {
    expect(extractMeta({ meta: "string" })).toBeUndefined();
    expect(extractMeta({ meta: 42 })).toBeUndefined();
  });
});
