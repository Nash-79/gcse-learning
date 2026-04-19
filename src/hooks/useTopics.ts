import { useState, useEffect, useCallback } from "react";
import { topicData } from "@/data/topicContent";
import { showRewardFeedback } from "@/lib/rewards/feedback";
import {
  createDefaultTopicProgress,
  emitProgressUpdate,
  getTopicProgress,
  loadProgress,
  recordTopicTime,
  saveProgress,
  submitQuizAttempt,
} from "@/lib/progress";
import type { Progress, TopicProgress } from "@/lib/rewards/types";

export type ExamBoard = "ocr" | "aqa" | "all";

export interface Topic {
  id: number;
  slug: string;
  title: string;
  category: string;
  order: number;
  examBoards: ExamBoard[];
  ocrRef?: string;
  aqaRef?: string;
  difficulty: "beginner" | "intermediate" | "hard";
  level: "gcse" | "expert";
}

const baseTopicsList = [
  // === Fundamentals (both boards) ===
  { id: 8, slug: "intro-to-python", title: "Intro to Python", category: "Getting Started", order: 0, examBoards: ["ocr", "aqa"] },

  // === 2.2 Programming Fundamentals (OCR) ===
  { id: 1, slug: "variables-data-types", title: "Variables & Data Types", category: "Programming Fundamentals", order: 1, examBoards: ["ocr", "aqa"], ocrRef: "2.2" },
  { id: 6, slug: "variables-constants", title: "Variables & Constants", category: "Programming Fundamentals", order: 2, examBoards: ["ocr", "aqa"], ocrRef: "2.2" },
  { id: 5, slug: "data-types-casting", title: "Data Types & Casting", category: "Programming Fundamentals", order: 3, examBoards: ["ocr", "aqa"], ocrRef: "2.2" },
  { id: 2, slug: "input-output-casting", title: "Input, Output & Casting", category: "Programming Fundamentals", order: 4, examBoards: ["ocr", "aqa"], ocrRef: "2.2" },
  { id: 3, slug: "arithmetic-operators", title: "Arithmetic Operators", category: "Programming Fundamentals", order: 5, examBoards: ["ocr", "aqa"], ocrRef: "2.2" },
  { id: 7, slug: "selection-if-else", title: "Selection (If/Else)", category: "Programming Fundamentals", order: 6, examBoards: ["ocr", "aqa"], ocrRef: "2.2" },
  { id: 9, slug: "iteration", title: "Iteration (Loops)", category: "Programming Fundamentals", order: 7, examBoards: ["ocr", "aqa"], ocrRef: "2.2" },

  // === Data Structures ===
  { id: 4, slug: "string-handling", title: "String Handling", category: "Data Structures & Strings", order: 8, examBoards: ["ocr", "aqa"], ocrRef: "2.2" },
  { id: 10, slug: "string-manipulation", title: "String Manipulation", category: "Data Structures & Strings", order: 9, examBoards: ["ocr", "aqa"], ocrRef: "2.2" },
  { id: 11, slug: "lists-tuples-dicts", title: "Arrays, Lists & Dictionaries", category: "Data Structures & Strings", order: 10, examBoards: ["ocr", "aqa"], ocrRef: "2.2" },
  { id: 20, slug: "2d-arrays", title: "2D Arrays", category: "Data Structures & Strings", order: 11, examBoards: ["ocr", "aqa"], ocrRef: "2.2" },

  // === Subroutines & Scope ===
  { id: 12, slug: "functions-scope", title: "Subroutines & Scope", category: "Subroutines", order: 12, examBoards: ["ocr", "aqa"], ocrRef: "2.2" },
  { id: 13, slug: "file-handling", title: "File Handling", category: "Subroutines", order: 13, examBoards: ["ocr", "aqa"], ocrRef: "2.2" },
  { id: 21, slug: "random-numbers", title: "Random Number Generation", category: "Subroutines", order: 14, examBoards: ["ocr", "aqa"], ocrRef: "2.2" },

  // === 2.3 Producing Robust Programs (OCR) ===
  { id: 14, slug: "error-handling", title: "Error Handling (Try/Except)", category: "Robust Programming", order: 15, examBoards: ["ocr", "aqa"], ocrRef: "2.3" },
  { id: 22, slug: "robust-programming", title: "Input Validation & Authentication", category: "Robust Programming", order: 16, examBoards: ["ocr", "aqa"], ocrRef: "2.3" },

  // === 2.4 Boolean Logic (OCR) ===
  { id: 23, slug: "boolean-logic", title: "Boolean Logic & Truth Tables", category: "Boolean Logic", order: 17, examBoards: ["ocr"], ocrRef: "2.4" },

  // === 2.1 Algorithms (OCR) ===
  { id: 15, slug: "searching-algorithms", title: "Searching Algorithms", category: "Algorithms", order: 18, examBoards: ["ocr", "aqa"], ocrRef: "2.1" },
  { id: 16, slug: "sorting-algorithms", title: "Sorting Algorithms", category: "Algorithms", order: 19, examBoards: ["ocr", "aqa"], ocrRef: "2.1" },
  { id: 24, slug: "insertion-sort", title: "Insertion Sort", category: "Algorithms", order: 20, examBoards: ["ocr"], ocrRef: "2.1" },

  // === 2.5 SQL & IDEs (OCR) ===
  { id: 25, slug: "sql-basics", title: "SQL (Structured Query Language)", category: "SQL & IDEs", order: 21, examBoards: ["ocr"], ocrRef: "2.2" },

  // === Exam Preparation ===
  { id: 17, slug: "pseudocode-trace-tables", title: "Pseudocode & Trace Tables", category: "Exam Preparation", order: 22, examBoards: ["ocr", "aqa"], ocrRef: "2.1" },
  { id: 18, slug: "exam-tips", title: "Exam Tips & Strategies", category: "Exam Preparation", order: 23, examBoards: ["ocr", "aqa"] },
];

function inferDifficulty(slug: string, category: string): Topic["difficulty"] {
  if (["intro-to-python", "variables-data-types", "variables-constants", "input-output-casting", "arithmetic-operators"].includes(slug)) {
    return "beginner";
  }
  if (["string-manipulation", "2d-arrays", "functions-scope", "file-handling", "random-numbers", "error-handling", "boolean-logic", "searching-algorithms", "sorting-algorithms", "sql-basics", "pseudocode-trace-tables"].includes(slug)) {
    return "intermediate";
  }
  if (["insertion-sort", "exam-tips", "robust-programming"].includes(slug)) {
    return "hard";
  }

  if (category === "Getting Started") return "beginner";
  if (category === "Exam Preparation" || category === "Algorithms") return "hard";
  return "intermediate";
}

function inferLevel(slug: string): Topic["level"] {
  if (["sql-basics", "insertion-sort", "exam-tips"].includes(slug)) {
    return "expert";
  }
  return "gcse";
}

const topicsList: Topic[] = baseTopicsList.map((topic) => ({
  ...topic,
  examBoards: topic.examBoards as ExamBoard[],
  difficulty: inferDifficulty(topic.slug, topic.category),
  level: inferLevel(topic.slug),
}));

function getStoredBoard(): ExamBoard {
  try {
    const stored = localStorage.getItem("pylearn-exam-board");
    if (stored === "ocr" || stored === "aqa" || stored === "all") return stored;
  } catch {
    // no-op
  }
  return "ocr";
}

export function useExamBoard() {
  const [board, setBoard] = useState<ExamBoard>(getStoredBoard);

  const updateBoard = useCallback((b: ExamBoard) => {
    localStorage.setItem("pylearn-exam-board", b);
    setBoard(b);
    window.dispatchEvent(new Event("pylearn-board-update"));
  }, []);

  useEffect(() => {
    const handler = () => setBoard(getStoredBoard());
    window.addEventListener("pylearn-board-update", handler);
    return () => window.removeEventListener("pylearn-board-update", handler);
  }, []);

  return { board, setBoard: updateBoard };
}

export function useListTopics(filterBoard?: ExamBoard) {
  const { board } = useExamBoard();
  const activeBoard = filterBoard || board;

  const filtered = activeBoard === "all"
    ? topicsList
    : topicsList.filter(t => t.examBoards.includes(activeBoard));

  return { data: filtered, isLoading: false };
}

export function useGetProgress() {
  const [progress, setProgress] = useState<Progress>(() => loadProgress(topicsList.length));

  useEffect(() => {
    const handler = () => setProgress(loadProgress(topicsList.length));
    window.addEventListener("pylearn-progress-update", handler);
    return () => window.removeEventListener("pylearn-progress-update", handler);
  }, []);

  return { data: progress, isLoading: false };
}

export function useGetTopicProgress(slug: string) {
  const { data: progress } = useGetProgress();
  const tp = getTopicProgress(progress, slug);
  return {
    data: tp || createDefaultTopicProgress(slug),
    isLoading: false,
  };
}

export function useUpdateTopicProgress() {
  return {
    mutate: ({ topicSlug, data }: { topicSlug: string; data: { timeSpentSeconds: number } }) => {
      const progress = loadProgress(topicsList.length);
      const next = recordTopicTime(progress, topicSlug, data.timeSpentSeconds);
      saveProgress(next);
      emitProgressUpdate();
    },
  };
}

export function useSubmitQuizResult() {
  return {
    mutate: (
      { data }: { data: { topicSlug: string; score: number; totalQuestions: number; usedHints?: boolean } },
      options?: { onSuccess?: () => void }
    ) => {
      const progress = loadProgress(topicsList.length);
      const result = submitQuizAttempt(progress, {
        topicSlug: data.topicSlug,
        score: data.score,
        totalQuestions: data.totalQuestions,
        usedHints: Boolean(data.usedHints),
      });
      saveProgress(result.progress);
      emitProgressUpdate();
      showRewardFeedback(result);
      options?.onSuccess?.();
    },
  };
}
