import { describe, expect, it } from "vitest";
import { readModelsResponse } from "@/lib/useOpenRouterModels";

describe("readModelsResponse", () => {
  it("returns a clear error for HTML responses", async () => {
    const response = new Response("<!DOCTYPE html><html><body>Not found</body></html>", {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });

    const result = await readModelsResponse(response);

    expect(result.models).toEqual([]);
    expect(result.error).toContain("Model API route not reachable");
  });

  it("returns a clear error for non-JSON non-HTML responses", async () => {
    const response = new Response("upstream unavailable", {
      status: 502,
      headers: { "Content-Type": "text/plain" },
    });

    const result = await readModelsResponse(response);

    expect(result.models).toEqual([]);
    expect(result.error).toBe("Model API returned a non-JSON response.");
  });
});
