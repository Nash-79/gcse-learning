import { LEVEL_STEP_XP } from "./config";

export function calculateLevel(totalXp: number): number {
  return Math.max(1, Math.floor(totalXp / LEVEL_STEP_XP) + 1);
}

export function getXpIntoLevel(totalXp: number): number {
  return totalXp % LEVEL_STEP_XP;
}

export function getXpForNextLevel(totalXp: number): number {
  return LEVEL_STEP_XP - getXpIntoLevel(totalXp);
}
