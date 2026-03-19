export interface TheorySection {
  id: string;
  title: string;
  icon: string;
  content: string;
  keyTerms?: { term: string; definition: string }[];
  diagram?: DiagramData;
  codeExample?: { language: string; code: string; explanation: string };
  examTip?: string;
  interactiveType?: "flowchart" | "table" | "comparison" | "checklist" | "layers";
  tableData?: { headers: string[]; rows: string[][] };
  comparisonData?: { itemA: { title: string; points: string[] }; itemB: { title: string; points: string[] } };
}

export interface DiagramData {
  type: "block" | "cycle" | "hierarchy" | "flow" | "network";
  title: string;
  blocks: { label: string; detail?: string; color?: string }[];
  connections?: string[];
}

export interface TopicTheoryData {
  slug: string;
  title: string;
  paper: "1" | "2";
  ocrRef: string;
  icon: string;
  color: string;
  description: string;
  sections: TheorySection[];
}
