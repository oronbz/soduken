import type { LevelTitle } from '@/types/profile';

interface LevelDefinition {
  level: number;
  title: LevelTitle;
  xpRequired: number;
}

export const LEVELS: LevelDefinition[] = [
  { level: 1, title: 'Sudoku Seedling', xpRequired: 0 },
  { level: 2, title: 'Puzzle Sprout', xpRequired: 100 },
  { level: 3, title: 'Number Novice', xpRequired: 300 },
  { level: 4, title: 'Sudoku Apprentice', xpRequired: 600 },
  { level: 5, title: 'Grid Adept', xpRequired: 1000 },
  { level: 6, title: 'Logic Weaver', xpRequired: 1500 },
  { level: 7, title: 'Sudoku Master', xpRequired: 2500 },
  { level: 8, title: 'Puzzle Sage', xpRequired: 4000 },
  { level: 9, title: 'Sudoku Grandmaster', xpRequired: 6000 },
];

export function getLevelForXP(totalXP: number): LevelDefinition {
  let current = LEVELS[0];
  for (const level of LEVELS) {
    if (totalXP >= level.xpRequired) {
      current = level;
    } else {
      break;
    }
  }
  return current;
}

export function getXPProgress(totalXP: number): { current: number; needed: number; percentage: number } {
  const currentLevel = getLevelForXP(totalXP);
  const nextLevel = LEVELS.find(l => l.level === currentLevel.level + 1);

  if (!nextLevel) {
    return { current: 0, needed: 0, percentage: 100 };
  }

  const current = totalXP - currentLevel.xpRequired;
  const needed = nextLevel.xpRequired - currentLevel.xpRequired;
  const percentage = Math.min(100, Math.floor((current / needed) * 100));

  return { current, needed, percentage };
}
