/**
 * scripts/generate-diagrams.ts
 *
 * Scans all theory topics for DiagramImage entries that have an aiPrompt but
 * whose src file does not yet exist under public/. Calls the Claude API to
 * generate an SVG for each missing diagram and writes it to public/diagrams/.
 *
 * Usage:
 *   npm run diagrams              # generate all missing diagrams
 *   npm run diagrams -- --force   # regenerate even if file exists
 *   npm run diagrams -- --dry-run # list what would be generated, no API calls
 *
 * Prerequisites:
 *   ANTHROPIC_API_KEY must be set in the environment or .env file.
 *   npm install @anthropic-ai/sdk
 */

import Anthropic from "@anthropic-ai/sdk";
import { writeFileSync, existsSync, mkdirSync, readFileSync } from "fs";
import { join, dirname, basename } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PUBLIC_DIR = join(ROOT, "public");

// ── CLI flags ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const DRY_RUN = args.includes("--dry-run");

// ── Collect all aiPrompt entries from theory data ────────────────────────────

interface DiagramTask {
  topicSlug: string;
  sectionId: string;
  src: string;     // e.g. /diagrams/cpu-components-block.svg
  alt: string;
  aiPrompt: string;
}

async function collectTasks(): Promise<DiagramTask[]> {
  // Dynamically import theory data (ESM) — transpiled by tsx
  const { paper1Theory } = await import("../src/data/questionBank/paper1Theory.js");
  const { paper2Theory } = await import("../src/data/questionBank/paper2Theory.js");

  const tasks: DiagramTask[] = [];

  for (const topic of [...paper1Theory, ...paper2Theory]) {
    for (const section of topic.sections) {
      if (!section.images) continue;
      for (const img of section.images) {
        if (!img.aiPrompt) continue;
        tasks.push({
          topicSlug: topic.slug,
          sectionId: section.id,
          src: img.src,
          alt: img.alt,
          aiPrompt: img.aiPrompt,
        });
      }
    }
  }

  return tasks;
}

// ── SVG generation via Claude API ────────────────────────────────────────────

const SVG_SYSTEM_PROMPT = `You are an expert technical illustrator specialising in educational SVG diagrams for GCSE Computer Science students aged 14-16.

Rules you must follow:
- Output ONLY valid, self-contained SVG markup. No XML declaration, no DOCTYPE.
- Start the output with <svg ... > and end with </svg>.
- Use a viewBox, e.g. viewBox="0 0 800 400".
- Make the diagram clear, accessible, and well-labelled.
- Use clean sans-serif fonts (font-family="Arial, sans-serif").
- Keep colours professional: primary blue (#3B82F6), secondary purple (#8B5CF6), green (#10B981), grey (#6B7280).
- Add a white or very light grey background rectangle.
- Include a <title> element and <desc> element for accessibility.
- Use <text> elements for labels, not embedded images or foreign objects.
- Do not use JavaScript, animations, or external references.
- Do not output any explanation — only the SVG markup.`;

async function generateSvg(client: Anthropic, task: DiagramTask): Promise<string> {
  const message = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 4096,
    system: SVG_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: task.aiPrompt,
      },
    ],
  });

  const textBlock = message.content.find(b => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error(`No text content in Claude response for ${task.src}`);
  }

  // Extract SVG: strip any markdown fences if present
  let svg = textBlock.text.trim();
  const fenceMatch = svg.match(/```(?:svg)?\s*([\s\S]*?)```/);
  if (fenceMatch) svg = fenceMatch[1].trim();

  if (!svg.startsWith("<svg")) {
    // Find the SVG start
    const svgStart = svg.indexOf("<svg");
    if (svgStart === -1) throw new Error(`Response does not contain SVG markup for ${task.src}`);
    svg = svg.slice(svgStart);
  }

  return svg;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey && !DRY_RUN) {
    console.error("ERROR: ANTHROPIC_API_KEY environment variable is not set.");
    console.error("Export it before running: export ANTHROPIC_API_KEY=sk-ant-...");
    process.exit(1);
  }

  console.log("Collecting diagram tasks from theory data...");
  const tasks = await collectTasks();

  if (tasks.length === 0) {
    console.log("No diagrams with aiPrompt found. Nothing to do.");
    return;
  }

  console.log(`Found ${tasks.length} diagram task(s).\n`);

  const toGenerate = tasks.filter(t => {
    const absPath = join(PUBLIC_DIR, t.src);
    return FORCE || !existsSync(absPath);
  });

  if (toGenerate.length === 0) {
    console.log("All diagrams already exist. Use --force to regenerate.");
    return;
  }

  if (DRY_RUN) {
    console.log("DRY RUN — would generate:");
    for (const t of toGenerate) {
      console.log(`  ${t.src}  (${t.topicSlug} / ${t.sectionId})`);
    }
    return;
  }

  const client = new Anthropic({ apiKey });

  let succeeded = 0;
  let failed = 0;

  for (const task of toGenerate) {
    const absPath = join(PUBLIC_DIR, task.src);
    const dir = dirname(absPath);

    console.log(`Generating ${basename(task.src)} ...`);
    console.log(`  Topic:   ${task.topicSlug} / ${task.sectionId}`);
    console.log(`  Prompt:  ${task.aiPrompt.slice(0, 80)}...`);

    try {
      const svg = await generateSvg(client, task);
      mkdirSync(dir, { recursive: true });
      writeFileSync(absPath, svg, "utf8");
      console.log(`  ✓ Saved to public${task.src}\n`);
      succeeded++;
    } catch (err) {
      console.error(`  ✗ Failed: ${(err as Error).message}\n`);
      failed++;
    }

    // Respect rate limits — small delay between requests
    if (toGenerate.indexOf(task) < toGenerate.length - 1) {
      await new Promise(r => setTimeout(r, 1200));
    }
  }

  console.log(`\nDone. ${succeeded} generated, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
