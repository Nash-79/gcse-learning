import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Filter, Search, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LeaderboardRow } from "@/components/leaderboard/LeaderboardRow";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useAuth } from "@/hooks/useAuth";

type StudentFilter = "all" | "streaking" | "gold" | "level5";

const filterConfig: Record<StudentFilter, string> = {
  all: "All students",
  streaking: "3+ day streak",
  gold: "Gold mastery",
  level5: "Level 5+",
};

export default function Leaderboard() {
  const { user } = useAuth();
  const { entries, loading, error } = useLeaderboard(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<StudentFilter>("all");

  const filteredEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return entries.filter((entry) => {
      if (normalizedQuery && !entry.display_name.toLowerCase().includes(normalizedQuery)) {
        return false;
      }

      if (filter === "streaking" && entry.current_streak < 3) {
        return false;
      }

      if (filter === "gold" && entry.gold_topics < 1) {
        return false;
      }

      if (filter === "level5" && entry.level < 5) {
        return false;
      }

      return true;
    });
  }, [entries, filter, query]);

  const currentUserRank = entries.findIndex((entry) => entry.user_id === user?.id);

  return (
    <div className="container px-4 md:px-6 mx-auto max-w-5xl py-8 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-extrabold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-primary" />
            </div>
            Leaderboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Full student rankings based on XP, completed topics, and mastery.
          </p>
        </div>
        <Button asChild variant="outline" className="rounded-full gap-2 text-xs">
          <Link to="/">Back to dashboard</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="rounded-xl border-border/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Ranked students</p>
            <p className="text-2xl font-display font-bold">{entries.length}</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-border/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Top XP</p>
            <p className="text-2xl font-display font-bold">{entries[0]?.total_xp ?? 0}</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-border/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Your rank</p>
            <p className="text-2xl font-display font-bold">{currentUserRank >= 0 ? currentUserRank + 1 : "-"}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-border/50">
        <CardContent className="p-4 md:p-6 space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Filter by student name"
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                aria-label="Filter students by name"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {(["all", "streaking", "gold", "level5"] as StudentFilter[]).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilter(value)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    filter === value
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border/60 bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {filterConfig[value]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5" />
              Showing {filteredEntries.length} of {entries.length} students
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              Ranked by XP, completed topics, then gold mastery
            </span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Skeleton key={item} className="h-16 rounded-xl" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-6 text-sm text-muted-foreground">
              Leaderboard unavailable right now.
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/60 px-4 py-8 text-center text-sm text-muted-foreground">
              No students match the current filter.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEntries.map((entry) => {
                const index = entries.findIndex((candidate) => candidate.user_id === entry.user_id);
                return (
                  <LeaderboardRow
                    key={entry.user_id}
                    entry={entry}
                    index={index}
                    isCurrentUser={user?.id === entry.user_id}
                  />
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
