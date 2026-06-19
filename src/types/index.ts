export interface Lesson {
  id: number;
  title: string;
  description: string;
  category: string;
  order: number;
  difficulty: string;
}

export interface Question {
  id: number;
  lessonId: number;
  prompt: string;
  options: string[];
  correctIndex: number;
  hint: string | null;
}

export interface LeaderboardEntry {
  id: number;
  name: string;
  xp: number;
  streak: number;
}

export interface UserStats {
  xp: number;
  streak: number;
  level: number;
  lastActiveDate: string | null;
  displayName: string;
  avatar: string;
}
