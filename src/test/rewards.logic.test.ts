import { describe, expect, it } from "vitest";
import {
  createDefaultProgress,
  grantReward,
  markMeaningfulAiQuestion,
  markTopicCodeRun,
  normalizeProgress,
  submitQuizAttempt,
} from "@/lib/progress";
import { calculateLevel } from "@/lib/rewards/levels";
import { computeMasteryTier } from "@/lib/rewards/mastery";

describe("rewards logic", () => {
  it("awards xp for supported actions and dedupes one-time events", () => {
    const progress = createDefaultProgress(10);
    const first = markTopicCodeRun(progress, "intro-to-python");
    const second = markTopicCodeRun(first.progress, "intro-to-python");

    expect(first.xpGained).toBe(5);
    expect(second.xpGained).toBe(0);
    expect(second.progress.rewards.totalXp).toBe(5);
  });

  it("awards quiz pass, improvement, and no-hints bonuses correctly", () => {
    const progress = createDefaultProgress(10);
    const firstAttempt = submitQuizAttempt(progress, {
      topicSlug: "intro-to-python",
      score: 2,
      totalQuestions: 5,
      usedHints: true,
    });
    const improvedAttempt = submitQuizAttempt(firstAttempt.progress, {
      topicSlug: "intro-to-python",
      score: 4,
      totalQuestions: 5,
      usedHints: false,
    });

    expect(firstAttempt.xpGained).toBe(0);
    expect(improvedAttempt.xpGained).toBe(40);
    expect(improvedAttempt.awarded.map((event) => event.action)).toEqual([
      "quiz_pass",
      "quiz_improved",
      "quiz_no_hints",
    ]);
  });

  it("computes levels across thresholds", () => {
    expect(calculateLevel(0)).toBe(1);
    expect(calculateLevel(99)).toBe(1);
    expect(calculateLevel(100)).toBe(2);
    expect(calculateLevel(250)).toBe(3);
  });

  it("updates streaks for same day, next day, and missed day", () => {
    const progress = createDefaultProgress(10);
    const dayOne = grantReward(progress, {
      eventId: "day-1",
      action: "lesson_complete",
      label: "Lesson",
      when: new Date("2026-04-01T09:00:00Z"),
    });
    const sameDay = grantReward(dayOne.progress, {
      eventId: "day-1b",
      action: "practice_complete",
      label: "Practice",
      when: new Date("2026-04-01T15:00:00Z"),
    });
    const nextDay = grantReward(sameDay.progress, {
      eventId: "day-2",
      action: "lesson_complete",
      label: "Lesson",
      when: new Date("2026-04-02T09:00:00Z"),
    });
    const missedDay = grantReward(nextDay.progress, {
      eventId: "day-4",
      action: "lesson_complete",
      label: "Lesson",
      when: new Date("2026-04-04T09:00:00Z"),
    });

    expect(sameDay.progress.rewards.currentStreak).toBe(1);
    expect(nextDay.progress.rewards.currentStreak).toBe(2);
    expect(missedDay.progress.rewards.currentStreak).toBe(1);
  });

  it("unlocks badges once and rewards comeback improvement", () => {
    const progress = createDefaultProgress(10);
    const ai = markMeaningfulAiQuestion(progress, "intro-to-python", "why-do-lists-hold-multiple-values");
    const comeback = submitQuizAttempt(ai.progress, {
      topicSlug: "intro-to-python",
      score: 2,
      totalQuestions: 10,
      usedHints: true,
    });
    const improved = submitQuizAttempt(comeback.progress, {
      topicSlug: "intro-to-python",
      score: 6,
      totalQuestions: 10,
      usedHints: false,
    });
    const repeat = submitQuizAttempt(improved.progress, {
      topicSlug: "intro-to-python",
      score: 6,
      totalQuestions: 10,
      usedHints: false,
    });

    expect(ai.unlockedBadges).toContain("curious-mind");
    expect(improved.progress.rewards.unlockedBadges).toContain("comeback-coder");
    expect(repeat.progress.rewards.unlockedBadges.filter((badge) => badge === "comeback-coder")).toHaveLength(1);
  });

  it("maps mastery tiers deterministically and handles incomplete data", () => {
    expect(computeMasteryTier({
      topicSlug: "test",
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
    })).toBe("none");

    expect(computeMasteryTier({
      topicSlug: "test",
      completed: true,
      timeSpentSeconds: 0,
      bestScore: 3,
      bestScorePercentage: 60,
      firstQuizPercentage: 60,
      bestScoreWithoutHints: null,
      lessonCompleted: false,
      theoryCompleted: false,
      practiceCompleted: false,
      firstCodeRunCompleted: false,
      quizAttempts: 1,
      aiHelpCount: 0,
      masteryTier: "none",
    })).toBe("bronze");

    expect(computeMasteryTier({
      topicSlug: "test",
      completed: true,
      timeSpentSeconds: 0,
      bestScore: 4,
      bestScorePercentage: 80,
      firstQuizPercentage: 60,
      bestScoreWithoutHints: null,
      lessonCompleted: true,
      theoryCompleted: false,
      practiceCompleted: false,
      firstCodeRunCompleted: false,
      quizAttempts: 2,
      aiHelpCount: 0,
      masteryTier: "none",
    })).toBe("silver");

    expect(computeMasteryTier({
      topicSlug: "test",
      completed: true,
      timeSpentSeconds: 0,
      bestScore: 5,
      bestScorePercentage: 95,
      firstQuizPercentage: 60,
      bestScoreWithoutHints: 95,
      lessonCompleted: true,
      theoryCompleted: false,
      practiceCompleted: true,
      firstCodeRunCompleted: true,
      quizAttempts: 2,
      aiHelpCount: 0,
      masteryTier: "none",
    })).toBe("gold");
  });

  it("normalizes legacy progress safely when rewards are missing", () => {
    const normalized = normalizeProgress({
      completedTopics: 1,
      totalTopics: 10,
      topicProgress: [{ topicSlug: "intro-to-python", completed: true }],
    }, 10);

    expect(normalized.rewards.totalXp).toBe(0);
    expect(normalized.topicProgress[0].masteryTier).toBe("bronze");
  });
});
