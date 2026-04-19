import { Flame, Sparkles, Star, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Progress as LearnerProgress } from "@/lib/rewards/types";
import { getXpForNextLevel, getXpIntoLevel } from "@/lib/rewards/levels";

interface RewardsSummaryCardProps {
  progress: LearnerProgress;
}

export function RewardsSummaryCard({ progress }: RewardsSummaryCardProps) {
  const { rewards } = progress;
  const masteredTopics = progress.topicProgress.filter((topic) => topic.masteryTier !== "none").length;
  const xpIntoLevel = getXpIntoLevel(rewards.totalXp);
  const xpForNextLevel = getXpForNextLevel(rewards.totalXp);
  const xpProgress = xpForNextLevel > 0 ? (xpIntoLevel / xpForNextLevel) * 100 : 100;

  return (
    <Card className="glass card-shine rounded-2xl overflow-hidden border-primary/20">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Rewards Progress</p>
            <h3 className="text-2xl font-bold font-display flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Level {rewards.level}
            </h3>
          </div>
          <div className="rounded-xl bg-primary/10 px-3 py-2 text-right">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Total XP</p>
            <p className="text-lg font-bold text-primary">{rewards.totalXp}</p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{xpIntoLevel} XP into this level</span>
            <span>{xpForNextLevel - xpIntoLevel} XP to level {rewards.level + 1}</span>
          </div>
          <Progress value={xpProgress} className="mt-2 h-2 bg-muted/50" />
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-muted/40 px-3 py-3">
            <Flame className="mx-auto mb-1 h-4 w-4 text-orange-500" />
            <p className="text-sm font-semibold">{rewards.currentStreak}</p>
            <p className="text-[10px] text-muted-foreground">Current streak</p>
          </div>
          <div className="rounded-xl bg-muted/40 px-3 py-3">
            <Sparkles className="mx-auto mb-1 h-4 w-4 text-secondary" />
            <p className="text-sm font-semibold">{rewards.unlockedBadges.length}</p>
            <p className="text-[10px] text-muted-foreground">Badges</p>
          </div>
          <div className="rounded-xl bg-muted/40 px-3 py-3">
            <Trophy className="mx-auto mb-1 h-4 w-4 text-yellow-500" />
            <p className="text-sm font-semibold">{masteredTopics}</p>
            <p className="text-[10px] text-muted-foreground">Mastered topics</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
