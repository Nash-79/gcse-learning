import { PaperSet } from "./types";
import { paper1Questions } from "./paper1Questions";
import { paper2Questions } from "./paper2Questions";

// Helper to get question IDs by paper and topic
const getIds = (paper: "1" | "2", topics?: string[], difficulty?: string) => {
  const source = paper === "1" ? paper1Questions : paper2Questions;
  return source
    .filter(q => (!topics || topics.includes(q.topic)) && (!difficulty || q.difficulty === difficulty))
    .map(q => q.id);
};

// === Mock Exams (full 90-min, all topics) ===
export const mockExamSets: PaperSet[] = [
  {
    id: "mock-p1-a", title: "OCR J277/01 Mock Exam A", description: "Full 90-minute mock exam for Paper 1 — Computer Systems. Covers all Paper 1 topics with mixed difficulty. Professionally written to match OCR exam style.",
    paper: "1", type: "mock", duration: 90, totalMarks: 80, badge: "80 marks",
    questionIds: getIds("1").slice(0, 20),
  },
  {
    id: "mock-p1-b", title: "OCR J277/01 Mock Exam B", description: "Second full 90-minute mock exam for Paper 1. Different questions covering the complete specification. Use after completing Mock A.",
    paper: "1", type: "mock", duration: 90, totalMarks: 80, badge: "80 marks",
    questionIds: [...getIds("1").slice(10, 25), ...getIds("1").slice(0, 5)],
  },
  {
    id: "mock-p2-a", title: "OCR J277/02 Mock Exam A", description: "Full 90-minute mock exam for Paper 2 — Computational Thinking, Algorithms and Programming. Includes coding questions and algorithm tracing.",
    paper: "2", type: "mock", duration: 90, totalMarks: 80, badge: "80 marks",
    questionIds: getIds("2").slice(0, 20),
  },
  {
    id: "mock-p2-b", title: "OCR J277/02 Mock Exam B", description: "Second full 90-minute mock exam for Paper 2. Fresh questions across all topics. Ideal for final revision before the real exam.",
    paper: "2", type: "mock", duration: 90, totalMarks: 80, badge: "80 marks",
    questionIds: [...getIds("2").slice(10, 25), ...getIds("2").slice(0, 5)],
  },
];

// === Practice Papers (60 min, tiered difficulty) ===
export const practicePaperSets: PaperSet[] = [
  {
    id: "practice-p1-foundation", title: "J277/01 Practice Paper — Foundation", description: "60-minute Paper 1 practice at Foundation level. Focus on recall and basic understanding of Computer Systems topics.",
    paper: "1", type: "practice", duration: 60, totalMarks: 50, difficulty: "foundation", badge: "Foundation",
    questionIds: getIds("1", undefined, "foundation"),
  },
  {
    id: "practice-p1-mixed", title: "J277/01 Practice Paper — Mixed", description: "60-minute Paper 1 practice with mixed difficulty. Builds on foundation knowledge with application questions.",
    paper: "1", type: "practice", duration: 60, totalMarks: 50, difficulty: "mixed", badge: "Mixed",
    questionIds: getIds("1", undefined, "mixed"),
  },
  {
    id: "practice-p1-challenge", title: "J277/01 Practice Paper — Challenge", description: "60-minute Paper 1 practice at Challenge level. Extended response questions requiring deeper analysis and evaluation.",
    paper: "1", type: "practice", duration: 60, totalMarks: 50, difficulty: "challenge", badge: "Challenge",
    questionIds: getIds("1", undefined, "challenge"),
  },
  {
    id: "practice-p2-foundation", title: "J277/02 Practice Paper — Foundation", description: "60-minute Paper 2 practice at Foundation level. Focus on basic programming concepts and simple algorithms.",
    paper: "2", type: "practice", duration: 60, totalMarks: 50, difficulty: "foundation", badge: "Foundation",
    questionIds: getIds("2", undefined, "foundation"),
  },
  {
    id: "practice-p2-mixed", title: "J277/02 Practice Paper — Mixed", description: "60-minute Paper 2 practice with mixed difficulty. Includes code writing, tracing, and algorithm questions.",
    paper: "2", type: "practice", duration: 60, totalMarks: 50, difficulty: "mixed", badge: "Mixed",
    questionIds: getIds("2", undefined, "mixed"),
  },
  {
    id: "practice-p2-challenge", title: "J277/02 Practice Paper — Challenge", description: "60-minute Paper 2 practice at Challenge level. Complex programming scenarios and algorithm design questions.",
    paper: "2", type: "practice", duration: 60, totalMarks: 50, difficulty: "challenge", badge: "Challenge",
    questionIds: getIds("2", undefined, "challenge"),
  },
];

// === Topic Mastery Sets ===
const p1TopicNames = ["Systems Architecture", "Memory & Storage", "Computer Networks", "Network Security", "Systems Software", "Ethical, Legal & Environmental"];
const p2TopicNames = ["Algorithms", "Programming Fundamentals", "Producing Robust Programs", "Boolean Logic", "Programming Languages & IDEs"];

export const topicMasterySets: PaperSet[] = [
  ...p1TopicNames.map(topic => ({
    id: `topic-p1-${topic.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    title: `Paper 1: ${topic}`,
    description: `Focused practice on ${topic}. Master this topic with targeted exam-style questions and detailed mark schemes.`,
    paper: "1" as const,
    type: "topic-mastery" as const,
    topic,
    badge: `${getIds("1", [topic]).length} Qs`,
    questionIds: getIds("1", [topic]),
  })),
  ...p2TopicNames.map(topic => ({
    id: `topic-p2-${topic.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    title: `Paper 2: ${topic}`,
    description: `Focused practice on ${topic}. Build confidence with progressive difficulty questions and model answers.`,
    paper: "2" as const,
    type: "topic-mastery" as const,
    topic,
    badge: `${getIds("2", [topic]).length} Qs`,
    questionIds: getIds("2", [topic]),
  })),
];

// === Five A Day ===
export const fiveADaySets: PaperSet[] = [
  {
    id: "fad-p1-day1", title: "Paper 1 — Day 1", description: "5 quick-fire questions covering Systems Architecture and Memory & Storage.",
    paper: "1", type: "five-a-day", duration: 10, badge: "5 Qs",
    questionIds: getIds("1").filter((_, i) => i % 5 === 0).slice(0, 5),
  },
  {
    id: "fad-p1-day2", title: "Paper 1 — Day 2", description: "5 quick-fire questions covering Computer Networks and Network Security.",
    paper: "1", type: "five-a-day", duration: 10, badge: "5 Qs",
    questionIds: getIds("1").filter((_, i) => i % 5 === 1).slice(0, 5),
  },
  {
    id: "fad-p1-day3", title: "Paper 1 — Day 3", description: "5 quick-fire questions covering Systems Software and Ethical/Legal topics.",
    paper: "1", type: "five-a-day", duration: 10, badge: "5 Qs",
    questionIds: getIds("1").filter((_, i) => i % 5 === 2).slice(0, 5),
  },
  {
    id: "fad-p1-day4", title: "Paper 1 — Day 4", description: "5 mixed questions across all Paper 1 topics for comprehensive revision.",
    paper: "1", type: "five-a-day", duration: 10, badge: "5 Qs",
    questionIds: getIds("1").filter((_, i) => i % 5 === 3).slice(0, 5),
  },
  {
    id: "fad-p1-day5", title: "Paper 1 — Day 5", description: "5 challenge questions to push your Paper 1 knowledge further.",
    paper: "1", type: "five-a-day", duration: 10, badge: "5 Qs",
    questionIds: getIds("1").filter((_, i) => i % 5 === 4).slice(0, 5),
  },
  {
    id: "fad-p2-day1", title: "Paper 2 — Day 1", description: "5 quick-fire questions on programming fundamentals and data types.",
    paper: "2", type: "five-a-day", duration: 10, badge: "5 Qs",
    questionIds: getIds("2").filter((_, i) => i % 5 === 0).slice(0, 5),
  },
  {
    id: "fad-p2-day2", title: "Paper 2 — Day 2", description: "5 quick-fire questions on algorithms and searching/sorting.",
    paper: "2", type: "five-a-day", duration: 10, badge: "5 Qs",
    questionIds: getIds("2").filter((_, i) => i % 5 === 1).slice(0, 5),
  },
  {
    id: "fad-p2-day3", title: "Paper 2 — Day 3", description: "5 quick-fire questions on robust programming and error handling.",
    paper: "2", type: "five-a-day", duration: 10, badge: "5 Qs",
    questionIds: getIds("2").filter((_, i) => i % 5 === 2).slice(0, 5),
  },
  {
    id: "fad-p2-day4", title: "Paper 2 — Day 4", description: "5 mixed programming questions including code writing and tracing.",
    paper: "2", type: "five-a-day", duration: 10, badge: "5 Qs",
    questionIds: getIds("2").filter((_, i) => i % 5 === 3).slice(0, 5),
  },
  {
    id: "fad-p2-day5", title: "Paper 2 — Day 5", description: "5 challenge questions covering Boolean logic and file handling.",
    paper: "2", type: "five-a-day", duration: 10, badge: "5 Qs",
    questionIds: getIds("2").filter((_, i) => i % 5 === 4).slice(0, 5),
  },
];

// All questions combined
export const allQuestions = [...paper1Questions, ...paper2Questions];
export const allPaperSets = [...mockExamSets, ...practicePaperSets, ...topicMasterySets, ...fiveADaySets];

export function getQuestionById(id: string) {
  return allQuestions.find(q => q.id === id);
}

export function getQuestionsForSet(setId: string) {
  const set = allPaperSets.find(s => s.id === setId);
  if (!set) return [];
  return set.questionIds.map(id => getQuestionById(id)).filter(Boolean);
}
