export interface StructuredSection {
  heading: string;
  content?: string;
  bullets?: string[];
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
  const signals = ["print(", "input(", "for ", "while ", "if ", "elif ", "else:", "def ", "import ", " = ", "# "];
  return signals.some((s) => text.includes(s));
}

function hasMarkdownStructure(input: string): boolean {
  if (input.includes("```")) return true;
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

/** Convert structured JSON output to clean, well-formatted markdown */
export function structuredJsonToMarkdown(data: StructuredJson): string {
  const parts: string[] = [];

  // Summary as a highlighted callout with a goal emoji
  if (data.summary) {
    parts.push(`> 🎯 **${data.summary.trim()}**`);
    parts.push("");
  }

  for (const section of data.sections) {
    parts.push(`## ${ensureHeadingEmoji(section.heading)}`);
    parts.push("");
    if (section.content) {
      const md = toMarkdownContent(splitInlineLabels(section.content));
      // Ensure blank line padding around fenced code blocks / tables
      parts.push(md);
      parts.push("");
    }
    if (section.bullets && section.bullets.length > 0) {
      for (const bullet of section.bullets) {
        parts.push(`- ${bullet}`);
      }
      parts.push("");
    }
  }

  if (data.next_step && data.next_step.trim()) {
    parts.push("---");
    parts.push("");
    parts.push(`🚀 **Next step:** ${data.next_step.trim()}`);
    parts.push("");
  }

  if (Array.isArray(data.suggestions) && data.suggestions.length > 0) {
    parts.push("---");
    parts.push("");
    parts.push("**🔗 Follow-up questions**");
    parts.push("");
    for (const suggestion of data.suggestions) {
      parts.push(`- ${suggestion}`);
    }
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
