import { useState, useEffect, useCallback } from "react";

export type AiProvider = "openrouter";

interface AiSettings {
  apiKey: string;
  model: string;
  provider: AiProvider;
}

function loadSettings(): AiSettings {
  try {
    const stored = localStorage.getItem("pylearn-ai-settings");
    if (stored) {
      const parsed = JSON.parse(stored);
      const provider = parsed.provider === "lovable" ? "openrouter" : (parsed.provider || "openrouter");
      return {
        apiKey: parsed.apiKey || "",
        model: parsed.model || "meta-llama/llama-3.3-70b-instruct:free",
        provider,
      };
    }
  } catch {}
  return { apiKey: "", model: "meta-llama/llama-3.3-70b-instruct:free", provider: "openrouter" };
}

function saveSettings(s: AiSettings) {
  localStorage.setItem("pylearn-ai-settings", JSON.stringify(s));
  window.dispatchEvent(new Event("pylearn-ai-settings-update"));
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
    updateSettings,
  };
}
