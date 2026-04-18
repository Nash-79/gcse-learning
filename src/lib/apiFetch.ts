import { getUserApiKey } from "@/lib/useAiSettings";

function isAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

function resolveApiUrl(url: string): string {
  if (isAbsoluteUrl(url)) return url;

  const base = (import.meta.env.VITE_API_BASE_URL || "").trim();
  if (!base) return url;

  const normalizedBase = base.replace(/\/+$/, "");
  const normalizedPath = url.startsWith("/") ? url : `/${url}`;
  return `${normalizedBase}${normalizedPath}`;
}

export function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const userApiKey = getUserApiKey();
  const existing = (options.headers || {}) as Record<string, string>;
  const headers: Record<string, string> = { ...existing };

  if (!headers["Content-Type"] && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (userApiKey) {
    headers["X-User-Api-Key"] = userApiKey;
  }

  return fetch(resolveApiUrl(url), { ...options, headers });
}
