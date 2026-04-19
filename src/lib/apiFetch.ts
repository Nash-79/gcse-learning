import { supabase } from "@/integrations/supabase/client";

function isAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

/**
 * Map an /api/... path to a Supabase edge function name (or null if there's no
 * edge function counterpart). When the published Lovable site has no Express
 * backend, we transparently route AI calls through the existing edge functions.
 */
function mapApiPathToEdgeFunction(path: string): string | null {
  // Strip leading slash and any query string
  const clean = path.replace(/^\/+/, "").split("?")[0];
  // Supported mappings — keep in sync with supabase/functions/*
  const map: Record<string, string> = {
    "api/ai-chat": "ai-chat",
    "api/gcse-chat": "gcse-chat",
    "api/mark-answer": "mark-answer",
  };
  return map[clean] ?? null;
}

function resolveApiUrl(url: string): string {
  if (isAbsoluteUrl(url)) return url;

  const base = (import.meta.env.VITE_API_BASE_URL || "").trim();
  if (!base) return url;

  const normalizedBase = base.replace(/\/+$/, "");
  const normalizedPath = url.startsWith("/") ? url : `/${url}`;
  return `${normalizedBase}${normalizedPath}`;
}

/**
 * Build a synthetic fetch Response from arbitrary JSON / text data so callers
 * that expect a real Response (with .ok, .status, .text(), .json()) keep working.
 */
function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  const status = init.status ?? 200;
  const isJson = typeof body !== "string";
  const payload = isJson ? JSON.stringify(body) : (body as string);
  return new Response(payload, {
    status,
    headers: { "Content-Type": "application/json", ...(init.headers || {}) },
  });
}

export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const existing = (options.headers || {}) as Record<string, string>;
  const headers: Record<string, string> = { ...existing };

  if (!headers["Content-Type"] && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const hasExpressBackend = Boolean((import.meta.env.VITE_API_BASE_URL || "").trim());

  // When no Express backend is configured (e.g. published Lovable site),
  // transparently route /api/* calls through Supabase edge functions or
  // return safe fallbacks so the UI keeps working.
  if (!hasExpressBackend && !isAbsoluteUrl(url)) {
    const path = url.split("?")[0].replace(/^\/+/, "");

    // Health check: synthesize a 200 OK so the Settings page reports healthy.
    if (path === "api/health") {
      return jsonResponse({ ok: true, source: "edge-functions" });
    }

    // OpenRouter model catalog: not available without Express. Return an empty
    // catalog so the UI gracefully falls back to the static model list.
    if (path === "api/openrouter/models") {
      return jsonResponse({ models: [], source: "edge-functions-fallback" });
    }

    // Content library manifest: served from Express only. Return empty.
    if (path.startsWith("api/content-library")) {
      return jsonResponse({ items: [], source: "edge-functions-fallback" });
    }

    const edgeFn = mapApiPathToEdgeFunction(url);
    if (edgeFn) {
      const method = (options.method || "GET").toUpperCase();
      let body: unknown = undefined;
      if (options.body && typeof options.body === "string") {
        try { body = JSON.parse(options.body); } catch { body = options.body; }
      } else if (options.body) {
        body = options.body;
      }

      const { data, error } = await supabase.functions.invoke(edgeFn, {
        method: method as "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
        body,
      });

      if (error) {
        // Surface error in same shape Express routes use: { error: "..." }
        const status = (error as { context?: { status?: number } })?.context?.status || 500;
        return jsonResponse({ error: error.message || "Edge function error" }, { status });
      }
      return jsonResponse(data ?? {});
    }
  }

  // SECURITY: Do NOT forward user API keys from client storage.
  // All AI calls go through edge functions using server-side keys.
  return fetch(resolveApiUrl(url), { ...options, headers });
}
