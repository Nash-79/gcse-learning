import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { paper1Questions } from "../src/data/questionBank/paper1Questions";
import { paper2Questions } from "../src/data/questionBank/paper2Questions";
import { paper1Theory } from "../src/data/questionBank/paper1Theory";
import { paper2Theory } from "../src/data/questionBank/paper2Theory";
import type { ExamBoard } from "../src/data/questionBank/types";

type Scope = "metadata" | "freshness" | "rubric" | "claim_consistency";

interface ValidationIssue {
  itemId: string;
  scope: Scope;
  message: string;
}

interface SourceDefaults {
  spec_code: string;
  spec_version: string;
  source_url: string;
}

const DEFAULT_LAST_REVIEWED = "2026-04-14";
const TODAY = new Date();
const MS_PER_DAY = 1000 * 60 * 60 * 24;

const BOARD_DEFAULTS: Record<ExamBoard, SourceDefaults> = {
  ocr: {
    spec_code: "J277",
    spec_version: "2020",
    source_url: "https://www.ocr.org.uk/qualifications/gcse/computer-science-j277-from-2020/",
  },
  aqa: {
    spec_code: "8525",
    spec_version: "2.3",
    source_url: "https://filestore.aqa.org.uk/resources/computing/specifications/AQA-8525-SP-2020.PDF",
  },
  edexcel: {
    spec_code: "1CP2",
    spec_version: "2020",
    source_url: "https://qualifications.pearson.com/en/qualifications/edexcel-gcses/computer-science-2020.html",
  },
  eduqas: {
    spec_code: "C500QS",
    spec_version: "2020",
    source_url: "https://www.eduqas.co.uk/qualifications/computer-science-gcse/",
  },
};

function daysSince(dateText: string): number | null {
  const parsed = new Date(`${dateText}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  return Math.floor((TODAY.getTime() - parsed.getTime()) / MS_PER_DAY);
}

function allowedFreshness(board: ExamBoard): number {
  return board === "ocr" || board === "aqa" ? 90 : 120;
}

function pushMetadataErrors(
  issues: ValidationIssue[],
  itemId: string,
  board: string,
  specCode: string,
  specVersion: string,
  sourceUrl: string,
  reviewedAt: string
) {
  if (!board) issues.push({ itemId, scope: "metadata", message: "Missing board" });
  if (!specCode) issues.push({ itemId, scope: "metadata", message: "Missing spec_code" });
  if (!specVersion) issues.push({ itemId, scope: "metadata", message: "Missing spec_version" });
  if (!sourceUrl) issues.push({ itemId, scope: "metadata", message: "Missing source_url" });
  if (!/^https:\/\//.test(sourceUrl)) {
    issues.push({ itemId, scope: "metadata", message: "source_url must be an https URL" });
  }
  if (!reviewedAt || !/^\d{4}-\d{2}-\d{2}$/.test(reviewedAt)) {
    issues.push({ itemId, scope: "metadata", message: "last_reviewed_at must match YYYY-MM-DD" });
  }
}

function validateQuestions(issues: ValidationIssue[]) {
  const allQuestions = [...paper1Questions, ...paper2Questions];
  for (const q of allQuestions) {
    const board = (q.board || "ocr") as ExamBoard;
    const defaults = BOARD_DEFAULTS[board];
    const specCode = q.spec_code || defaults.spec_code;
    const specVersion = q.spec_version || defaults.spec_version;
    const sourceUrl = q.source_url || defaults.source_url;
    const reviewedAt = q.last_reviewed_at || DEFAULT_LAST_REVIEWED;

    pushMetadataErrors(issues, q.id, board, specCode, specVersion, sourceUrl, reviewedAt);

    const age = daysSince(reviewedAt);
    if (age === null) {
      issues.push({ itemId: q.id, scope: "freshness", message: "Invalid last_reviewed_at date" });
      continue;
    }
    const freshnessLimit = allowedFreshness(board);
    if (age > freshnessLimit) {
      issues.push({
        itemId: q.id,
        scope: "freshness",
        message: `Content review age ${age}d exceeds ${freshnessLimit}d for ${board}`,
      });
    }

    if (!q.modelAnswer?.trim()) {
      issues.push({ itemId: q.id, scope: "rubric", message: "Missing modelAnswer" });
    }
    if (!Array.isArray(q.markScheme) || q.markScheme.length === 0) {
      issues.push({ itemId: q.id, scope: "rubric", message: "Missing markScheme points" });
    }
  }
}

function inferBoardFromTheory(topic: { examBoards?: Array<"ocr" | "aqa"> }): ExamBoard {
  if (topic.examBoards?.includes("aqa") && !topic.examBoards?.includes("ocr")) return "aqa";
  return "ocr";
}

function validateTheory(issues: ValidationIssue[]) {
  const allTheory = [...paper1Theory, ...paper2Theory];
  for (const topic of allTheory) {
    const board = inferBoardFromTheory(topic);
    const defaults = BOARD_DEFAULTS[board];
    const specCode = topic.spec_code || defaults.spec_code;
    const specVersion = topic.spec_version || defaults.spec_version;
    const sourceUrl = topic.source_url || defaults.source_url;
    const reviewedAt = topic.last_reviewed_at || DEFAULT_LAST_REVIEWED;

    pushMetadataErrors(issues, topic.slug, board, specCode, specVersion, sourceUrl, reviewedAt);

    const age = daysSince(reviewedAt);
    if (age === null) {
      issues.push({ itemId: topic.slug, scope: "freshness", message: "Invalid last_reviewed_at date" });
      continue;
    }
    const freshnessLimit = allowedFreshness(board);
    if (age > freshnessLimit) {
      issues.push({
        itemId: topic.slug,
        scope: "freshness",
        message: `Theory review age ${age}d exceeds ${freshnessLimit}d for ${board}`,
      });
    }
  }
}

function validateClaimConsistency(issues: ValidationIssue[]) {
  const questionBankPath = resolve(process.cwd(), "src/pages/QuestionBank.tsx");
  const questionBankText = readFileSync(questionBankPath, "utf8");
  const hardcodedClaims = [...questionBankText.matchAll(/\b\d{3,}\+?\s+questions?\b/gi)];
  if (hardcodedClaims.length > 0) {
    issues.push({
      itemId: "src/pages/QuestionBank.tsx",
      scope: "claim_consistency",
      message: "Potential hardcoded question-count claim detected",
    });
  }
}

function main() {
  const issues: ValidationIssue[] = [];
  validateQuestions(issues);
  validateTheory(issues);
  validateClaimConsistency(issues);

  if (issues.length === 0) {
    console.log("curriculum:validate passed");
    process.exit(0);
  }

  const grouped = new Map<Scope, ValidationIssue[]>();
  for (const issue of issues) {
    const list = grouped.get(issue.scope) || [];
    list.push(issue);
    grouped.set(issue.scope, list);
  }

  console.error("curriculum:validate failed");
  for (const [scope, scopedIssues] of grouped.entries()) {
    console.error(`\n[${scope}] ${scopedIssues.length} issue(s)`);
    for (const issue of scopedIssues.slice(0, 50)) {
      console.error(`- ${issue.itemId}: ${issue.message}`);
    }
    if (scopedIssues.length > 50) {
      console.error(`- ...and ${scopedIssues.length - 50} more`);
    }
  }

  process.exit(1);
}

main();
