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
  const hasEscapedNewline = input.includes("\\n");
  const hasEscapedQuote = input.includes('\\"');
  const hasEscapedTab = input.includes("\\t");
  if (!hasEscapedNewline && !hasEscapedQuote && !hasEscapedTab) {
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
  const signals = [
    "print(",
    "input(",
    "for ",
    "while ",
    "if ",
    "elif ",
    "else:",
    "def ",
    "import ",
    " = ",
    "# ",
  ];
  return signals.some((s) => text.includes(s));
}

function toMarkdownContent(content: string): string {
  const normalized = unescapeIfNeeded(content).trim();
  if (!normalized) return "";
  if (looksLikePythonCode(normalized) && normalized.includes("\n")) {
    return `\`\`\`python\n${normalized}\n\`\`\``;
  }
  return normalized;
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

  // Try extracting JSON from within text (model may wrap it)
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

  // Raw content (regular markdown or plain text)
  return { type: "raw", data: text };
}

/** Convert structured JSON output to clean markdown for rendering */
export function structuredJsonToMarkdown(data: StructuredJson): string {
  const parts: string[] = [];

  if (data.summary) {
    parts.push(data.summary);
    parts.push("");
  }

  for (const section of data.sections) {
    parts.push(`## ${section.heading}`);
    parts.push("");
    if (section.content) {
      parts.push(toMarkdownContent(section.content));
      parts.push("");
    }
    if (section.bullets && section.bullets.length > 0) {
      for (const bullet of section.bullets) {
        parts.push(`- ${bullet}`);
      }
      parts.push("");
    }
  }

  if (data.next_step) {
    parts.push("---");
    parts.push("");
    parts.push(`**Next Step:** ${data.next_step}`);
    parts.push("");
  }

  if (Array.isArray(data.suggestions) && data.suggestions.length > 0) {
    parts.push("## Want to keep going?");
    parts.push("");
    for (const suggestion of data.suggestions) {
      parts.push(`- ${suggestion}`);
    }
  }

  return parts.join("\n").trim();
}

/** Convert structured markdown fallback to clean markdown */
export function structuredMarkdownToClean(text: string): string {
  // Strip the MODE: markdown prefix and SUMMARY:/NEXT STEP: labels
  return text
    .replace(/^MODE:\s*markdown\s*\n/, "")
    .replace(/^SUMMARY:\s*\n/m, "")
    .replace(/^NEXT STEP:\s*$/m, "**Next Step:**")
    .replace(/^SUGGESTIONS:\s*$/m, "## Want to keep going?")
    .trim();
}
