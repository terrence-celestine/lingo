import { useState } from "react";
import type { UserStats } from "../types";

const STORAGE_KEY = "lingo_user_stats";
const COMPLETED_KEY = "lingo_completed_lessons";

const DEFAULT_STATS: UserStats = {
  xp: 0,
  streak: 0,
  level: 1,
  lastActiveDate: null,
  displayName: "TC",
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

  const [completedLessons, setCompletedLessons] = useState<number[]>(() => {
    const stored = localStorage.getItem(COMPLETED_KEY);
    return stored ? JSON.parse(stored) : [];
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

  function completeLesson(lessonId: number) {
    setCompletedLessons((prev) => {
      if (prev.includes(lessonId)) return prev;
      const updated = [...prev, lessonId];
      localStorage.setItem(COMPLETED_KEY, JSON.stringify(updated));
      return updated;
    });
  }

  function isLessonUnlocked(
    lessonOrder: number,
    allLessons: { id: number; order: number }[],
  ): boolean {
    if (lessonOrder === 1) return true;
    const prevLesson = allLessons.find((l) => l.order === lessonOrder - 1);
    return prevLesson ? completedLessons.includes(prevLesson.id) : false;
  }

  function xpIntoCurrentLevel(): number {
    return stats.xp - getXpForLevel(stats.level);
  }

  function xpForNextLevel(): number {
    return 500;
  }

  function updateDisplayName(name: string) {
    setStats((prev) => {
      const updated = { ...prev, displayName: name };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }

  function resetProgress() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(COMPLETED_KEY);
    setStats(DEFAULT_STATS);
    setCompletedLessons([]);
  }

  return {
    stats,
    addXp,
    completeLesson,
    completedLessons,
    isLessonUnlocked,
    xpIntoCurrentLevel,
    xpForNextLevel,
    updateDisplayName,
    resetProgress,
  };
}
