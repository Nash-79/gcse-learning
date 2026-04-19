import type React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

const useListTopicsMock = vi.fn();
const useGetTopicProgressMock = vi.fn();
const useUpdateTopicProgressMock = vi.fn();
const useRewardsMock = vi.fn();

vi.mock("@/hooks/useTopics", () => ({
  useExamBoard: () => ({ board: "ocr" }),
  useListTopics: (...args: unknown[]) => useListTopicsMock(...args),
  useGetTopicProgress: (...args: unknown[]) => useGetTopicProgressMock(...args),
  useUpdateTopicProgress: (...args: unknown[]) => useUpdateTopicProgressMock(...args),
}));

vi.mock("@/hooks/useRewards", () => ({
  useRewards: () => useRewardsMock(),
}));

vi.mock("@/lib/useAiSettings", () => ({
  useAiSettings: () => ({ provider: "lovable" }),
}));

vi.mock("@/lib/topicAugmentation", () => ({
  getTopicAugmentation: () => null,
}));

vi.mock("@/lib/topicCrossLinks", () => ({
  getRelatedTheory: () => null,
}));

vi.mock("@/components/code/RunnableCode", () => ({
  RunnableCode: ({ title }: { title?: string }) => <div>{title || "Runnable Code"}</div>,
}));

vi.mock("@/components/code/CodeRunner", () => ({
  CodeRunner: () => <div>Code Runner</div>,
}));

vi.mock("@/components/ai/AiHelper", () => ({
  AiHelper: () => <div>AI Helper</div>,
}));

vi.mock("@/components/challenges/CodingChallengePanel", () => ({
  CodingChallengePanel: () => <div>Coding Challenges</div>,
}));

vi.mock("@/components/content/TopicAugmentationPanel", () => ({
  TopicAugmentationPanel: () => <div>Augmentation</div>,
}));

vi.mock("@/components/content/TopicNotes", () => ({
  TopicNotes: ({ paragraphs }: { paragraphs: string[] }) => (
    <div>{paragraphs[0]}</div>
  ),
}));

vi.mock("@/components/learning/SteppedLearning", () => ({
  SteppedLearning: () => <div>Stepped Learning</div>,
}));

vi.mock("@/components/quiz/ExamQuestionBank", () => ({
  ExamQuestionBank: () => <div>Exam Question Bank</div>,
}));

vi.mock("@/components/quiz/QuizComponent", () => ({
  QuizComponent: () => <div>Quiz Component</div>,
}));

vi.mock("@/components/rewards/MasteryBadge", () => ({
  MasteryBadge: ({ tier }: { tier: string }) => <div>{tier} mastery</div>,
}));

async function renderTopicPage(slug: string) {
  const { default: TopicPage } = await import("@/pages/TopicPage");
  return render(
    <MemoryRouter initialEntries={[`/topic/${slug}`]}>
      <Routes>
        <Route path="/topic/:slug" element={<TopicPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("topic page video rendering", () => {
  beforeEach(() => {
    useListTopicsMock.mockReturnValue({
      data: [
        { slug: "intro-to-python", title: "Intro to Python", category: "Getting Started", ocrRef: "2.2" },
        { slug: "exam-tips", title: "Exam Tips & Strategies", category: "Exam Preparation" },
      ],
      isLoading: false,
    });
    useGetTopicProgressMock.mockReturnValue({
      data: {
        masteryTier: "none",
        completed: false,
        lessonCompleted: false,
      },
    });
    useUpdateTopicProgressMock.mockReturnValue({
      mutate: vi.fn(),
    });
    useRewardsMock.mockReturnValue({
      completeTheoryActivity: vi.fn(),
      recordTopicCodeRun: vi.fn(),
      completeLesson: vi.fn(),
      completePracticeActivity: vi.fn(),
      recordMeaningfulAiQuestion: vi.fn(),
      recordStreakTouch: vi.fn(),
    });
  });

  it("does not render a video iframe for exam-tips when the topic has no videoUrl", async () => {
    await renderTopicPage("exam-tips");

    expect(screen.getByText("Exam Tips & Strategies")).toBeInTheDocument();
    expect(screen.getByText(/The GCSE Computer Science exam tests both theoretical knowledge/i)).toBeInTheDocument();
    expect(screen.getByText("Quiz Component")).toBeInTheDocument();
    expect(screen.queryByTitle("Exam Tips & Strategies video")).not.toBeInTheDocument();
  });

  it("still renders a video iframe for topics with a configured videoUrl", async () => {
    await renderTopicPage("intro-to-python");

    expect(screen.getByTitle("Intro to Python video")).toBeInTheDocument();
  });
});
