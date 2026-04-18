/**
 * Cross-link map between Python coding topics (src/data/topicContent.ts)
 * and OCR spec revision topics (src/data/questionBank/paper1Theory.ts,
 * paper2Theory.ts).
 *
 * The two surfaces serve different learning modes:
 *   - /topic/:slug          → Python coding lessons
 *   - /topic-theory/:slug   → Spec-aligned revision notes
 *
 * A student studying Python selection (if/else) in code should be able to
 * jump to the matching exam theory (Paper 2 — programming fundamentals),
 * and vice versa. This module owns that mapping.
 */

export interface TheoryLinkTarget {
  slug: string;
  title: string;
  paper: "1" | "2";
  icon: string;
}

export interface PythonLinkTarget {
  slug: string;
  title: string;
  category: string;
}

/** Theory slugs as surfaced by paper1Theory.ts + paper2Theory.ts */
const THEORY_TARGETS: Record<string, TheoryLinkTarget> = {
  "systems-architecture": { slug: "systems-architecture", title: "Systems Architecture", paper: "1", icon: "🖥️" },
  "memory-and-storage": { slug: "memory-and-storage", title: "Memory & Storage", paper: "1", icon: "💾" },
  "computer-networks": { slug: "computer-networks", title: "Computer Networks", paper: "1", icon: "🌐" },
  "network-security": { slug: "network-security", title: "Network Security", paper: "1", icon: "🔒" },
  "systems-software": { slug: "systems-software", title: "Systems Software", paper: "1", icon: "⚙️" },
  "ethical-legal-environmental": { slug: "ethical-legal-environmental", title: "Ethical, Legal & Environmental", paper: "1", icon: "⚖️" },
  algorithms: { slug: "algorithms", title: "Algorithms", paper: "2", icon: "🧮" },
  "programming-fundamentals": { slug: "programming-fundamentals", title: "Programming Fundamentals", paper: "2", icon: "🐍" },
  "producing-robust-programs": { slug: "producing-robust-programs", title: "Producing Robust Programs", paper: "2", icon: "🛡️" },
  "boolean-logic": { slug: "boolean-logic", title: "Boolean Logic", paper: "2", icon: "🔣" },
  "programming-languages-and-ides": { slug: "programming-languages-and-ides", title: "Programming Languages & IDEs", paper: "2", icon: "🧠" },
};

/** Python → Theory (one primary revision topic per Python slug) */
const PYTHON_TO_THEORY: Record<string, string> = {
  "intro-to-python": "programming-fundamentals",
  "variables-data-types": "programming-fundamentals",
  "variables-constants": "programming-fundamentals",
  "data-types-casting": "programming-fundamentals",
  "input-output-casting": "programming-fundamentals",
  "arithmetic-operators": "programming-fundamentals",
  "selection-if-else": "programming-fundamentals",
  iteration: "programming-fundamentals",
  "string-handling": "programming-fundamentals",
  "string-manipulation": "programming-fundamentals",
  "lists-tuples-dicts": "programming-fundamentals",
  "2d-arrays": "programming-fundamentals",
  "functions-scope": "programming-fundamentals",
  "file-handling": "programming-fundamentals",
  "random-numbers": "programming-fundamentals",
  "error-handling": "producing-robust-programs",
  "robust-programming": "producing-robust-programs",
  "boolean-logic": "boolean-logic",
  "searching-algorithms": "algorithms",
  "sorting-algorithms": "algorithms",
  "insertion-sort": "algorithms",
  "sql-basics": "programming-languages-and-ides",
  "pseudocode-trace-tables": "algorithms",
  "exam-tips": "algorithms",
};

/** Theory → Python (best-effort multi-link for practice) */
const THEORY_TO_PYTHON: Record<string, PythonLinkTarget[]> = {
  "programming-fundamentals": [
    { slug: "variables-data-types", title: "Variables & Data Types", category: "Programming Fundamentals" },
    { slug: "selection-if-else", title: "Selection (If/Else)", category: "Programming Fundamentals" },
    { slug: "iteration", title: "Iteration (Loops)", category: "Programming Fundamentals" },
    { slug: "functions-scope", title: "Subroutines & Scope", category: "Subroutines" },
    { slug: "lists-tuples-dicts", title: "Arrays, Lists & Dictionaries", category: "Data Structures" },
  ],
  "producing-robust-programs": [
    { slug: "error-handling", title: "Error Handling (Try/Except)", category: "Robust Programming" },
    { slug: "robust-programming", title: "Input Validation & Authentication", category: "Robust Programming" },
  ],
  algorithms: [
    { slug: "searching-algorithms", title: "Searching Algorithms", category: "Algorithms" },
    { slug: "sorting-algorithms", title: "Sorting Algorithms", category: "Algorithms" },
    { slug: "insertion-sort", title: "Insertion Sort", category: "Algorithms" },
    { slug: "pseudocode-trace-tables", title: "Pseudocode & Trace Tables", category: "Exam Preparation" },
  ],
  "boolean-logic": [
    { slug: "boolean-logic", title: "Boolean Logic & Truth Tables", category: "Boolean Logic" },
  ],
  "programming-languages-and-ides": [
    { slug: "sql-basics", title: "SQL (Structured Query Language)", category: "SQL & IDEs" },
  ],
  // Paper 1 theory topics: no Python practice — leave empty
  "systems-architecture": [],
  "memory-and-storage": [],
  "computer-networks": [],
  "network-security": [],
  "systems-software": [],
  "ethical-legal-environmental": [],
};

export function getRelatedTheory(pythonSlug: string): TheoryLinkTarget | null {
  const theorySlug = PYTHON_TO_THEORY[pythonSlug];
  if (!theorySlug) return null;
  return THEORY_TARGETS[theorySlug] ?? null;
}

export function getRelatedPythonTopics(theorySlug: string): PythonLinkTarget[] {
  return THEORY_TO_PYTHON[theorySlug] ?? [];
}
