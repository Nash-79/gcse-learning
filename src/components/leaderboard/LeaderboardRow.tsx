import { Medal } from "lucide-react";
import type { LeaderboardRow as LeaderboardEntry } from "@/lib/leaderboard";

const rankAccent = [
  "text-amber-400 bg-amber-500/10 border-amber-500/20",
  "text-slate-300 bg-slate-500/10 border-slate-500/20",
  "text-orange-400 bg-orange-500/10 border-orange-500/20",
];

function getRankAccent(index: number) {
  return rankAccent[index] || "text-muted-foreground bg-muted/40 border-border/50";
}

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  index: number;
  isCurrentUser: boolean;
  compact?: boolean;
}

export function LeaderboardRow({ entry, index, isCurrentUser, compact = false }: LeaderboardRowProps) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
        isCurrentUser ? "border-primary/40 bg-primary/5" : "border-border/50 bg-card"
      }`}
    >
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-bold ${getRankAccent(index)}`}>
        {index < 3 ? <Medal className="w-4 h-4" /> : <span>{index + 1}</span>}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-foreground">
            {entry.display_name}
          </p>
          {isCurrentUser && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
              You
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Level {entry.level} • {entry.completed_topics}/{entry.total_topics} topics • {entry.gold_topics} gold
          {!compact ? ` • ${entry.current_streak} day streak` : ""}
        </p>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold font-display text-foreground">{entry.total_xp}</p>
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">XP</p>
      </div>
    </div>
  );
}
