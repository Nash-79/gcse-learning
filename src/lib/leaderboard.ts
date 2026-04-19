import type { Database } from "@/integrations/supabase/types";
import type { Progress, TopicProgress } from "@/lib/rewards/types";
import { QUIZ_PASS_PERCENTAGE } from "@/lib/rewards/config";

export type LeaderboardRow = Database["public"]["Tables"]["leaderboard_scores"]["Row"];
export type LeaderboardInsert = Database["public"]["Tables"]["leaderboard_scores"]["Insert"];
export const LEADERBOARD_UPDATE_EVENT = "pylearn-leaderboard-update";

function countMastery(topics: TopicProgress[], tier: TopicProgress["masteryTier"]): number {
  return topics.filter((topic) => topic.masteryTier === tier).length;
}

export function hasLeaderboardActivity(progress: Progress): boolean {
  return progress.rewards.totalXp > 0
    || progress.completedTopics > 0
    || progress.overallBestScore !== null
    || progress.topicProgress.some((topic) => (topic.bestScorePercentage ?? 0) > 0);
}

export function buildLeaderboardEntry(progress: Progress): Omit<LeaderboardInsert, "user_id" | "display_name"> {
  return {
    total_xp: progress.rewards.totalXp,
    level: progress.rewards.level,
    current_streak: progress.rewards.currentStreak,
    longest_streak: progress.rewards.longestStreak,
    completed_topics: progress.completedTopics,
    total_topics: progress.totalTopics,
    quizzes_passed: progress.topicProgress.filter((topic) => (topic.bestScorePercentage ?? 0) >= QUIZ_PASS_PERCENTAGE).length,
    bronze_topics: countMastery(progress.topicProgress, "bronze"),
    silver_topics: countMastery(progress.topicProgress, "silver"),
    gold_topics: countMastery(progress.topicProgress, "gold"),
    overall_best_score: progress.overallBestScore,
  };
}

export function getLeaderboardSyncSignature(progress: Progress): string {
  const entry = buildLeaderboardEntry(progress);
  return JSON.stringify(entry);
}
