import { BADGE_LABELS, QUIZ_PASS_PERCENTAGE, RECENT_REWARD_LIMIT, XP_RULES } from "@/lib/rewards/config";
import { evaluateBadges } from "@/lib/rewards/badges";
import { calculateLevel } from "@/lib/rewards/levels";
import { computeMasteryTier } from "@/lib/rewards/mastery";
import { applyStreakActivity } from "@/lib/rewards/streak";
import type {
  BadgeId,
  Progress,
  RewardActionType,
  RewardEvent,
  RewardResult,
  RewardsState,
  TopicProgress,
} from "@/lib/rewards/types";

export const PROGRESS_STORAGE_KEY = "pylearn-progress";

export function getWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.getFullYear(), now.getMonth(), diff);
  return monday.toISOString().split("T")[0];
}

export function createDefaultRewards(): RewardsState {
  return {
    totalXp: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    unlockedBadges: [],
    rewardEventLog: [],
    recentRewards: [],
  };
}

export function createDefaultTopicProgress(topicSlug: string): TopicProgress {
  return {
    topicSlug,
    completed: false,
    timeSpentSeconds: 0,
    bestScore: null,
    bestScorePercentage: null,
    firstQuizPercentage: null,
    bestScoreWithoutHints: null,
    lessonCompleted: false,
    theoryCompleted: false,
    practiceCompleted: false,
    firstCodeRunCompleted: false,
    quizAttempts: 0,
    aiHelpCount: 0,
    masteryTier: "none",
  };
}

export function createDefaultProgress(totalTopics: number): Progress {
  return {
    completedTopics: 0,
    totalTopics,
    totalTimeSpentSeconds: 0,
    weeklyTimeSpentSeconds: 0,
    weekStartDate: getWeekStart(),
    overallBestScore: null,
    topicProgress: [],
    rewards: createDefaultRewards(),
  };
}

export function normalizeProgress(raw: unknown, totalTopics: number): Progress {
  const fallback = createDefaultProgress(totalTopics);
  if (!raw || typeof raw !== "object") return fallback;

  const candidate = raw as Partial<Progress> & { topicProgress?: Array<Partial<TopicProgress>>; rewards?: Partial<RewardsState> };
  const currentWeek = getWeekStart();
  const normalizedTopics = Array.isArray(candidate.topicProgress)
    ? candidate.topicProgress.map((topic) => {
        const normalized = {
          ...createDefaultTopicProgress(String(topic.topicSlug || "")),
          ...topic,
        } as TopicProgress;
        normalized.masteryTier = computeMasteryTier(normalized);
        return normalized;
      }).filter((topic) => topic.topicSlug)
    : [];

  const rewards = {
    ...createDefaultRewards(),
    ...(candidate.rewards || {}),
  };
  rewards.level = calculateLevel(rewards.totalXp);

  const completedTopics = normalizedTopics.filter((topic) => topic.completed).length;

  return {
    completedTopics,
    totalTopics,
    totalTimeSpentSeconds: Number(candidate.totalTimeSpentSeconds || 0),
    weeklyTimeSpentSeconds: candidate.weekStartDate === currentWeek
      ? Number(candidate.weeklyTimeSpentSeconds || 0)
      : 0,
    weekStartDate: currentWeek,
    overallBestScore: candidate.overallBestScore ?? null,
    topicProgress: normalizedTopics,
    rewards,
  };
}

export function loadProgress(totalTopics: number): Progress {
  try {
    const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!stored) return createDefaultProgress(totalTopics);
    return normalizeProgress(JSON.parse(stored), totalTopics);
  } catch {
    return createDefaultProgress(totalTopics);
  }
}

export function saveProgress(progress: Progress) {
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
}

export function emitProgressUpdate() {
  window.dispatchEvent(new Event("pylearn-progress-update"));
}

export function getTopicProgress(progress: Progress, topicSlug: string): TopicProgress {
  const existing = progress.topicProgress.find((topic) => topic.topicSlug === topicSlug);
  return existing || createDefaultTopicProgress(topicSlug);
}

export function upsertTopicProgress(progress: Progress, topic: TopicProgress): Progress {
  const topicProgress = progress.topicProgress.some((entry) => entry.topicSlug === topic.topicSlug)
    ? progress.topicProgress.map((entry) => (entry.topicSlug === topic.topicSlug ? topic : entry))
    : [...progress.topicProgress, topic];

  return {
    ...progress,
    completedTopics: topicProgress.filter((entry) => entry.completed).length,
    topicProgress,
  };
}

function appendReward(progress: Progress, event: RewardEvent): Progress {
  const rewards = {
    ...progress.rewards,
    totalXp: progress.rewards.totalXp + event.xp,
    rewardEventLog: [...progress.rewards.rewardEventLog, event.id],
    recentRewards: [event, ...progress.rewards.recentRewards].slice(0, RECENT_REWARD_LIMIT),
  };
  rewards.level = calculateLevel(rewards.totalXp);
  return {
    ...progress,
    rewards,
  };
}

export function grantReward(
  progress: Progress,
  params: {
    eventId: string;
    action: RewardActionType;
    label: string;
    topicSlug?: string;
    xp?: number;
    metadata?: Record<string, unknown>;
    when?: Date;
  },
): RewardResult {
  if (progress.rewards.rewardEventLog.includes(params.eventId)) {
    return { progress, xpGained: 0, awarded: [], unlockedBadges: [] };
  }

  const awarded: RewardEvent[] = [];
  let nextProgress = progress;
  const when = params.when || new Date();

  const streakResult = applyStreakActivity(nextProgress.rewards, when);
  nextProgress = { ...nextProgress, rewards: streakResult.rewards };

  if (streakResult.streakBonus > 0 && streakResult.streakMilestone !== null) {
    const streakEvent: RewardEvent = {
      id: `streak-bonus:${streakResult.streakMilestone}:${streakResult.rewards.lastActiveDate}`,
      action: "streak_bonus",
      xp: streakResult.streakBonus,
      createdAt: when.toISOString(),
      label: `${streakResult.streakMilestone}-day streak bonus`,
      metadata: { streak: streakResult.streakMilestone },
    };
    if (!nextProgress.rewards.rewardEventLog.includes(streakEvent.id)) {
      nextProgress = appendReward(nextProgress, streakEvent);
      awarded.push(streakEvent);
    }
  }

  const event: RewardEvent = {
    id: params.eventId,
    action: params.action,
    xp: params.xp ?? XP_RULES[params.action],
    createdAt: when.toISOString(),
    label: params.label,
    topicSlug: params.topicSlug,
    metadata: params.metadata,
  };
  nextProgress = appendReward(nextProgress, event);
  awarded.push(event);

  const unlockedBadges = evaluateBadges(nextProgress);
  if (unlockedBadges.length > 0) {
    nextProgress = {
      ...nextProgress,
      rewards: {
        ...nextProgress.rewards,
        unlockedBadges: [...nextProgress.rewards.unlockedBadges, ...unlockedBadges],
      },
    };
  }

  return {
    progress: nextProgress,
    xpGained: awarded.reduce((sum, reward) => sum + reward.xp, 0),
    awarded,
    unlockedBadges,
  };
}

export function recordTopicTime(progress: Progress, topicSlug: string, seconds: number): Progress {
  const topic = getTopicProgress(progress, topicSlug);
  const updatedTopic = { ...topic, timeSpentSeconds: topic.timeSpentSeconds + seconds };
  return {
    ...upsertTopicProgress(progress, updatedTopic),
    totalTimeSpentSeconds: progress.totalTimeSpentSeconds + seconds,
    weeklyTimeSpentSeconds: progress.weeklyTimeSpentSeconds + seconds,
  };
}

export function markTopicLessonComplete(progress: Progress, topicSlug: string): RewardResult {
  const topic = getTopicProgress(progress, topicSlug);
  const updatedTopic = {
    ...topic,
    lessonCompleted: true,
  };
  updatedTopic.masteryTier = computeMasteryTier(updatedTopic);
  const next = upsertTopicProgress(progress, updatedTopic);
  return grantReward(next, {
    eventId: `lesson-complete:${topicSlug}`,
    action: "lesson_complete",
    label: "Lesson complete",
    topicSlug,
  });
}

export function markTopicTheoryComplete(progress: Progress, topicSlug: string): RewardResult {
  const topic = getTopicProgress(progress, topicSlug);
  const updatedTopic = {
    ...topic,
    theoryCompleted: true,
  };
  updatedTopic.masteryTier = computeMasteryTier(updatedTopic);
  const next = upsertTopicProgress(progress, updatedTopic);
  return grantReward(next, {
    eventId: `theory-complete:${topicSlug}`,
    action: "theory_complete",
    label: "Theory activity complete",
    topicSlug,
  });
}

export function markTopicCodeRun(progress: Progress, topicSlug: string): RewardResult {
  const topic = getTopicProgress(progress, topicSlug);
  const updatedTopic = { ...topic, firstCodeRunCompleted: true };
  const next = upsertTopicProgress(progress, updatedTopic);
  return grantReward(next, {
    eventId: `first-code-run:${topicSlug}`,
    action: "first_code_run",
    label: "First code run",
    topicSlug,
  });
}

export function markMeaningfulAiQuestion(progress: Progress, topicSlug: string, questionKey: string): RewardResult {
  const topic = getTopicProgress(progress, topicSlug);
  const updatedTopic = { ...topic, aiHelpCount: topic.aiHelpCount + 1 };
  const next = upsertTopicProgress(progress, updatedTopic);
  return grantReward(next, {
    eventId: `ai-question:${topicSlug}:${questionKey}`,
    action: "ai_question",
    label: "Meaningful AI question",
    topicSlug,
  });
}

export function markPracticeComplete(
  progress: Progress,
  topicSlug: string,
  activityId: string,
  label = "Practice complete",
): RewardResult {
  const topic = getTopicProgress(progress, topicSlug);
  const updatedTopic = { ...topic, practiceCompleted: true };
  updatedTopic.masteryTier = computeMasteryTier(updatedTopic);
  const next = upsertTopicProgress(progress, updatedTopic);
  return grantReward(next, {
    eventId: `practice-complete:${topicSlug}:${activityId}`,
    action: "practice_complete",
    label,
    topicSlug,
  });
}

export function submitQuizAttempt(
  progress: Progress,
  params: {
    topicSlug: string;
    score: number;
    totalQuestions: number;
    usedHints: boolean;
  },
): RewardResult {
  const { topicSlug, score, totalQuestions, usedHints } = params;
  const topic = getTopicProgress(progress, topicSlug);
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const passed = percentage >= QUIZ_PASS_PERCENTAGE;
  const improved = topic.bestScorePercentage !== null && percentage > topic.bestScorePercentage;

  const updatedTopic: TopicProgress = {
    ...topic,
    completed: topic.completed || passed,
    bestScore: topic.bestScore === null ? score : Math.max(topic.bestScore, score),
    bestScorePercentage: topic.bestScorePercentage === null ? percentage : Math.max(topic.bestScorePercentage, percentage),
    firstQuizPercentage: topic.firstQuizPercentage ?? percentage,
    bestScoreWithoutHints: !usedHints
      ? Math.max(topic.bestScoreWithoutHints ?? 0, percentage)
      : topic.bestScoreWithoutHints,
    quizAttempts: topic.quizAttempts + 1,
  };
  updatedTopic.masteryTier = computeMasteryTier(updatedTopic);

  let nextProgress = upsertTopicProgress(progress, updatedTopic);
  nextProgress = {
    ...nextProgress,
    overallBestScore: nextProgress.overallBestScore === null
      ? score
      : Math.max(nextProgress.overallBestScore, score),
  };

  let aggregate: RewardResult = { progress: nextProgress, xpGained: 0, awarded: [], unlockedBadges: [] };

  if (passed) {
    const passResult = grantReward(aggregate.progress, {
      eventId: `quiz-pass:${topicSlug}`,
      action: "quiz_pass",
      label: "Quiz passed",
      topicSlug,
    });
    aggregate = {
      progress: passResult.progress,
      xpGained: aggregate.xpGained + passResult.xpGained,
      awarded: [...aggregate.awarded, ...passResult.awarded],
      unlockedBadges: [...aggregate.unlockedBadges, ...passResult.unlockedBadges],
    };
  }

  if (improved) {
    const improvedResult = grantReward(aggregate.progress, {
      eventId: `quiz-improved:${topicSlug}:${percentage}`,
      action: "quiz_improved",
      label: "Beat previous best",
      topicSlug,
      metadata: { percentage },
    });
    aggregate = {
      progress: improvedResult.progress,
      xpGained: aggregate.xpGained + improvedResult.xpGained,
      awarded: [...aggregate.awarded, ...improvedResult.awarded],
      unlockedBadges: [...aggregate.unlockedBadges, ...improvedResult.unlockedBadges],
    };
  }

  if (!usedHints && passed) {
    const noHintsResult = grantReward(aggregate.progress, {
      eventId: `quiz-no-hints:${topicSlug}`,
      action: "quiz_no_hints",
      label: "Quiz passed without hints",
      topicSlug,
    });
    aggregate = {
      progress: noHintsResult.progress,
      xpGained: aggregate.xpGained + noHintsResult.xpGained,
      awarded: [...aggregate.awarded, ...noHintsResult.awarded],
      unlockedBadges: [...aggregate.unlockedBadges, ...noHintsResult.unlockedBadges],
    };
  }

  aggregate.progress = {
    ...aggregate.progress,
    topicProgress: aggregate.progress.topicProgress.map((entry) =>
      entry.topicSlug === topicSlug
        ? { ...entry, masteryTier: computeMasteryTier(entry) }
        : entry,
    ),
  };

  aggregate.unlockedBadges = Array.from(new Set(aggregate.unlockedBadges));
  return aggregate;
}

export function summarizeBadge(id: BadgeId): string {
  return BADGE_LABELS[id];
}
