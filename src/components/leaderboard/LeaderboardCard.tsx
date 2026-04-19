import { Link } from "react-router-dom";
import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LeaderboardRow } from "@/components/leaderboard/LeaderboardRow";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useAuth } from "@/hooks/useAuth";

export function LeaderboardCard() {
  const { user } = useAuth();
  const { entries, loading, error } = useLeaderboard(5);

  return (
    <Card className="rounded-2xl overflow-hidden">
      <CardContent className="p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-display font-bold flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Leaderboard
            </h3>
            <p className="text-sm text-muted-foreground">
              Top students ranked by XP, completed topics, and mastery.
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-full text-xs">
            <Link to="/leaderboard">View all</Link>
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <Skeleton key={item} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-muted-foreground">
            Leaderboard unavailable right now.
          </div>
        ) : entries.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/60 px-4 py-8 text-center text-sm text-muted-foreground">
            No leaderboard scores yet.
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry, index) => (
              <LeaderboardRow
                key={entry.user_id}
                entry={entry}
                index={index}
                isCurrentUser={user?.id === entry.user_id}
                compact
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
