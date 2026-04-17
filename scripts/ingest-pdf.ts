/**
 * scripts/ingest-pdf.ts
 *
 * Stage 1 of the content pipeline:
 *   raw/official/*.pdf  →  drafts/extracted/{slug}.json
 *
 * What it does:
 *   1. Reads a PDF from raw/official/ and verifies it is in the manifest.
 *   2. Extracts text per page using pdfjs-dist (Node-compatible PDF parser).
 *   3. Sends the extracted text to Claude with a structured extraction prompt.
 *   4. Claude returns a JSON draft matching the TheorySection schema.
 *   5. The draft is written to drafts/extracted/ for human review.
 *
 * Usage:
 *   npm run ingest:pdf -- --file=raw/official/spec.pdf --board=ocr --spec=J277 --topic=systems-architecture
 *   npm run ingest:pdf -- --file=raw/official/spec.pdf --board=aqa  --spec=8525 --topic=cpu-architecture
 *
 * Prerequisites:
 *   ANTHROPIC_API_KEY must be set.
 *   npm install @anthropic-ai/sdk pdfjs-dist
 *
 * Output format (drafts/extracted/{board}-{spec}-{topic}.json):
 *   {
 *     "meta": { board, spec_code, topic_slug, source_file, extracted_at },
 *     "sections": [ { TheorySection fields... } ],
 *     "diagrams_needed": [ { brief, alt, suggested_filename } ],
 *     "questions_candidates": [ { question, mark_range, type } ]
 *   }
 */

import Anthropic from "@anthropic-ai/sdk";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { join, basename } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { parse as parseYaml } from "yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// ── CLI args ──────────────────────────────────────────────────────────────────
function getArg(name: string): string | undefined {
  const prefix = `--${name}=`;
  const arg = process.argv.find(a => a.startsWith(prefix));
  return arg ? arg.slice(prefix.length) : undefined;
}

const filePath  = getArg("file");
const board     = getArg("board");
const specCode  = getArg("spec");
const topicSlug = getArg("topic");

if (!filePath || !board || !specCode) {
  console.error("Usage: npm run ingest:pdf -- --file=<path> --board=<board> --spec=<code> [--topic=<slug>]");
  process.exit(1);
}

// ── Manifest check ────────────────────────────────────────────────────────────
const manifestPath = join(ROOT, "raw", "official", "manifest.yaml");
if (!existsSync(manifestPath)) {
  console.error(`Manifest not found at ${manifestPath}. Add the file to the manifest first.`);
  process.exit(1);
}

const manifest = parseYaml(readFileSync(manifestPath, "utf8")) as {
  sources: { filename: string; board: string; spec_code: string; may_republish: boolean }[];
};

const absFilePath = join(ROOT, filePath);
const fileName = basename(absFilePath);
const manifestEntry = manifest.sources.find(s => s.filename === fileName);

if (!manifestEntry) {
  console.error(`File "${fileName}" is not in raw/official/manifest.yaml.`);
  console.error("Add it to the manifest with correct metadata before ingesting.");
  process.exit(1);
}

// ── PDF text extraction ───────────────────────────────────────────────────────
async function extractPdfText(pdfPath: string): Promise<string> {
  // Use pdfjs-dist for extraction — graceful fallback if not installed
  try {
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const doc = await pdfjsLib.getDocument({ url: pdfPath }).promise;
    const pages: string[] = [];

    for (let i = 1; i <= Math.min(doc.numPages, 80); i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      const text = content.items
        .filter((item): item is { str: string } => "str" in item)
        .map(item => item.str)
        .join(" ");
      pages.push(`--- PAGE ${i} ---\n${text}`);
    }

    return pages.join("\n\n");
  } catch {
    console.warn("pdfjs-dist not available — run: npm install pdfjs-dist");
    console.warn("Using filename-based stub extraction for demonstration.");
    return `[PDF text extraction requires pdfjs-dist. Install it and re-run.]\nFile: ${pdfPath}`;
  }
}

// ── Claude extraction prompt ──────────────────────────────────────────────────
const EXTRACTION_SYSTEM = `You are an expert GCSE Computer Science curriculum analyst.
You receive raw text extracted from an official specification or textbook PDF.
Your job is to extract structured content suitable for a revision website targeting 14-16 year old students.

Return a JSON object with this exact shape:
{
  "sections": [
    {
      "id": "kebab-case-id",
      "title": "Section title",
      "icon": "single relevant emoji",
      "specPoint": "Exact spec wording this covers",
      "content": "2-4 sentence explanation in plain English suitable for GCSE students",
      "revisionSummary": ["3-6 short bullet points for quick revision"],
      "keyTerms": [{ "term": "...", "definition": "..." }],
      "commonMistakes": [{ "mistake": "...", "correction": "..." }],
      "examTip": "Specific examiner advice",
      "diagramBrief": "Describe what diagram would help here (or null)"
    }
  ],
  "diagrams_needed": [
    { "brief": "...", "alt": "...", "suggested_filename": "topic-name.svg" }
  ],
  "question_candidates": [
    { "question": "...", "mark_range": "2-4", "type": "short|explain|code|multiple-choice" }
  ]
}

Rules:
- Write for 14-16 year olds. Clear, concise, exam-focused.
- Each section should correspond to one assessable concept.
- Do not copy text verbatim from the source — paraphrase in house style.
- Only include content that is in the source material.
- Return valid JSON only. No markdown, no code fences.`;

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ERROR: ANTHROPIC_API_KEY is not set.");
    process.exit(1);
  }

  if (!existsSync(absFilePath)) {
    console.error(`File not found: ${absFilePath}`);
    process.exit(1);
  }

  console.log(`Ingesting: ${fileName}`);
  console.log(`Board: ${board}, Spec: ${specCode}, Topic: ${topicSlug || "auto-detect"}\n`);

  console.log("Extracting text from PDF...");
  const pdfText = await extractPdfText(absFilePath);
  const truncated = pdfText.slice(0, 60000); // Stay within context limits

  console.log(`Extracted ${pdfText.length} chars (sending ${truncated.length} to Claude)...\n`);

  const client = new Anthropic({ apiKey });

  const userPrompt = `Extract structured GCSE Computer Science revision content from this ${board.toUpperCase()} ${specCode} specification text.
${topicSlug ? `Focus on the topic: ${topicSlug}` : "Extract all identifiable topics."}

Source text:
${truncated}`;

  console.log("Calling Claude API for structured extraction...");
  const response = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 8192,
    system: EXTRACTION_SYSTEM,
    messages: [{ role: "user", content: userPrompt }],
  });

  const textBlock = response.content.find(b => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    console.error("No text response from Claude.");
    process.exit(1);
  }

  let extracted: unknown;
  try {
    extracted = JSON.parse(textBlock.text);
  } catch {
    console.error("Claude returned invalid JSON. Raw response saved for inspection.");
    const rawPath = join(ROOT, "drafts", "extracted", `${board}-${specCode}-${topicSlug || "raw"}-error.txt`);
    writeFileSync(rawPath, textBlock.text, "utf8");
    process.exit(1);
  }

  const outputPath = join(
    ROOT,
    "drafts",
    "extracted",
    `${board}-${specCode.toLowerCase()}-${topicSlug || "all"}.json`
  );

  const output = {
    meta: {
      board,
      spec_code: specCode,
      topic_slug: topicSlug || null,
      source_file: fileName,
      extracted_at: new Date().toISOString().slice(0, 10),
      status: "draft",
      reviewer: null,
    },
    ...(extracted as object),
  };

  writeFileSync(outputPath, JSON.stringify(output, null, 2), "utf8");
  console.log(`\n✓ Draft saved to: drafts/extracted/${outputPath.split("extracted/")[1]}`);
  console.log("\nNext steps:");
  console.log("  1. Review the draft in drafts/extracted/");
  console.log("  2. Copy to content/boards/{board}/{spec}/paper{n}/{topic}/topic.mdx");
  console.log("  3. Edit for house style and accuracy");
  console.log("  4. Set status: published and last_reviewed_at in metadata.yaml");
  console.log("  5. Run: npm run curriculum:validate");
  console.log("  6. Run: npm run diagrams");
}

main().catch(err => {
  console.error("Fatal:", err);
  process.exit(1);
});
