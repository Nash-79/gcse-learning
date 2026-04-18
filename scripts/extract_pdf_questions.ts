/**
 * PDF → raw question extraction pilot.
 *
 * Reads one PDF, splits the plain text into numbered question blocks using
 * a simple heuristic, and writes the result as JSON so we can review the
 * extracted shape before paraphrasing + schema-fitting by hand.
 *
 * Usage:
 *   npx tsx scripts/extract_pdf_questions.ts <pdf-path> [out.json]
 */

import fs from "fs";
import path from "path";

type PDFParseCtor = new (opts: { data: Uint8Array }) => {
  getText(): Promise<{ text: string; pages: unknown[]; total: number }>;
};

async function loadParser(): Promise<PDFParseCtor> {
  const mod = await import("pdf-parse");
  return (mod as unknown as { PDFParse: PDFParseCtor }).PDFParse;
}

interface RawQuestionBlock {
  number: string;
  text: string;
  marks?: number;
}

function parseMarks(body: string): number | undefined {
  const match = body.match(/\[(\d+)\s*mark/i);
  if (match) return Number(match[1]);
  return undefined;
}

function splitQuestions(text: string): RawQuestionBlock[] {
  // Normalise whitespace and strip footers/headers that repeat.
  const cleaned = text
    .replace(/\r\n/g, "\n")
    .replace(/\u00A0/g, " ")
    .replace(/\n{3,}/g, "\n\n");

  // Questions are typically introduced by a line starting with an index like
  // "1 " / "1. " / "Q1." — optionally with leading whitespace. Sub-parts like
  // "(a)" remain inside the parent block.
  const lines = cleaned.split("\n");
  const blocks: RawQuestionBlock[] = [];
  let current: RawQuestionBlock | null = null;

  const QUESTION_START = /^\s*(?:Q\s*)?(\d{1,2})(?:[.)]|\s)\s+(.+)$/;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      if (current) current.text += "\n";
      continue;
    }
    const match = line.match(QUESTION_START);
    // Heuristic: only treat as a new question if the number monotonically
    // increases and the body is long enough to be a real stem.
    if (match && match[2].length > 10) {
      const num = Number(match[1]);
      const prevNum: number = current ? Number(current.number) : 0;
      if (num === prevNum + 1 || (!current && num === 1)) {
        if (current) blocks.push(current);
        current = { number: String(num), text: match[2] };
        continue;
      }
    }
    if (current) current.text += `\n${line}`;
  }
  if (current) blocks.push(current);

  return blocks
    .map((block) => ({
      ...block,
      text: block.text.trim(),
      marks: parseMarks(block.text),
    }))
    .filter((block) => block.text.length > 20);
}

async function main() {
  const pdfPath = process.argv[2];
  if (!pdfPath) {
    console.error("Usage: npx tsx scripts/extract_pdf_questions.ts <pdf-path> [out.json]");
    process.exit(1);
  }
  const absPath = path.resolve(pdfPath);
  const outPath = process.argv[3] || `${path.basename(absPath, path.extname(absPath))}.extracted.json`;

  const buffer = fs.readFileSync(absPath);
  const PDFParse = await loadParser();
  const data = await new PDFParse({ data: new Uint8Array(buffer) }).getText();

  const blocks = splitQuestions(data.text);
  const result = {
    source: path.relative(process.cwd(), absPath).replace(/\\/g, "/"),
    pageCount: data.total,
    questionCount: blocks.length,
    questions: blocks,
  };

  fs.writeFileSync(outPath, JSON.stringify(result, null, 2), "utf8");
  console.log(`Extracted ${blocks.length} question blocks from ${absPath}`);
  console.log(`Wrote ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
