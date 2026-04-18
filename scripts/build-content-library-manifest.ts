import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

type Board = "ocr" | "aqa" | "edexcel" | "eduqas";
type ResourceKind =
  | "textbook"
  | "assessment-overview"
  | "assessment-set"
  | "long-answer"
  | "past-paper"
  | "mark-scheme"
  | "specification";

interface TopicResource {
  id: string;
  board: Board;
  slug: string;
  stem: string;
  title: string;
  kind: ResourceKind;
  relativePath: string;
  printable: boolean;
  setNumber?: number;
  openUrl: string;
  downloadUrl: string;
}

interface BoardResource {
  id: string;
  board: Board;
  title: string;
  kind: ResourceKind;
  relativePath: string;
  printable: boolean;
  openUrl: string;
  downloadUrl: string;
}

const ROOT = process.cwd();
const CONTENT_LIBRARY_DIR = path.join(ROOT, "content-library");
const OUTPUT_FILE = path.join(ROOT, "src", "generated", "contentLibraryManifest.ts");

const STEM_TO_SLUGS: Record<string, string[]> = {
  algorithms_searching_sorting: ["algorithms", "searching-algorithms", "sorting-algorithms", "searching-sorting", "insertion-sort"],
  algorithms_trace_tables: ["algorithms", "pseudocode-trace-tables"],
  boolean_logic: ["boolean-logic"],
  character_sets: ["memory-and-storage"],
  computational_thinking: ["algorithms"],
  cpu_architecture: ["systems-architecture"],
  cyber_security_prevention: ["network-security"],
  cyber_security_threats: ["network-security"],
  data_representation_media: ["memory-and-storage"],
  data_representation_numbers: ["memory-and-storage"],
  embedded_systems: ["systems-architecture"],
  fde_cycle_and_systems: ["systems-architecture"],
  legal_ethical_environmental: ["ethical-legal-environmental"],
  memory_and_storage: ["memory-and-storage"],
  networks_basics: ["computer-networks"],
  network_hardware_and_topologies: ["computer-networks"],
  network_protocols: ["computer-networks"],
  programming_data_structures: ["programming-fundamentals", "lists-tuples-dicts", "string-handling", "string-manipulation", "2d-arrays"],
  programming_fundamentals: [
    "programming-fundamentals",
    "intro-to-python",
    "variables-data-types",
    "variables-constants",
    "data-types-casting",
    "input-output-casting",
    "arithmetic-operators",
    "selection-if-else",
    "iteration",
  ],
  programming_testing_and_robustness: ["producing-robust-programs", "error-handling", "robust-programming"],
};

const TITLE_OVERRIDES: Record<string, string> = {
  algorithms_searching_sorting: "Algorithms: Searching and Sorting",
  algorithms_trace_tables: "Algorithms: Trace Tables",
  boolean_logic: "Boolean Logic",
  character_sets: "Character Sets",
  computational_thinking: "Computational Thinking",
  cpu_architecture: "CPU Architecture",
  cyber_security_prevention: "Cyber Security Prevention",
  cyber_security_threats: "Cyber Security Threats",
  data_representation_media: "Data Representation: Media",
  data_representation_numbers: "Data Representation: Numbers",
  embedded_systems: "Embedded Systems",
  fde_cycle_and_systems: "Fetch-Decode-Execute Cycle and Systems",
  legal_ethical_environmental: "Legal, Ethical and Environmental",
  memory_and_storage: "Memory and Storage",
  networks_basics: "Networks Basics",
  network_hardware_and_topologies: "Network Hardware and Topologies",
  network_protocols: "Network Protocols",
  programming_data_structures: "Programming Data Structures",
  programming_fundamentals: "Programming Fundamentals",
  programming_testing_and_robustness: "Programming Testing and Robustness",
};

function toTitleCase(value: string): string {
  return value
    .split(/[_\-\s]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

function classifyBoard(relativePath: string): Board | null {
  const parts = relativePath.split(path.sep);
  const first = parts[0]?.toLowerCase();
  if (first === "ocr" || first === "aqa" || first === "edexcel" || first === "eduqas") {
    return first;
  }

  const file = path.basename(relativePath).toLowerCase();
  if (file.startsWith("aqa-")) return "aqa";
  if (file.includes("j277") || file.includes("ocr")) return "ocr";
  if (file.includes("edexcel") || file.includes("1cp2")) return "edexcel";
  return null;
}

function classifyKind(relativePath: string): { kind: ResourceKind; setNumber?: number } | null {
  const lower = relativePath.toLowerCase();
  if (lower.includes(`${path.sep}textbook${path.sep}`)) {
    return { kind: "textbook" };
  }
  if (lower.includes(`${path.sep}longanswer${path.sep}`)) {
    return { kind: "long-answer" };
  }
  if (lower.includes(`${path.sep}assessments${path.sep}`)) {
    const setMatch = lower.match(/_set(\d+)\.pdf$/);
    if (setMatch) {
      return { kind: "assessment-set", setNumber: Number.parseInt(setMatch[1], 10) };
    }
    return { kind: "assessment-overview" };
  }
  if (lower.includes("mark-scheme")) {
    return { kind: "mark-scheme" };
  }
  if (lower.includes("specification")) {
    return { kind: "specification" };
  }
  if (lower.endsWith(".pdf")) {
    return { kind: "past-paper" };
  }
  return null;
}

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    if (!entry.isFile()) return [];
    if (!fullPath.toLowerCase().endsWith(".pdf")) return [];
    return [fullPath];
  });
}

function buildUrls(relativePath: string) {
  const encoded = encodeURIComponent(relativePath.replace(/\\/g, "/"));
  return {
    openUrl: `/api/content-library?file=${encoded}`,
    downloadUrl: `/api/content-library?file=${encoded}&download=1`,
  };
}

function stableSort<T extends { board: string; title: string; relativePath: string }>(items: T[]) {
  return items.sort((a, b) =>
    a.board.localeCompare(b.board) ||
    a.title.localeCompare(b.title) ||
    a.relativePath.localeCompare(b.relativePath)
  );
}

function main() {
  const files = walk(CONTENT_LIBRARY_DIR);
  const topicResources: TopicResource[] = [];
  const boardResources: BoardResource[] = [];

  for (const filePath of files) {
    const relativePath = path.relative(CONTENT_LIBRARY_DIR, filePath);
    const board = classifyBoard(relativePath);
    const kindResult = classifyKind(relativePath);

    if (!board || !kindResult) continue;

    const fileStem = path.basename(relativePath, path.extname(relativePath)).replace(/_set\d+$/, "");

    let stem = fileStem;
    let titleBase = TITLE_OVERRIDES[stem] || toTitleCase(stem);

    if (kindResult.kind === "long-answer") {
      const topicStem = path.basename(path.dirname(relativePath));
      const tierLabel = fileStem.toLowerCase().startsWith("standard")
        ? "Standard"
        : fileStem.toLowerCase().startsWith("extension")
          ? "Extension"
          : toTitleCase(fileStem);

      stem = topicStem;
      const topicTitle = TITLE_OVERRIDES[topicStem] || toTitleCase(topicStem);
      titleBase = `${topicTitle} - ${tierLabel} Long Answer`;
    }

    const urls = buildUrls(relativePath);

    const slugs = STEM_TO_SLUGS[stem];
    if (slugs?.length) {
      for (const slug of slugs) {
        topicResources.push({
          id: `${board}-${slug}-${kindResult.kind}-${relativePath}`.replace(/[^a-z0-9\-_/?.=&]+/gi, "-"),
          board,
          slug,
          stem,
          title: kindResult.kind === "assessment-set" && kindResult.setNumber
            ? `${titleBase} - Set ${kindResult.setNumber}`
            : titleBase,
          kind: kindResult.kind,
          relativePath: relativePath.replace(/\\/g, "/"),
          printable: true,
          setNumber: kindResult.setNumber,
          ...urls,
        });
      }
      continue;
    }

    boardResources.push({
      id: `${board}-${kindResult.kind}-${relativePath}`.replace(/[^a-z0-9\-_/?.=&]+/gi, "-"),
      board,
      title: kindResult.kind === "assessment-set" && kindResult.setNumber
        ? `${titleBase} - Set ${kindResult.setNumber}`
        : titleBase,
      kind: kindResult.kind,
      relativePath: relativePath.replace(/\\/g, "/"),
      printable: true,
      ...urls,
    });
  }

  const output = `/* eslint-disable */
// Auto-generated by scripts/build-content-library-manifest.ts
export type LibraryBoard = "ocr" | "aqa" | "edexcel" | "eduqas";
export type LibraryResourceKind = "textbook" | "assessment-overview" | "assessment-set" | "long-answer" | "past-paper" | "mark-scheme" | "specification";

export interface TopicLibraryResource {
  id: string;
  board: LibraryBoard;
  slug: string;
  stem: string;
  title: string;
  kind: LibraryResourceKind;
  relativePath: string;
  printable: boolean;
  setNumber?: number;
  openUrl: string;
  downloadUrl: string;
}

export interface BoardLibraryResource {
  id: string;
  board: LibraryBoard;
  title: string;
  kind: LibraryResourceKind;
  relativePath: string;
  printable: boolean;
  openUrl: string;
  downloadUrl: string;
}

export const topicLibraryResources: TopicLibraryResource[] = ${JSON.stringify(stableSort(topicResources), null, 2)} as TopicLibraryResource[];

export const boardLibraryResources: BoardLibraryResource[] = ${JSON.stringify(stableSort(boardResources), null, 2)} as BoardLibraryResource[];
`;

  mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  writeFileSync(OUTPUT_FILE, output, "utf8");
  console.log(`Generated ${path.relative(ROOT, OUTPUT_FILE)} with ${topicResources.length} topic resources and ${boardResources.length} board resources.`);
}

main();
