import type { Difficulty } from './game';

export interface DifficultyStats {
  gamesPlayed: number;
  gamesWon: number;
  bestTimeSeconds: number | null;
  averageTimeSeconds: number | null;
  totalTimeSeconds: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate: string | null;
  playedDates: string[];
}

export interface Statistics {
  overall: {
    totalGamesPlayed: number;
    totalGamesWon: number;
    totalHintsUsed: number;
    totalPlayTimeSeconds: number;
  };
  byDifficulty: Record<Difficulty, DifficultyStats>;
  streak: StreakData;
  dailyChallenge: {
    completed: string[];
    bestTimes: Record<string, number>;
  };
}
