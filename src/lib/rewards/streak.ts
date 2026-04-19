import { STREAK_BONUSES } from "./config";
import type { RewardsState } from "./types";

function asDateKey(value: Date | string): string {
  if (typeof value === "string") return value;
  return value.toISOString().split("T")[0];
}

function addDays(dateKey: string, days: number): string {
  const dt = new Date(`${dateKey}T00:00:00.000Z`);
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().split("T")[0];
}

export function applyStreakActivity(
  rewards: RewardsState,
  activityDate: Date | string,
): { rewards: RewardsState; streakBonus: number; streakMilestone: number | null } {
  const dateKey = asDateKey(activityDate);
  const lastActiveDate = rewards.lastActiveDate;

  if (lastActiveDate === dateKey) {
    return { rewards, streakBonus: 0, streakMilestone: null };
  }

  const nextStreak = lastActiveDate && addDays(lastActiveDate, 1) === dateKey
    ? rewards.currentStreak + 1
    : 1;

  const streakBonus = STREAK_BONUSES[nextStreak] || 0;

  return {
    rewards: {
      ...rewards,
      currentStreak: nextStreak,
      longestStreak: Math.max(rewards.longestStreak, nextStreak),
      lastActiveDate: dateKey,
    },
    streakBonus,
    streakMilestone: streakBonus > 0 ? nextStreak : null,
  };
}
