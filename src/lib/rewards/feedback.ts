import { toast } from "sonner";
import { BADGE_DESCRIPTIONS, BADGE_LABELS } from "@/lib/rewards/config";
import type { RewardResult } from "@/lib/rewards/types";

export function showRewardFeedback(result: RewardResult) {
  if (result.xpGained > 0) {
    toast.success(`+${result.xpGained} XP`, {
      description: result.awarded.map((reward) => reward.label).join(" • "),
    });
  }

  result.unlockedBadges.forEach((badge) => {
    toast.success(`Badge unlocked: ${BADGE_LABELS[badge]}`, {
      description: BADGE_DESCRIPTIONS[badge],
    });
  });
}
