import { describe, expect, it } from "vitest";
import { topicLearningSteps } from "@/data/learningSteps";
import { topicData } from "@/data/topicContent";
import { getChallengesForTopic } from "@/data/codingChallenges";

describe("topic content coverage", () => {
  it("keeps variables & constants aligned with lesson, quiz, and challenge progression", () => {
    const learningSteps = topicLearningSteps["variables-constants"];
    const difficulties = new Set(learningSteps.map((step) => step.difficulty));

    expect(topicData["variables-constants"]).toBeDefined();
    expect(topicData["variables-constants"].quiz.length).toBeGreaterThanOrEqual(8);
    expect(learningSteps.length).toBeGreaterThanOrEqual(4);
    expect(difficulties).toEqual(new Set(["beginner", "intermediate", "hard"]));
  });

  it("keeps neighbouring programming fundamentals topics on a full difficulty progression", () => {
    for (const slug of ["data-types-casting", "input-output-casting", "variables-constants"] as const) {
      const difficulties = new Set(topicLearningSteps[slug].map((step) => step.difficulty));
      expect(difficulties).toEqual(new Set(["beginner", "intermediate", "hard"]));
    }
  });

  it("keeps challenge coverage across all three levels for variables & constants", () => {
    const challenges = getChallengesForTopic("variables-constants");
    const counts = challenges.reduce<Record<string, number>>((acc, challenge) => {
      acc[challenge.difficulty] = (acc[challenge.difficulty] || 0) + 1;
      return acc;
    }, {});

    expect(counts.beginner).toBeGreaterThanOrEqual(3);
    expect(counts.intermediate).toBeGreaterThanOrEqual(3);
    expect(counts.hard).toBeGreaterThanOrEqual(3);
  });
});
