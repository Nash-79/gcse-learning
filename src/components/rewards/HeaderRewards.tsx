import { Flame, Sparkles, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useGetProgress } from "@/hooks/useTopics";
import { getXpForNextLevel, getXpIntoLevel } from "@/lib/rewards/levels";

export function HeaderRewards() {
  const { data: progress } = useGetProgress();
  const rewards = progress?.rewards;

  if (!rewards) return null;

  const xpIntoLevel = getXpIntoLevel(rewards.totalXp);
  const xpForNextLevel = getXpForNextLevel(rewards.totalXp);
  const xpProgress = xpForNextLevel > 0 ? (xpIntoLevel / xpForNextLevel) * 100 : 100;

  return (
    <div className="hidden lg:flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1.5" aria-label="Rewards summary">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
        <Star className="h-3.5 w-3.5 text-primary" />
        <span>Lv {rewards.level}</span>
      </div>
      <div className="min-w-[120px]">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>{rewards.totalXp} XP</span>
          <span>{xpForNextLevel - xpIntoLevel} to next</span>
        </div>
        <Progress value={xpProgress} className="mt-1 h-1.5 bg-muted/50" />
      </div>
      <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
        <Flame className="h-3.5 w-3.5 text-orange-500" />
        <span>{rewards.currentStreak} day streak</span>
      </div>
      <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5 text-secondary" />
        <span>{rewards.unlockedBadges.length} badges</span>
      </div>
    </div>
  );
}
