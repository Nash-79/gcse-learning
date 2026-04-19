export interface TraceTable {
  columns: string[];
  rows: string[][];
}

export interface StructuredSection {
  heading: string;
  content?: string;
  bullets?: string[];
  /** When present, render as a variable-trace table instead of markdown. */
  type?: "trace_table";
  trace?: TraceTable;
}

export interface StructuredJson {
  mode?: "json";
  summary: string;
  sections: StructuredSection[];
  next_step: string;
  suggestions?: string[];
}

function unescapeIfNeeded(input: string): string {
  if (!input.includes("\\n") && !input.includes('\\"') && !input.includes("\\t")) {
    return input;
  }
  return input
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\");
}

function looksLikePythonCode(input: string): boolean {
  const text = input.trim();
  if (!text) return false;
  // Require at least one *line* that looks like a real Python statement —
  // not just an English word ("for each", "if needed") inside prose.
  const lines = text.split("\n");
  const codeLine = /^(?:\s*)(?:print\(|input\(|def\s+\w+\(|import\s+\w|from\s+\w+\s+import|for\s+\w+\s+in\s|while\s+.+:|if\s+.+:|elif\s+.+:|else\s*:|\w+\s*=\s*[^=])/;
  return lines.some((l) => codeLine.test(l));
}

function hasMarkdownStructure(input: string): boolean {
  if (input.includes("```")) return true;
  // Markdown tables: a line starting with `|` (pipe) signals tabular markdown.
  if (/(^|\n)\s*\|.*\|/.test(input)) return true;
  // Any line that looks like prose, a heading, a list, or a blockquote —
  // means it's a narrative section, not a raw code snippet.
  return /(^|\n)\s*(#{1,6}\s|[-*]\s|>\s|\d+\.\s)/.test(input) ||
    /[.!?]\s+[A-Z]/.test(input) ||
    /\*\*[^*]+\*\*/.test(input);
}

function toMarkdownContent(content: string): string {
  const normalized = unescapeIfNeeded(content).trim();
  if (!normalized) return "";
  // Only fence-wrap when the content is *purely* code — never when it
  // already contains fences or prose/markdown markers, otherwise we
  // nest fences and corrupt the rendered output.
  if (
    looksLikePythonCode(normalized) &&
    normalized.includes("\n") &&
    !hasMarkdownStructure(normalized)
  ) {
    return `\`\`\`python\n${normalized}\n\`\`\``;
  }
  return normalized;
}

/**
 * If a section heading doesn't already begin with an emoji, pick a sensible
 * default based on keywords. Keeps output feeling consistent with Claude's
 * emoji-prefixed headings even when the model forgets.
 */
const HEADING_EMOJI_MAP: Array<{ match: RegExp; emoji: string }> = [
  { match: /\b(overview|introduction|summary|what is|goal)\b/i, emoji: "🎯" },
  { match: /\b(example|examples|walkthrough)\b/i, emoji: "📝" },
  { match: /\b(trace|step.?by.?step|steps)\b/i, emoji: "🔍" },
  { match: /\b(python|code|syntax|programming)\b/i, emoji: "🐍" },
  { match: /\b(algorithm|logic|pseudocode)\b/i, emoji: "🧮" },
  { match: /\b(definition|defined|vocabulary|key term)\b/i, emoji: "🔤" },
  { match: /\b(tip|tips|idea|hint|remember)\b/i, emoji: "💡" },
  { match: /\b(concept|theory|understand|explain)\b/i, emoji: "🧠" },
  { match: /\b(pitfall|warning|watch out|common mistake|error|bug)\b/i, emoji: "⚠️" },
  { match: /\b(correct|good practice|best practice|do this)\b/i, emoji: "✅" },
];

// Matches emojis at the start of a heading. Broad emoji range + common
// symbol emojis (✅ ⚠️ 💡 etc.).
const LEADING_EMOJI = /^[\s]*(?:\p{Extended_Pictographic}|\p{Emoji_Presentation})/u;

function ensureHeadingEmoji(heading: string): string {
  const trimmed = heading.trim();
  if (!trimmed) return trimmed;
  if (LEADING_EMOJI.test(trimmed)) return trimmed;
  for (const { match, emoji } of HEADING_EMOJI_MAP) {
    if (match.test(trimmed)) return `${emoji} ${trimmed}`;
  }
  return trimmed;
}

export type ParsedOutput =
  | { type: "json"; data: StructuredJson }
  | { type: "markdown"; data: string }
  | { type: "raw"; data: string };

export function parseAssistantOutput(text: string): ParsedOutput {
  const isStructured = (data: unknown): data is StructuredJson => {
    if (!data || typeof data !== "object") return false;
    const candidate = data as Partial<StructuredJson>;
    return (
      Array.isArray(candidate.sections) &&
      typeof candidate.summary === "string" &&
      typeof candidate.next_step === "string"
    );
  };

  // Try JSON first
  try {
    const data = JSON.parse(text);
    if (isStructured(data)) {
      return { type: "json", data: { ...data, mode: "json" } };
    }
  } catch {
    // Not valid JSON, continue
  }

  // Try extracting JSON from within text
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const data = JSON.parse(jsonMatch[0]);
      if (isStructured(data)) {
        return { type: "json", data: { ...data, mode: "json" } };
      }
    } catch {
      // Continue
    }
  }

  // Check for markdown fallback
  if (text.trim().startsWith("MODE: markdown")) {
    return { type: "markdown", data: text };
  }

  return { type: "raw", data: text };
}

/**
 * If a section's `content` is a single paragraph crammed with multiple
 * "**Label:** value" patterns separated by line breaks (or sentences),
 * split each one onto its own line so the renderer can promote them to
 * definition-list rows. Defensive against models that ignore the
 * "no inline mini-headings" instruction.
 */
function splitInlineLabels(content: string): string {
  if (!content) return content;
  // Already multi-line with each label on its own line? Leave it.
  // Find inline patterns like "**Word:** value **Other:** value"
  const pattern = /\*\*([A-Z][A-Za-z0-9 /-]{1,30}):\*\*/g;
  const matches = content.match(pattern);
  if (!matches || matches.length < 2) return content;
  // Insert a blank line before each "**Label:**" occurrence (except the first
  // when at start) so each becomes its own paragraph and triggers the
  // definition-list renderer in ChatMessage.
  return content
    .replace(/\s*\*\*([A-Z][A-Za-z0-9 /-]{1,30}):\*\*/g, "\n\n**$1:**")
    .trim();
}

/**
 * Match first-column headers that look like a variable-trace step counter.
 * Used by the auto-promote heuristic to decide if a markdown table inside a
 * section's content should be rendered via the dedicated <TraceTable /> UI
 * instead of plain markdown.
 */
const TRACE_STEP_HEADER = /^(step|iter|iteration|loop|n|i|cycle|row)$/i;

/**
 * Try to parse a markdown table out of a content block. Returns the first
 * table found, or null if none present / malformed. Rows are returned as
 * raw strings (no HTML escaping needed — the renderer uses monospace text).
 */
function parseMarkdownTable(content: string): TraceTable | null {
  if (!content) return null;
  const lines = content.split("\n");
  let start = -1;
  for (let i = 0; i < lines.length - 1; i++) {
    if (/^\s*\|.*\|\s*$/.test(lines[i]) && /^\s*\|?\s*:?-{2,}/.test(lines[i + 1])) {
      start = i;
      break;
    }
  }
  if (start === -1) return null;

  const headerCells = lines[start]
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((c) => c.trim());

  const rows: string[][] = [];
  for (let i = start + 2; i < lines.length; i++) {
    const line = lines[i];
    if (!/^\s*\|.*\|\s*$/.test(line)) break;
    const cells = line
      .trim()
      .replace(/^\||\|$/g, "")
      .split("|")
      .map((c) => c.trim());
    rows.push(cells);
  }

  if (headerCells.length < 2 || rows.length === 0) return null;
  return { columns: headerCells, rows };
}

/**
 * Decide whether a parsed markdown table looks like a variable-trace table
 * that should render via the dedicated component. Heuristic: the first-column
 * header matches a step-counter word AND the table has at least 3 columns.
 */
function looksLikeTraceTable(trace: TraceTable): boolean {
  if (trace.columns.length < 3) return false;
  const firstHeader = trace.columns[0] || "";
  return TRACE_STEP_HEADER.test(firstHeader);
}

/**
 * Normalise a structured response so trace-table sections carry their
 * `type` and `trace` fields consistently, whether the model emitted them
 * directly or buried a markdown table inside `content`.
 */
export function normalizeStructured(data: StructuredJson): StructuredJson {
  const sections = data.sections.map((section) => {
    // Model emitted a structured trace block — trust it.
    if (section.type === "trace_table" && section.trace?.columns && Array.isArray(section.trace.rows)) {
      return section;
    }
    // Auto-promote: model wrote a markdown table that looks like a trace.
    if (section.content) {
      const parsed = parseMarkdownTable(section.content);
      if (parsed && looksLikeTraceTable(parsed)) {
        return { ...section, type: "trace_table" as const, trace: parsed };
      }
    }
    return section;
  });
  return { ...data, sections };
}

export type StructuredBlock =
  | { kind: "markdown"; text: string }
  | { kind: "trace"; heading: string; trace: TraceTable; bullets?: string[] };

/**
 * Render the structured JSON into a list of blocks the chat renderer can
 * mix-and-match. Markdown blocks include headings, summary callouts, and
 * next-step lines; trace blocks are handed to <TraceTable />.
 */
export function structuredJsonToBlocks(data: StructuredJson): StructuredBlock[] {
  const normalised = normalizeStructured(data);
  const blocks: StructuredBlock[] = [];

  if (normalised.summary) {
    blocks.push({ kind: "markdown", text: `> 🎯 **${normalised.summary.trim()}**` });
  }

  for (const section of normalised.sections) {
    if (section.type === "trace_table" && section.trace) {
      blocks.push({
        kind: "trace",
        heading: ensureHeadingEmoji(section.heading),
        trace: section.trace,
        bullets: section.bullets,
      });
      continue;
    }
    const parts: string[] = [`## ${ensureHeadingEmoji(section.heading)}`, ""];
    if (section.content) {
      parts.push(toMarkdownContent(splitInlineLabels(section.content)));
      parts.push("");
    }
    if (section.bullets && section.bullets.length > 0) {
      for (const bullet of section.bullets) parts.push(`- ${bullet}`);
      parts.push("");
    }
    blocks.push({ kind: "markdown", text: parts.join("\n").trim() });
  }

  if (normalised.next_step && normalised.next_step.trim()) {
    blocks.push({ kind: "markdown", text: `---\n\n🚀 **Next step:** ${normalised.next_step.trim()}` });
  }

  if (Array.isArray(normalised.suggestions) && normalised.suggestions.length > 0) {
    const parts: string[] = ["---", "", "**🔗 Follow-up questions**", ""];
    for (const s of normalised.suggestions) parts.push(`- ${s}`);
    blocks.push({ kind: "markdown", text: parts.join("\n") });
  }

  return blocks;
}

/** Convert structured JSON output to clean, well-formatted markdown */
export function structuredJsonToMarkdown(data: StructuredJson): string {
  // Preserved for callers that need a pure-markdown render (e.g. follow-up
  // extraction from legacy content). Trace sections are serialised back to
  // markdown tables so no information is lost.
  const normalised = normalizeStructured(data);
  const parts: string[] = [];

  if (normalised.summary) {
    parts.push(`> 🎯 **${normalised.summary.trim()}**`);
    parts.push("");
  }

  for (const section of normalised.sections) {
    parts.push(`## ${ensureHeadingEmoji(section.heading)}`);
    parts.push("");
    if (section.type === "trace_table" && section.trace) {
      const { columns, rows } = section.trace;
      parts.push(`| ${columns.join(" | ")} |`);
      parts.push(`| ${columns.map(() => "---").join(" | ")} |`);
      for (const row of rows) parts.push(`| ${row.join(" | ")} |`);
      parts.push("");
    } else if (section.content) {
      parts.push(toMarkdownContent(splitInlineLabels(section.content)));
      parts.push("");
    }
    if (section.bullets && section.bullets.length > 0) {
      for (const bullet of section.bullets) parts.push(`- ${bullet}`);
      parts.push("");
    }
  }

  if (normalised.next_step && normalised.next_step.trim()) {
    parts.push("---");
    parts.push("");
    parts.push(`🚀 **Next step:** ${normalised.next_step.trim()}`);
    parts.push("");
  }

  if (Array.isArray(normalised.suggestions) && normalised.suggestions.length > 0) {
    parts.push("---");
    parts.push("");
    parts.push("**🔗 Follow-up questions**");
    parts.push("");
    for (const suggestion of normalised.suggestions) parts.push(`- ${suggestion}`);
  }

  return parts.join("\n").trim();
}

/** Convert structured markdown fallback to clean markdown */
export function structuredMarkdownToClean(text: string): string {
  return text
    .replace(/^MODE:\s*markdown\s*\n/, "")
    .replace(/^SUMMARY:\s*\n/m, "> 🎯 ")
    .replace(/^NEXT STEP:\s*$/m, "🚀 **Next step:**")
    .replace(/^SUGGESTIONS:\s*$/m, "**🔗 Follow-up questions**")
    .trim();
}
