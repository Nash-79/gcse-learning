import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { topicData } from "../src/data/topicContent";
import { topicChallenges } from "../src/data/codingChallenges";
import { paper1Theory } from "../src/data/questionBank/paper1Theory";
import { paper2Theory } from "../src/data/questionBank/paper2Theory";

function logSection(title: string) {
  console.log(`\n== ${title} ==`);
}

let hasErrors = false;

const hooksPath = resolve(process.cwd(), "src/hooks/useTopics.ts");
const hooksText = readFileSync(hooksPath, "utf8");
const slugMatches = [...hooksText.matchAll(/slug:\s*"([^"]+)"/g)];
const topicSlugs = Array.from(new Set(slugMatches.map((m) => m[1])));

logSection("Topic Slug Coverage");
const missingTopicContent = topicSlugs.filter((slug) => !(slug in topicData));
if (missingTopicContent.length > 0) {
  hasErrors = true;
  console.error("Missing topicData entries:", missingTopicContent.join(", "));
} else {
  console.log(`OK: ${topicSlugs.length} topic slugs have topic content.`);
}

logSection("Video Placeholder Check");
const placeholderId = "PqFKRqpHrjw";
const topicDataText = JSON.stringify(topicData);
if (topicDataText.includes(placeholderId)) {
  hasErrors = true;
  console.error(`Found placeholder video ID ${placeholderId} in topicData.`);
} else {
  console.log("OK: no placeholder video IDs in topicData.");
}

logSection("Exam-Style Challenge Completeness");
const allChallenges = Object.values(topicChallenges).flat();
const examStyle = allChallenges.filter((c) => c.examStyle);
const missingModelAnswer = examStyle.filter((c) => !c.modelAnswer?.trim());
const missingMarkScheme = examStyle.filter((c) => !c.markScheme || c.markScheme.length === 0);
console.log(`Exam-style challenges: ${examStyle.length}`);
console.log(`Missing modelAnswer: ${missingModelAnswer.length}`);
console.log(`Missing markScheme: ${missingMarkScheme.length}`);
if (missingModelAnswer.length > 0 || missingMarkScheme.length > 0) {
  hasErrors = true;
}

logSection("Theory OCR/AQA Metadata");
const allTheory = [...paper1Theory, ...paper2Theory];
const missingAqaRef = allTheory.filter((t) => !t.aqaRef || t.aqaRef.length === 0);
const missingExamBoards = allTheory.filter((t) => !t.examBoards || t.examBoards.length === 0);
if (missingAqaRef.length > 0 || missingExamBoards.length > 0) {
  hasErrors = true;
  console.error(`Topics missing aqaRef: ${missingAqaRef.map((t) => t.slug).join(", ") || "none"}`);
  console.error(`Topics missing examBoards: ${missingExamBoards.map((t) => t.slug).join(", ") || "none"}`);
} else {
  console.log(`OK: ${allTheory.length} theory topics include OCR/AQA metadata.`);
}

if (hasErrors) {
  console.error("\ncontent:check failed.");
  process.exit(1);
}

console.log("\ncontent:check passed.");
