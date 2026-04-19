import type { BadgeId, RewardActionType } from "./types";

export const XP_RULES: Record<RewardActionType, number> = {
  first_code_run: 5,
  lesson_complete: 10,
  practice_complete: 15,
  quiz_pass: 20,
  quiz_improved: 10,
  quiz_no_hints: 10,
  ai_question: 8,
  theory_complete: 12,
  streak_bonus: 0,
};

export const STREAK_BONUSES: Record<number, number> = {
  3: 10,
  5: 15,
  7: 20,
};

export const LEVEL_STEP_XP = 100;
export const RECENT_REWARD_LIMIT = 25;
export const QUIZ_PASS_PERCENTAGE = 60;
export const QUIZ_SILVER_PERCENTAGE = 80;
export const QUIZ_GOLD_PERCENTAGE = 90;
export const AI_QUESTION_MIN_LENGTH = 18;

export const BADGE_LABELS: Record<BadgeId, string> = {
  "first-steps": "First Steps",
  "curious-mind": "Curious Mind",
  "streak-starter": "Streak Starter",
  "comeback-coder": "Comeback Coder",
  "gold-medallist": "Gold Medallist",
};

export const BADGE_DESCRIPTIONS: Record<BadgeId, string> = {
  "first-steps": "Complete your first lesson, challenge, or quiz pass.",
  "curious-mind": "Ask a meaningful AI revision question.",
  "streak-starter": "Build a 3-day learning streak.",
  "comeback-coder": "Improve a quiz score by at least 30 percentage points.",
  "gold-medallist": "Reach Gold mastery in a topic.",
};
