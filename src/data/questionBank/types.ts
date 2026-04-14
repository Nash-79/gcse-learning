export type Difficulty = "foundation" | "mixed" | "challenge";
export type Paper = "1" | "2";
export type ExamBoard = "ocr" | "aqa" | "edexcel" | "eduqas";

export interface CurriculumMetadata {
  board?: ExamBoard;
  spec_code?: string;
  spec_version?: string;
  source_url?: string;
  last_reviewed_at?: string; // YYYY-MM-DD
}

export interface ExamQuestion extends CurriculumMetadata {
  id: string;
  question: string;
  marks: number;
  difficulty: Difficulty;
  topic: string;
  paper: Paper;
  type: "short" | "explain" | "code" | "multiple-choice" | "fill-blank";
  options?: string[];
  correctAnswer: string;
  modelAnswer: string;
  markScheme: string[];
  hint?: string;
  pseudocodeHint?: string;
}

export interface PaperSet {
  id: string;
  title: string;
  description: string;
  paper: Paper;
  type: "mock" | "practice" | "topic-mastery" | "five-a-day";
  duration?: number; // minutes
  totalMarks?: number;
  difficulty?: Difficulty;
  topic?: string;
  questionIds: string[];
  badge?: string;
}
