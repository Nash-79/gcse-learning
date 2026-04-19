import { Award, Crown, Medal } from "lucide-react";
import type { MasteryTier } from "@/lib/rewards/types";

const masteryConfig: Record<Exclude<MasteryTier, "none">, { label: string; className: string; icon: typeof Medal }> = {
  bronze: {
    label: "Bronze",
    className: "border-amber-600/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
    icon: Medal,
  },
  silver: {
    label: "Silver",
    className: "border-slate-400/30 bg-slate-400/10 text-slate-700 dark:text-slate-300",
    icon: Award,
  },
  gold: {
    label: "Gold",
    className: "border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300",
    icon: Crown,
  },
};

interface MasteryBadgeProps {
  tier: MasteryTier;
  compact?: boolean;
}

export function MasteryBadge({ tier, compact = false }: MasteryBadgeProps) {
  if (tier === "none") {
    return (
      <span className={`inline-flex items-center rounded-full border border-border/60 bg-muted/40 text-muted-foreground ${compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"}`}>
        In progress
      </span>
    );
  }

  const config = masteryConfig[tier];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-semibold ${config.className} ${compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"}`}
      aria-label={`${config.label} mastery`}
    >
      <Icon className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
      {config.label}
    </span>
  );
}
