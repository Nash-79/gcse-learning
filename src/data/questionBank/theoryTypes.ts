// ── Diagram & Image ──────────────────────────────────────────────────────────

/**
 * A static or AI-generated diagram image stored under public/diagrams/.
 * src is a public path (e.g. "/diagrams/cpu-block.svg") or an absolute URL.
 * aiPrompt is the prompt that was used to generate the image — keep it so the
 * image can be regenerated or revised later.
 */
export interface DiagramImage {
  src: string;
  alt: string;
  caption?: string;
  aiPrompt?: string; // prompt used to generate — for audit & regeneration
}

/**
 * A Mermaid diagram — use only when flow/sequence/state makes conceptual sense
 * (e.g. fetch-decode-execute sequence, network protocol flow, sorting steps).
 * Do NOT use for spatial / block-architecture diagrams — use DiagramImage there.
 */
export interface MermaidDiagram {
  title: string;
  code: string; // raw Mermaid DSL
}

/**
 * Block/grid diagram rendered natively in-app (no external image needed).
 * Best for CPU component grids, comparison layouts, simple pipelines.
 */
export interface DiagramData {
  type: "block" | "cycle" | "hierarchy" | "flow" | "network";
  title: string;
  blocks: { label: string; detail?: string; color?: string }[];
  connections?: string[];
}

// ── Rich content primitives ───────────────────────────────────────────────────

export interface WorkedExample {
  question: string;
  steps: { step: string; explanation: string }[];
  answer: string;
  markScheme?: string[]; // mark-scheme points for self-marking
}

export interface CommonMistake {
  mistake: string;    // what students get wrong
  correction: string; // the correct understanding
}

export interface Flashcard {
  front: string; // typically the key term or question
  back: string;  // definition or answer
}

// ── Section & Topic ───────────────────────────────────────────────────────────

export interface TheorySection {
  id: string;
  title: string;
  icon: string;
  content: string;

  // Quick-scan revision bullets shown collapsed above the full content
  revisionSummary?: string[];

  // Inline images (AI-generated SVGs or static assets)
  images?: DiagramImage[];

  // Block/grid diagram rendered natively
  diagram?: DiagramData;

  // Mermaid diagram — use context-appropriately (flows, sequences, states)
  mermaid?: MermaidDiagram;

  keyTerms?: { term: string; definition: string }[];
  codeExample?: { language: string; code: string; explanation: string };
  examTip?: string;

  // Step-by-step worked example with self-marking
  workedExample?: WorkedExample;

  // Common misconceptions shown in red/green pairs
  commonMistakes?: CommonMistake[];

  // Flashcards scoped to this section (flippable key terms / Q&A)
  flashcards?: Flashcard[];

  // Exact OCR/AQA spec wording this section covers
  specPoint?: string;

  // Existing interactive helpers
  interactiveType?: "flowchart" | "table" | "comparison" | "checklist" | "layers";
  tableData?: { headers: string[]; rows: string[][] };
  comparisonData?: {
    itemA: { title: string; points: string[] };
    itemB: { title: string; points: string[] };
  };
}

export interface TopicTheoryData {
  slug: string;
  title: string;
  paper: "1" | "2";
  ocrRef: string;
  aqaRef: string[];
  examBoards: Array<"ocr" | "aqa" | "edexcel" | "eduqas">;
  icon: string;
  color: string;
  description: string;

  // Topic-level quick revision bullets (shown before sections)
  revisionSummary?: string[];

  sections: TheorySection[];

  spec_code?: "J277" | "8525" | "1CP2" | "C500QS";
  spec_version?: string;
  source_url?: string;
  last_reviewed_at?: string; // YYYY-MM-DD
}
