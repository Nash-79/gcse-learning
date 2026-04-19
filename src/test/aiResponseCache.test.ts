import { describe, it, expect, beforeEach } from "vitest";
import { aiCache, buildKey, djb2, isCachingDisabled, setCachingDisabled, formatCachedAgo, migrateLegacyCaches } from "@/lib/aiResponseCache";

beforeEach(() => {
  localStorage.clear();
});

describe("djb2 / buildKey", () => {
  it("produces stable hashes", () => {
    expect(djb2("hello")).toBe(djb2("hello"));
    expect(djb2("hello")).not.toBe(djb2("world"));
  });
  it("normalises whitespace and case in buildKey", () => {
    expect(buildKey(["Hello  World"])).toBe(buildKey(["hello world"]));
  });
});

describe("aiCache basic flow", () => {
  it("set then get returns content", () => {
    aiCache.set("task-assistant", "k1", { content: "abc", model: "x" });
    const got = aiCache.get("task-assistant", "k1");
    expect(got?.content).toBe("abc");
    expect(got?.model).toBe("x");
  });

  it("returns null on miss", () => {
    expect(aiCache.get("task-assistant", "missing")).toBeNull();
  });

  it("respects bypass option", () => {
    aiCache.set("task-assistant", "k1", { content: "abc" });
    expect(aiCache.get("task-assistant", "k1", { bypass: true })).toBeNull();
    expect(aiCache.get("task-assistant", "k1")).not.toBeNull();
  });

  it("expires entries past maxAgeMs", () => {
    aiCache.set("task-assistant", "k1", { content: "abc", createdAt: Date.now() - 10_000 });
    expect(aiCache.get("task-assistant", "k1", { maxAgeMs: 5_000 })).toBeNull();
    expect(aiCache.get("task-assistant", "k1", { maxAgeMs: 60_000 })).toBeNull(); // already deleted
  });

  it("invalidate removes a single entry", () => {
    aiCache.set("task-assistant", "a", { content: "1" });
    aiCache.set("task-assistant", "b", { content: "2" });
    aiCache.invalidate("task-assistant", "a");
    expect(aiCache.get("task-assistant", "a")).toBeNull();
    expect(aiCache.get("task-assistant", "b")?.content).toBe("2");
  });

  it("clearNamespace wipes one namespace", () => {
    aiCache.set("task-assistant", "a", { content: "1" });
    aiCache.set("topic-explainer", "b", { content: "2" });
    expect(aiCache.clearNamespace("task-assistant")).toBe(1);
    expect(aiCache.get("task-assistant", "a")).toBeNull();
    expect(aiCache.get("topic-explainer", "b")?.content).toBe("2");
  });

  it("clearAll wipes everything", () => {
    aiCache.set("task-assistant", "a", { content: "1" });
    aiCache.set("topic-explainer", "b", { content: "2" });
    aiCache.set("ai-tutor", "c", { content: "3" });
    expect(aiCache.clearAll()).toBe(3);
  });

  it("LRU eviction beyond cap drops oldest", () => {
    // ai-tutor cap is 40 — push 42, oldest 2 should be evicted.
    for (let i = 0; i < 42; i++) {
      aiCache.set("ai-tutor", `k${i}`, { content: String(i), createdAt: Date.now() + i });
    }
    const stats = aiCache.stats("ai-tutor");
    expect(stats.count).toBe(40);
    // Oldest two (k0, k1) gone; newest (k41) present.
    expect(aiCache.get("ai-tutor", "k0")).toBeNull();
    expect(aiCache.get("ai-tutor", "k1")).toBeNull();
    expect(aiCache.get("ai-tutor", "k41")?.content).toBe("41");
  });
});

describe("aiCache disable toggle", () => {
  it("makes get return null and set a no-op", () => {
    setCachingDisabled(true);
    expect(isCachingDisabled()).toBe(true);
    aiCache.set("task-assistant", "k1", { content: "abc" });
    expect(aiCache.get("task-assistant", "k1")).toBeNull();
    setCachingDisabled(false);
    expect(isCachingDisabled()).toBe(false);
  });
});

describe("formatCachedAgo", () => {
  it("returns relative strings", () => {
    expect(formatCachedAgo(Date.now())).toBe("just now");
    expect(formatCachedAgo(Date.now() - 5 * 60_000)).toMatch(/m ago/);
    expect(formatCachedAgo(Date.now() - 3 * 3_600_000)).toMatch(/h ago/);
    expect(formatCachedAgo(Date.now() - 2 * 86_400_000)).toBe("2 days ago");
  });
});

describe("migrateLegacyCaches", () => {
  it("imports pylearn-task-assistant:v1 once", () => {
    localStorage.setItem("pylearn-task-assistant:v1", JSON.stringify({ legacyKey: "old content" }));
    migrateLegacyCaches();
    expect(aiCache.get("task-assistant", "legacyKey")?.content).toBe("old content");
    // Idempotent.
    aiCache.invalidate("task-assistant", "legacyKey");
    migrateLegacyCaches();
    expect(aiCache.get("task-assistant", "legacyKey")).toBeNull();
  });
});
