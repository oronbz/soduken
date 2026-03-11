import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Statistics } from '@/types/stats';
import type { GameState, Difficulty } from '@/types/game';
import { getTodayString } from '@/lib/time';

const emptyDifficultyStats = () => ({
  gamesPlayed: 0,
  gamesWon: 0,
  bestTimeSeconds: null,
  averageTimeSeconds: null,
  totalTimeSeconds: 0,
});

const defaultStats: Statistics = {
  overall: {
    totalGamesPlayed: 0,
    totalGamesWon: 0,
    totalHintsUsed: 0,
    totalPlayTimeSeconds: 0,
  },
  byDifficulty: {
    easy: emptyDifficultyStats(),
    mild: emptyDifficultyStats(),
    medium: emptyDifficultyStats(),
    hard: emptyDifficultyStats(),
    expert: emptyDifficultyStats(),
  },
  streak: {
    currentStreak: 0,
    longestStreak: 0,
    lastPlayedDate: null,
    playedDates: [],
  },
  dailyChallenge: {
    completed: [],
    bestTimes: {},
  },
};

interface StatsStore {
  stats: Statistics;
  recordGameComplete: (game: GameState) => void;
  updateStreak: () => void;
}

export const useStatsStore = create<StatsStore>()(
  persist(
    (set, get) => ({
      stats: defaultStats,

      recordGameComplete: (game) => {
        const { stats } = get();
        const today = getTodayString();
        const diff = game.difficulty as Difficulty;
        const ds = stats.byDifficulty[diff];

        const newGamesWon = ds.gamesWon + 1;
        const newTotalTime = ds.totalTimeSeconds + game.elapsedSeconds;
        const newBest = ds.bestTimeSeconds === null
          ? game.elapsedSeconds
          : Math.min(ds.bestTimeSeconds, game.elapsedSeconds);
        const newAvg = Math.floor(newTotalTime / newGamesWon);

        const playedDates = stats.streak.playedDates.includes(today)
          ? stats.streak.playedDates
          : [...stats.streak.playedDates, today];

        let currentStreak = stats.streak.currentStreak;
        if (stats.streak.lastPlayedDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          currentStreak = stats.streak.lastPlayedDate === yesterdayStr
            ? currentStreak + 1
            : 1;
        }

        const longestStreak = Math.max(stats.streak.longestStreak, currentStreak);

        const dailyCompleted = game.isDaily && game.dailyDate && !stats.dailyChallenge.completed.includes(game.dailyDate)
          ? [...stats.dailyChallenge.completed, game.dailyDate]
          : stats.dailyChallenge.completed;

        const dailyBestTimes = { ...stats.dailyChallenge.bestTimes };
        if (game.isDaily && game.dailyDate) {
          const existing = dailyBestTimes[game.dailyDate];
          if (!existing || game.elapsedSeconds < existing) {
            dailyBestTimes[game.dailyDate] = game.elapsedSeconds;
          }
        }

        set({
          stats: {
            overall: {
              totalGamesPlayed: stats.overall.totalGamesPlayed + 1,
              totalGamesWon: stats.overall.totalGamesWon + 1,
              totalHintsUsed: stats.overall.totalHintsUsed + game.hintsUsed,
              totalPlayTimeSeconds: stats.overall.totalPlayTimeSeconds + game.elapsedSeconds,
            },
            byDifficulty: {
              ...stats.byDifficulty,
              [diff]: {
                gamesPlayed: ds.gamesPlayed + 1,
                gamesWon: newGamesWon,
                bestTimeSeconds: newBest,
                averageTimeSeconds: newAvg,
                totalTimeSeconds: newTotalTime,
              },
            },
            streak: {
              currentStreak,
              longestStreak,
              lastPlayedDate: today,
              playedDates,
            },
            dailyChallenge: {
              completed: dailyCompleted,
              bestTimes: dailyBestTimes,
            },
          },
        });
      },

      updateStreak: () => {
        const { stats } = get();
        if (!stats.streak.lastPlayedDate) return;

        const today = getTodayString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (stats.streak.lastPlayedDate !== today && stats.streak.lastPlayedDate !== yesterdayStr) {
          set({
            stats: {
              ...stats,
              streak: {
                ...stats.streak,
                currentStreak: 0,
              },
            },
          });
        }
      },
    }),
    {
      name: 'soduken-stats',
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as Record<string, unknown>;
        if (version === 0) {
          const stats = state.stats as Statistics | undefined;
          if (stats && !stats.byDifficulty.mild) {
            stats.byDifficulty.mild = emptyDifficultyStats() as Statistics['byDifficulty']['mild'];
          }
        }
        return state;
      },
    }
  )
);
