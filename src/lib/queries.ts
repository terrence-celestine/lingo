import type { Lesson, Question, LeaderboardEntry } from "../types";

export const lessonQueries = {
  all: (language: string) => ({
    queryKey: ["lessons", language],
    queryFn: (): Promise<Lesson[]> =>
      fetch(`/api/lessons?language=${language}`).then((r) => r.json()),
  }),
  questions: (lessonId: string) => ({
    queryKey: ["questions", lessonId],
    queryFn: (): Promise<Question[]> =>
      fetch(`/api/questions?lessonId=${lessonId}`)
        .then((r) => r.json())
        .then((data) => [...data].sort(() => Math.random() - 0.5)),
  }),
};

export const leaderboardQueries = {
  all: () => ({
    queryKey: ["leaderboard"],
    queryFn: (): Promise<LeaderboardEntry[]> =>
      fetch("/api/leaderboard").then((r) => r.json()),
  }),
};
