import { useCallback } from "react";
import { topicData } from "@/data/topicContent";
import { AI_QUESTION_MIN_LENGTH } from "@/lib/rewards/config";
import { showRewardFeedback } from "@/lib/rewards/feedback";
import {
  emitProgressUpdate,
  grantReward,
  loadProgress,
  markMeaningfulAiQuestion,
  markPracticeComplete,
  markTopicCodeRun,
  markTopicLessonComplete,
  markTopicTheoryComplete,
  saveProgress,
} from "@/lib/progress";
import type { RewardResult } from "@/lib/rewards/types";

function slugifyQuestion(question: string): string {
  return question
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export function useRewards() {
  const commit = useCallback((result: RewardResult) => {
    saveProgress(result.progress);
    emitProgressUpdate();
    showRewardFeedback(result);
    return result;
  }, []);

  const completeLesson = useCallback((topicSlug: string) => {
    const progress = loadProgress(Object.keys(topicData).length);
    return commit(markTopicLessonComplete(progress, topicSlug));
  }, [commit]);

  const completeTheoryActivity = useCallback((topicSlug: string) => {
    const progress = loadProgress(Object.keys(topicData).length);
    return commit(markTopicTheoryComplete(progress, topicSlug));
  }, [commit]);

  const recordTopicCodeRun = useCallback((topicSlug: string) => {
    const progress = loadProgress(Object.keys(topicData).length);
    return commit(markTopicCodeRun(progress, topicSlug));
  }, [commit]);

  const completePracticeActivity = useCallback((topicSlug: string, activityId: string, label?: string) => {
    const progress = loadProgress(Object.keys(topicData).length);
    return commit(markPracticeComplete(progress, topicSlug, activityId, label));
  }, [commit]);

  const recordMeaningfulAiQuestion = useCallback((topicSlug: string, text: string) => {
    const normalized = text.trim();
    if (normalized.length < AI_QUESTION_MIN_LENGTH) return null;
    if (normalized.split(/\s+/).length < 4) return null;
    const progress = loadProgress(Object.keys(topicData).length);
    return commit(markMeaningfulAiQuestion(progress, topicSlug, slugifyQuestion(normalized)));
  }, [commit]);

  const recordStreakTouch = useCallback(() => {
    const progress = loadProgress(Object.keys(topicData).length);
    const result = grantReward(progress, {
      eventId: `activity-touch:${new Date().toISOString().split("T")[0]}`,
      action: "streak_bonus",
      label: "Daily study check-in",
      xp: 0,
    });
    saveProgress(result.progress);
    emitProgressUpdate();
    showRewardFeedback(result);
    return result;
  }, []);

  return {
    completeLesson,
    completeTheoryActivity,
    recordTopicCodeRun,
    completePracticeActivity,
    recordMeaningfulAiQuestion,
    recordStreakTouch,
  };
}
