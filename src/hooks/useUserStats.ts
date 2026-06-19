import { useState } from "react";
import type { UserStats } from "../types";

const STORAGE_KEY = "lingo_user_stats";

const DEFAULT_STATS: UserStats = {
  xp: 0,
  streak: 0,
  level: 1,
  lastActiveDate: null,
};

function getLevel(xp: number): number {
  return Math.floor(xp / 500) + 1;
}

function getXpForLevel(level: number): number {
  return (level - 1) * 500;
}

export function useUserStats() {
  const [stats, setStats] = useState<UserStats>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_STATS;
  });

  function addXp(amount: number) {
    setStats((prev) => {
      const today = new Date().toDateString();
      const lastActive = prev.lastActiveDate;
      const isNewDay = lastActive !== today;
      const newXp = prev.xp + amount;
      const newStreak = isNewDay ? prev.streak + 1 : prev.streak;
      const updated = {
        ...prev,
        xp: newXp,
        streak: newStreak,
        level: getLevel(newXp),
        lastActiveDate: today,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }

  function xpIntoCurrentLevel(): number {
    return stats.xp - getXpForLevel(stats.level);
  }

  function xpForNextLevel(): number {
    return 500;
  }

  return { stats, addXp, xpIntoCurrentLevel, xpForNextLevel };
}
