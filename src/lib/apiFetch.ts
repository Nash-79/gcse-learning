function getUserApiKey(): string {
  try {
    const stored = localStorage.getItem("pylearn-ai-settings");
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.apiKey || "";
    }
  } catch {}
  return "";
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

  return fetch(url, { ...options, headers });
}
