import { describe, expect, it } from "vitest";
import { buildLeaderboardEntry, getLeaderboardSyncSignature, hasLeaderboardActivity } from "@/lib/leaderboard";
import { normalizeProgress } from "@/lib/progress";

describe("leaderboard logic", () => {
  it("builds leaderboard totals from rewards and mastery", () => {
    const progress = normalizeProgress({
      completedTopics: 2,
      totalTopics: 10,
      overallBestScore: 5,
      topicProgress: [
        {
          topicSlug: "intro-to-python",
          completed: true,
          bestScorePercentage: 85,
          lessonCompleted: true,
          masteryTier: "silver",
        },
        {
          topicSlug: "variables-constants",
          completed: true,
          bestScorePercentage: 95,
          bestScoreWithoutHints: 95,
          practiceCompleted: true,
          masteryTier: "gold",
        },
        {
          topicSlug: "input-output-casting",
          completed: false,
          bestScorePercentage: 55,
          masteryTier: "bronze",
        },
      ],
      rewards: {
        totalXp: 180,
        level: 4,
        currentStreak: 3,
        longestStreak: 5,
      },
    }, 10);

    expect(buildLeaderboardEntry(progress)).toEqual({
      total_xp: 180,
      level: 2,
      current_streak: 3,
      longest_streak: 5,
      completed_topics: 2,
      total_topics: 10,
      quizzes_passed: 2,
      bronze_topics: 0,
      silver_topics: 1,
      gold_topics: 1,
      overall_best_score: 5,
    });
  });

  it("detects whether leaderboard sync is needed", () => {
    const emptyProgress = normalizeProgress({}, 8);
    const activeProgress = normalizeProgress({
      rewards: { totalXp: 8 },
    }, 8);

    expect(hasLeaderboardActivity(emptyProgress)).toBe(false);
    expect(hasLeaderboardActivity(activeProgress)).toBe(true);
  });

  it("creates a stable sync signature from tracked values", () => {
    const progress = normalizeProgress({
      completedTopics: 1,
      totalTopics: 8,
      rewards: { totalXp: 25, level: 1, currentStreak: 1, longestStreak: 1 },
      topicProgress: [{ topicSlug: "intro-to-python", completed: true, masteryTier: "bronze" }],
    }, 8);

    expect(getLeaderboardSyncSignature(progress)).toBe(getLeaderboardSyncSignature(progress));
  });
});
