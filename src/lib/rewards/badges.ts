import type { BadgeId, Progress } from "./types";

export function evaluateBadges(progress: Progress): BadgeId[] {
  const unlocked = new Set(progress.rewards.unlockedBadges);
  const next: BadgeId[] = [];

  const queue = (badge: BadgeId, condition: boolean) => {
    if (condition && !unlocked.has(badge)) {
      unlocked.add(badge);
      next.push(badge);
    }
  };

  queue(
    "first-steps",
    progress.topicProgress.some((topic) =>
      topic.lessonCompleted || topic.theoryCompleted || topic.practiceCompleted || topic.completed,
    ),
  );
  queue("curious-mind", progress.topicProgress.some((topic) => topic.aiHelpCount > 0));
  queue("streak-starter", progress.rewards.currentStreak >= 3);
  queue(
    "comeback-coder",
    progress.topicProgress.some((topic) =>
      topic.firstQuizPercentage !== null &&
      topic.bestScorePercentage !== null &&
      topic.bestScorePercentage - topic.firstQuizPercentage >= 30,
    ),
  );
  queue("gold-medallist", progress.topicProgress.some((topic) => topic.masteryTier === "gold"));

  return next;
}
