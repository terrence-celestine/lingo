import { createContext, useContext, useState, type ReactNode } from "react";
import type { UserStats } from "../types";

const STORAGE_KEY = "lingo_user_stats";
const COMPLETED_KEY = "lingo_completed_lessons";

const DEFAULT_STATS: UserStats = {
  xp: 0,
  streak: 0,
  level: 1,
  lastActiveDate: null,
  displayName: "TC",
  avatar: "🦊",
  streakFreeze: 0,
};

function getLevel(xp: number): number {
  return Math.floor(xp / 500) + 1;
}

function getXpForLevel(level: number): number {
  return (level - 1) * 500;
}

interface UserStatsContextValue {
  stats: UserStats;
  completedLessons: number[];
  addXp: (amount: number) => void;
  completeLesson: (lessonId: number) => void;
  updateDisplayName: (name: string) => void;
  updateAvatar: (avatar: string) => void;
  resetProgress: () => void;
  isLessonUnlocked: (
    lessonOrder: number,
    allLessons: { id: number; order: number }[],
  ) => boolean;
  xpIntoCurrentLevel: () => number;
  xpForNextLevel: () => number;
}

const UserStatsContext = createContext<UserStatsContextValue | null>(null);

export function UserStatsProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<UserStats>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...DEFAULT_STATS, ...JSON.parse(stored) } : DEFAULT_STATS;
  });

  const [completedLessons, setCompletedLessons] = useState<number[]>(() => {
    const stored = localStorage.getItem(COMPLETED_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  function addXp(amount: number) {
    setStats((prev) => {
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const twoDaysAgo = new Date(Date.now() - 172800000).toDateString();
      const lastActive = prev.lastActiveDate;

      const isNewDay = lastActive !== today;
      const missedOneDay = lastActive === twoDaysAgo;
      const newXp = prev.xp + amount;
      const newLevel = getLevel(newXp);
      const leveledUp = newLevel > prev.level;

      // award a freeze on level up
      const freezeBonus = leveledUp ? 1 : 0;

      let newStreak = prev.streak;
      let newFreeze = (prev.streakFreeze ?? 1) + freezeBonus;

      if (isNewDay) {
        if (lastActive === yesterday || lastActive === null) {
          // consecutive day
          newStreak = prev.streak + 1;
        } else if (missedOneDay && newFreeze > 0) {
          // missed one day — auto consume freeze
          newStreak = prev.streak;
          newFreeze = newFreeze - 1;
        } else {
          // missed more than one day or no freeze
          newStreak = 1;
        }
      }

      const updated = {
        ...prev,
        xp: newXp,
        streak: newStreak,
        level: newLevel,
        lastActiveDate: today,
        streakFreeze: newFreeze,
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

  function updateDisplayName(name: string) {
    setStats((prev) => {
      const updated = { ...prev, displayName: name };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }

  function updateAvatar(avatar: string) {
    setStats((prev) => {
      const updated = { ...prev, avatar };
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

  return (
    <UserStatsContext.Provider
      value={{
        stats,
        completedLessons,
        addXp,
        completeLesson,
        updateDisplayName,
        updateAvatar,
        resetProgress,
        isLessonUnlocked,
        xpIntoCurrentLevel,
        xpForNextLevel,
      }}
    >
      {children}
    </UserStatsContext.Provider>
  );
}

export function useUserStats() {
  const ctx = useContext(UserStatsContext);
  if (!ctx)
    throw new Error("useUserStats must be used inside UserStatsProvider");
  return ctx;
}
