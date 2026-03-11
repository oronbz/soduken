import type { Achievement, AchievementId } from '@/types/profile';
import type { GameState, Difficulty } from '@/types/game';
import type { Statistics } from '@/types/stats';

export const ACHIEVEMENT_DEFINITIONS: Omit<Achievement, 'unlockedAt'>[] = [
  { id: 'first_solve', name: 'First Steps', description: 'Complete your first puzzle', icon: '🌱' },
  { id: 'no_hints', name: 'Pure Logic', description: 'Complete a puzzle without hints', icon: '🧠' },
  { id: 'no_errors', name: 'Flawless', description: 'Complete a puzzle without errors', icon: '✨' },
  { id: 'speed_demon_easy', name: 'Speed Demon', description: 'Complete Easy in under 5 minutes', icon: '⚡' },
  { id: 'speed_demon_mild', name: 'Warming Up', description: 'Complete Mild in under 7.5 minutes', icon: '💫' },
  { id: 'speed_demon_medium', name: 'Quick Thinker', description: 'Complete Medium in under 10 minutes', icon: '💨' },
  { id: 'speed_demon_hard', name: 'Lightning Logic', description: 'Complete Hard in under 20 minutes', icon: '🌩️' },
  { id: 'week_streak', name: 'Weekly Warrior', description: 'Play 7 days in a row', icon: '🔥' },
  { id: 'month_streak', name: 'Monthly Master', description: 'Play 30 days in a row', icon: '🏔️' },
  { id: 'hundred_games', name: 'Century', description: 'Play 100 games', icon: '💯' },
  { id: 'all_difficulties', name: 'Well Rounded', description: 'Win on every difficulty', icon: '🎯' },
  { id: 'daily_first', name: 'Daily Devotee', description: 'Complete your first daily challenge', icon: '📅' },
  { id: 'daily_week', name: 'Daily Ritual', description: 'Complete 7 daily challenges', icon: '🗓️' },
  { id: 'perfect_game', name: 'Perfection', description: 'No hints, no errors, under par time', icon: '👑' },
  { id: 'level_5', name: 'Rising Star', description: 'Reach level 5', icon: '⭐' },
  { id: 'level_10', name: 'Dedicated', description: 'Reach level 10', icon: '🌟' },
  { id: 'level_20', name: 'Legend', description: 'Reach level 20', icon: '🏆' },
];

export function createInitialAchievements(): Achievement[] {
  return ACHIEVEMENT_DEFINITIONS.map(def => ({ ...def, unlockedAt: null }));
}

const PAR_TIMES: Record<Difficulty, number> = {
  easy: 300,
  mild: 450,
  medium: 600,
  hard: 1200,
  expert: 2400,
};

export function checkAchievements(
  game: GameState,
  stats: Statistics,
  level: number,
  currentAchievements: Achievement[]
): AchievementId[] {
  const unlocked = new Set(currentAchievements.filter(a => a.unlockedAt).map(a => a.id));
  const newlyUnlocked: AchievementId[] = [];

  const check = (id: AchievementId, condition: boolean) => {
    if (!unlocked.has(id) && condition) newlyUnlocked.push(id);
  };

  check('first_solve', true);
  check('no_hints', game.hintsUsed === 0);
  check('no_errors', game.errorsCount === 0);
  check('speed_demon_easy', game.difficulty === 'easy' && game.elapsedSeconds < 300);
  check('speed_demon_mild', game.difficulty === 'mild' && game.elapsedSeconds < 450);
  check('speed_demon_medium', game.difficulty === 'medium' && game.elapsedSeconds < 600);
  check('speed_demon_hard', game.difficulty === 'hard' && game.elapsedSeconds < 1200);
  check('week_streak', stats.streak.currentStreak >= 7);
  check('month_streak', stats.streak.currentStreak >= 30);
  check('hundred_games', stats.overall.totalGamesPlayed >= 100);
  check('all_difficulties', (['easy', 'mild', 'medium', 'hard', 'expert'] as Difficulty[]).every(
    d => stats.byDifficulty[d].gamesWon > 0
  ));
  check('daily_first', game.isDaily);
  check('daily_week', stats.dailyChallenge.completed.length >= 7);
  check('perfect_game', game.hintsUsed === 0 && game.errorsCount === 0 && game.elapsedSeconds < PAR_TIMES[game.difficulty]);
  check('level_5', level >= 5);
  check('level_10', level >= 10);
  check('level_20', level >= 20);

  return newlyUnlocked;
}
