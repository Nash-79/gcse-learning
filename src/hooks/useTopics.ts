import { useState, useEffect, useCallback } from "react";
import { topicData } from "@/data/topicContent";

export interface Topic {
  id: number;
  slug: string;
  title: string;
  category: string;
  order: number;
}

const topicsList: Topic[] = [
  { id: 1, slug: "variables-data-types", title: "Variables & Data Types", category: "Fundamentals", order: 1 },
  { id: 2, slug: "input-output-casting", title: "Input, Output & Casting", category: "Fundamentals", order: 2 },
  { id: 3, slug: "arithmetic-operators", title: "Arithmetic Operators", category: "Fundamentals", order: 3 },
  { id: 4, slug: "string-handling", title: "String Handling", category: "Data & Variables", order: 4 },
  { id: 5, slug: "data-types-casting", title: "Data Types & Casting", category: "Data & Variables", order: 5 },
  { id: 6, slug: "variables-constants", title: "Variables & Constants", category: "Data & Variables", order: 6 },
  { id: 7, slug: "selection-if-else", title: "Selection (If/Else)", category: "Control Flow", order: 7 },
  { id: 8, slug: "intro-to-python", title: "Intro to Python", category: "Fundamentals", order: 0 },
];

export function useListTopics() {
  return { data: topicsList, isLoading: false };
}

interface TopicProgress {
  topicSlug: string;
  completed: boolean;
  timeSpentSeconds: number;
  bestScore: number | null;
}

interface Progress {
  completedTopics: number;
  totalTopics: number;
  totalTimeSpentSeconds: number;
  overallBestScore: number | null;
  topicProgress: TopicProgress[];
}

function loadProgress(): Progress {
  try {
    const stored = localStorage.getItem("pylearn-progress");
    if (stored) return JSON.parse(stored);
  } catch {}
  return {
    completedTopics: 0,
    totalTopics: topicsList.length,
    totalTimeSpentSeconds: 0,
    overallBestScore: null,
    topicProgress: [],
  };
}

function saveProgress(p: Progress) {
  localStorage.setItem("pylearn-progress", JSON.stringify(p));
}

export function useGetProgress() {
  const [progress, setProgress] = useState<Progress>(loadProgress);
  
  useEffect(() => {
    const handler = () => setProgress(loadProgress());
    window.addEventListener("pylearn-progress-update", handler);
    return () => window.removeEventListener("pylearn-progress-update", handler);
  }, []);

  return { data: progress, isLoading: false };
}

export function useGetTopicProgress(slug: string) {
  const { data: progress } = useGetProgress();
  const tp = progress.topicProgress.find(t => t.topicSlug === slug);
  return {
    data: tp || { topicSlug: slug, completed: false, timeSpentSeconds: 0, bestScore: null },
    isLoading: false,
  };
}

export function useUpdateTopicProgress() {
  return {
    mutate: ({ topicSlug, data }: { topicSlug: string; data: { timeSpentSeconds: number } }) => {
      const progress = loadProgress();
      const existing = progress.topicProgress.find(t => t.topicSlug === topicSlug);
      if (existing) {
        existing.timeSpentSeconds += data.timeSpentSeconds;
      } else {
        progress.topicProgress.push({
          topicSlug,
          completed: false,
          timeSpentSeconds: data.timeSpentSeconds,
          bestScore: null,
        });
      }
      progress.totalTimeSpentSeconds += data.timeSpentSeconds;
      saveProgress(progress);
      window.dispatchEvent(new Event("pylearn-progress-update"));
    },
  };
}

export function useSubmitQuizResult() {
  return {
    mutate: (
      { data }: { data: { topicSlug: string; score: number; totalQuestions: number } },
      options?: { onSuccess?: () => void }
    ) => {
      const progress = loadProgress();
      const existing = progress.topicProgress.find(t => t.topicSlug === data.topicSlug);
      const passed = data.score >= data.totalQuestions * 0.6;
      
      if (existing) {
        if (existing.bestScore === null || data.score > existing.bestScore) {
          existing.bestScore = data.score;
        }
        if (passed && !existing.completed) {
          existing.completed = true;
          progress.completedTopics++;
        }
      } else {
        progress.topicProgress.push({
          topicSlug: data.topicSlug,
          completed: passed,
          timeSpentSeconds: 0,
          bestScore: data.score,
        });
        if (passed) progress.completedTopics++;
      }
      
      if (progress.overallBestScore === null || data.score > progress.overallBestScore) {
        progress.overallBestScore = data.score;
      }
      
      saveProgress(progress);
      window.dispatchEvent(new Event("pylearn-progress-update"));
      options?.onSuccess?.();
    },
  };
}
