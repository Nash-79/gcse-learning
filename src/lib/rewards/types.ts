export type RewardActionType =
  | "first_code_run"
  | "lesson_complete"
  | "practice_complete"
  | "quiz_pass"
  | "quiz_improved"
  | "quiz_no_hints"
  | "ai_question"
  | "theory_complete"
  | "streak_bonus";

export type BadgeId =
  | "first-steps"
  | "curious-mind"
  | "streak-starter"
  | "comeback-coder"
  | "gold-medallist";

export type MasteryTier = "none" | "bronze" | "silver" | "gold";

export interface RewardEvent {
  id: string;
  action: RewardActionType;
  xp: number;
  createdAt: string;
  label: string;
  topicSlug?: string;
  metadata?: Record<string, unknown>;
}

export interface RewardsState {
  totalXp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  unlockedBadges: BadgeId[];
  rewardEventLog: string[];
  recentRewards: RewardEvent[];
}

export interface TopicProgress {
  topicSlug: string;
  completed: boolean;
  timeSpentSeconds: number;
  bestScore: number | null;
  bestScorePercentage: number | null;
  firstQuizPercentage: number | null;
  bestScoreWithoutHints: number | null;
  lessonCompleted: boolean;
  theoryCompleted: boolean;
  practiceCompleted: boolean;
  firstCodeRunCompleted: boolean;
  quizAttempts: number;
  aiHelpCount: number;
  masteryTier: MasteryTier;
}

export interface Progress {
  completedTopics: number;
  totalTopics: number;
  totalTimeSpentSeconds: number;
  weeklyTimeSpentSeconds: number;
  weekStartDate: string;
  overallBestScore: number | null;
  topicProgress: TopicProgress[];
  rewards: RewardsState;
}

export interface RewardResult {
  progress: Progress;
  xpGained: number;
  awarded: RewardEvent[];
  unlockedBadges: BadgeId[];
}
