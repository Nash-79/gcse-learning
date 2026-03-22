import { useState, useEffect, useCallback } from "react";

export type ChallengeStatus = "not-started" | "in-progress" | "completed";

interface ChallengeProgressMap {
  [challengeId: string]: ChallengeStatus;
}

const STORAGE_KEY = "pylearn-challenge-progress";

function loadChallengeProgress(): ChallengeProgressMap {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return {};
}

function saveChallengeProgress(data: ChallengeProgressMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event("pylearn-challenge-update"));
}

export function useChallengeProgress() {
  const [progress, setProgress] = useState<ChallengeProgressMap>(loadChallengeProgress);

  useEffect(() => {
    const handler = () => setProgress(loadChallengeProgress());
    window.addEventListener("pylearn-challenge-update", handler);
    return () => window.removeEventListener("pylearn-challenge-update", handler);
  }, []);

  const getStatus = useCallback((id: string): ChallengeStatus => {
    return progress[id] || "not-started";
  }, [progress]);

  const setStatus = useCallback((id: string, status: ChallengeStatus) => {
    const updated = { ...loadChallengeProgress(), [id]: status };
    saveChallengeProgress(updated);
    setProgress(updated);
  }, []);

  return { getStatus, setStatus };
}
