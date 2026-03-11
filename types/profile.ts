export type LevelTitle =
  | 'Sudoku Seedling'
  | 'Puzzle Sprout'
  | 'Number Novice'
  | 'Sudoku Apprentice'
  | 'Grid Adept'
  | 'Logic Weaver'
  | 'Sudoku Master'
  | 'Puzzle Sage'
  | 'Sudoku Grandmaster';

export type ThemePreference = 'system' | 'light' | 'dark';

export interface UserProfile {
  name: string;
  createdAt: number;
  totalXP: number;
  currentLevel: number;
  currentTitle: LevelTitle;
  isOnboarded: boolean;
  soundEnabled: boolean;
  theme: ThemePreference;
}

export type AchievementId =
  | 'first_solve'
  | 'no_hints'
  | 'no_errors'
  | 'speed_demon_easy'
  | 'speed_demon_mild'
  | 'speed_demon_medium'
  | 'speed_demon_hard'
  | 'week_streak'
  | 'month_streak'
  | 'hundred_games'
  | 'all_difficulties'
  | 'daily_first'
  | 'daily_week'
  | 'perfect_game'
  | 'level_5'
  | 'level_10'
  | 'level_20';

export interface Achievement {
  id: AchievementId;
  name: string;
  description: string;
  icon: string;
  unlockedAt: number | null;
}
