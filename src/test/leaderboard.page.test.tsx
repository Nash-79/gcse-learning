import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Leaderboard from "@/pages/Leaderboard";

const useLeaderboardMock = vi.fn();
const useAuthMock = vi.fn();

vi.mock("@/hooks/useLeaderboard", () => ({
  useLeaderboard: (...args: unknown[]) => useLeaderboardMock(...args),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => useAuthMock(),
}));

describe("leaderboard page", () => {
  beforeEach(() => {
    useAuthMock.mockReturnValue({ user: { id: "user-2" } });
    useLeaderboardMock.mockReturnValue({
      entries: [
        {
          user_id: "user-1",
          display_name: "Ava",
          total_xp: 260,
          level: 5,
          current_streak: 4,
          completed_topics: 8,
          total_topics: 24,
          gold_topics: 2,
        },
        {
          user_id: "user-2",
          display_name: "Noah",
          total_xp: 180,
          level: 3,
          current_streak: 1,
          completed_topics: 5,
          total_topics: 24,
          gold_topics: 0,
        },
        {
          user_id: "user-3",
          display_name: "Mia",
          total_xp: 120,
          level: 2,
          current_streak: 5,
          completed_topics: 4,
          total_topics: 24,
          gold_topics: 1,
        },
      ],
      loading: false,
      error: null,
    });
  });

  it("renders full rankings and current rank", () => {
    render(
      <MemoryRouter>
        <Leaderboard />
      </MemoryRouter>,
    );

    expect(screen.getByText("Leaderboard")).toBeInTheDocument();
    expect(screen.getByText("Ava")).toBeInTheDocument();
    expect(screen.getByText("Noah")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("filters students by name and filter chip", () => {
    render(
      <MemoryRouter>
        <Leaderboard />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText("Filter students by name"), {
      target: { value: "mi" },
    });

    expect(screen.getByText("Mia")).toBeInTheDocument();
    expect(screen.queryByText("Ava")).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Filter students by name"), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Gold mastery" }));

    expect(screen.getByText("Ava")).toBeInTheDocument();
    expect(screen.getByText("Mia")).toBeInTheDocument();
    expect(screen.queryByText("Noah")).not.toBeInTheDocument();
  });
});
