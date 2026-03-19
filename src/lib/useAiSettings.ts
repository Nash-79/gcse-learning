import { useState, useEffect, useCallback } from "react";

interface AiSettings {
  apiKey: string;
  model: string;
}

function loadSettings(): AiSettings {
  try {
    const stored = localStorage.getItem("pylearn-ai-settings");
    if (stored) return JSON.parse(stored);
  } catch {}
  return { apiKey: "", model: "meta-llama/llama-3.3-70b-instruct:free" };
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
    updateSettings,
  };
}
