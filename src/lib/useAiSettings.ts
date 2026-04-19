import { useState, useEffect, useCallback } from "react";

export type AiProvider = "openrouter" | "lovable";
export type RouteKey = "ai-chat" | "gcse-chat" | "mark-answer";

export interface RoutePolicy {
  primaryModel: string;
  fallbackModelIds: string[];
  maxAttempts: number;
  retryOn: string[];
}

interface AiSettings {
  apiKey: string;
  model: string;
  provider: AiProvider;
  routePolicies?: Partial<Record<RouteKey, RoutePolicy>>;
}

const STORAGE_KEY = "pylearn-ai-settings";
const SESSION_API_KEY = "pylearn-ai-settings-api-key";

const DEFAULT_MODEL = "meta-llama/llama-3.3-70b-instruct:free";

function readSessionApiKey(): string {
  try {
    return sessionStorage.getItem(SESSION_API_KEY) || "";
  } catch {
    return "";
  }
}

function writeSessionApiKey(apiKey: string) {
  try {
    if (apiKey) {
      sessionStorage.setItem(SESSION_API_KEY, apiKey);
    } else {
      sessionStorage.removeItem(SESSION_API_KEY);
    }
  } catch {
    // no-op
  }
}

function loadSettings(): AiSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const legacyApiKey = typeof parsed.apiKey === "string" ? parsed.apiKey : "";
      if (legacyApiKey && !readSessionApiKey()) {
        writeSessionApiKey(legacyApiKey);
      }
      const provider = parsed.provider === "lovable" ? "lovable" : (parsed.provider || "openrouter");
      if ("apiKey" in parsed) {
        delete parsed.apiKey;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }
      return {
        apiKey: readSessionApiKey(),
        model: parsed.model || DEFAULT_MODEL,
        provider,
        routePolicies: parsed.routePolicies || undefined,
      };
    }
  } catch {
    // no-op
  }
  return { apiKey: readSessionApiKey(), model: DEFAULT_MODEL, provider: "openrouter" };
}

function saveSettings(s: AiSettings) {
  const { apiKey, ...persistedSettings } = s;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(persistedSettings));
  writeSessionApiKey(apiKey);
  window.dispatchEvent(new Event("pylearn-ai-settings-update"));
}

export function getUserApiKey(): string {
  return readSessionApiKey();
}

export function getRoutePolicy(routeKey: RouteKey): RoutePolicy | undefined {
  const settings = loadSettings();
  return settings.routePolicies?.[routeKey];
}

export function useAiSettings() {
  const [settings, setSettings] = useState<AiSettings>(loadSettings);

  useEffect(() => {
    const handler = () => setSettings(loadSettings());
    window.addEventListener("pylearn-ai-settings-update", handler);
    return () => window.removeEventListener("pylearn-ai-settings-update", handler);
  }, []);

  const updateSettings = useCallback((updates: Partial<AiSettings>) => {
    const current = loadSettings();
    const next = { ...current, ...updates };
    saveSettings(next);
    setSettings(next);
  }, []);

  const maskedKey = settings.apiKey.length > 8
    ? settings.apiKey.substring(0, 6) + "····" + settings.apiKey.substring(settings.apiKey.length - 4)
    : "";

  return {
    settings,
    hasAi: !!settings.apiKey,
    maskedKey,
    model: settings.model,
    provider: settings.provider,
    routePolicies: settings.routePolicies,
    updateSettings,
  };
}

