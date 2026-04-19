import {
  QUIZ_GOLD_PERCENTAGE,
  QUIZ_PASS_PERCENTAGE,
  QUIZ_SILVER_PERCENTAGE,
} from "./config";
import type { MasteryTier, TopicProgress } from "./types";

export function computeMasteryTier(topic: Partial<TopicProgress> | null | undefined): MasteryTier {
  if (!topic) return "none";

  const best = topic.bestScorePercentage ?? null;
  const noHints = topic.bestScoreWithoutHints ?? null;
  const hasLessonSignal = Boolean(topic.lessonCompleted || topic.theoryCompleted);
  const hasPracticeSignal = Boolean(topic.practiceCompleted);

  if (
    best !== null &&
    best >= QUIZ_GOLD_PERCENTAGE &&
    hasPracticeSignal &&
    ((noHints !== null && noHints >= QUIZ_GOLD_PERCENTAGE) || Boolean(topic.theoryCompleted))
  ) {
    return "gold";
  }

  if (
    best !== null &&
    best >= QUIZ_SILVER_PERCENTAGE &&
    (hasLessonSignal || hasPracticeSignal)
  ) {
    return "silver";
  }

  if (
    Boolean(topic.completed) ||
    hasLessonSignal ||
    hasPracticeSignal ||
    (best !== null && best >= QUIZ_PASS_PERCENTAGE)
  ) {
    return "bronze";
  }

  return "none";
}
