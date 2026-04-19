import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LeaderboardCard } from "@/components/leaderboard/LeaderboardCard";

const useLeaderboardMock = vi.fn();
const useAuthMock = vi.fn();

vi.mock("@/hooks/useLeaderboard", () => ({
  useLeaderboard: (...args: unknown[]) => useLeaderboardMock(...args),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => useAuthMock(),
}));

describe("leaderboard ui", () => {
  beforeEach(() => {
    useAuthMock.mockReturnValue({ user: { id: "user-2" } });
    useLeaderboardMock.mockReturnValue({
      entries: [
        {
          user_id: "user-1",
          display_name: "Ava",
          total_xp: 240,
          level: 3,
          completed_topics: 6,
          total_topics: 24,
          gold_topics: 2,
        },
        {
          user_id: "user-2",
          display_name: "Noah",
          total_xp: 180,
          level: 2,
          completed_topics: 4,
          total_topics: 24,
          gold_topics: 1,
        },
      ],
      loading: false,
      error: null,
    });
  });

  it("renders ranked leaderboard entries", () => {
    render(
      <MemoryRouter>
        <LeaderboardCard />
      </MemoryRouter>,
    );

    expect(screen.getByText("Leaderboard")).toBeInTheDocument();
    expect(screen.getByText("Ava")).toBeInTheDocument();
    expect(screen.getByText("240")).toBeInTheDocument();
    expect(screen.getByText("Noah")).toBeInTheDocument();
    expect(screen.getByText("You")).toBeInTheDocument();
  });

  it("renders an empty leaderboard state safely", () => {
    useLeaderboardMock.mockReturnValue({
      entries: [],
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <LeaderboardCard />
      </MemoryRouter>,
    );

    expect(screen.getByText("No leaderboard scores yet.")).toBeInTheDocument();
  });
});
