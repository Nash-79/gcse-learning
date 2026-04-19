import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HeaderRewards } from "@/components/rewards/HeaderRewards";
import { MasteryBadge } from "@/components/rewards/MasteryBadge";
import { RewardsSummaryCard } from "@/components/rewards/RewardsSummaryCard";
import { showRewardFeedback } from "@/lib/rewards/feedback";
import { normalizeProgress } from "@/lib/progress";

const { toastSuccess } = vi.hoisted(() => ({
  toastSuccess: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: toastSuccess,
  },
}));

describe("rewards ui", () => {
  beforeEach(() => {
    localStorage.clear();
    toastSuccess.mockClear();
  });

  it("renders the header rewards widget", () => {
    localStorage.setItem("pylearn-progress", JSON.stringify({
      topicProgress: [],
      rewards: {
        totalXp: 140,
        level: 2,
        currentStreak: 4,
        longestStreak: 4,
        lastActiveDate: "2026-04-19",
        unlockedBadges: ["first-steps"],
        rewardEventLog: [],
        recentRewards: [],
      },
    }));

    render(<HeaderRewards />);

    expect(screen.getByLabelText("Rewards summary")).toBeInTheDocument();
    expect(screen.getByText("Lv 2")).toBeInTheDocument();
    expect(screen.getByText(/140 XP/)).toBeInTheDocument();
    expect(screen.getByText("4 day streak")).toBeInTheDocument();
  });

  it("renders mastery indicators correctly", () => {
    render(<MasteryBadge tier="gold" />);
    expect(screen.getByLabelText("Gold mastery")).toBeInTheDocument();
  });

  it("shows reward and badge toast feedback", () => {
    showRewardFeedback({
      progress: {} as never,
      xpGained: 18,
      awarded: [{ id: "1", action: "ai_question", xp: 8, createdAt: "2026-04-19", label: "Meaningful AI question" }],
      unlockedBadges: ["curious-mind"],
    });

    expect(toastSuccess).toHaveBeenCalledWith("+18 XP", expect.objectContaining({
      description: "Meaningful AI question",
    }));
    expect(toastSuccess).toHaveBeenCalledWith("Badge unlocked: Curious Mind", expect.any(Object));
  });

  it("renders rewards summary safely with legacy progress data", () => {
    const legacyProgress = normalizeProgress({
      completedTopics: 1,
      topicProgress: [{ topicSlug: "intro-to-python", completed: true }],
    }, 10);

    render(
      <MemoryRouter>
        <RewardsSummaryCard progress={legacyProgress} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Rewards Progress")).toBeInTheDocument();
    expect(screen.getByText("Level 1")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
