import type { Difficulty } from '@/types/game';
import { generatePuzzle } from './generator';
import type { Cell } from '@/types/game';

interface DailyPuzzleData {
  board: Cell[];
  solution: string;
  difficulty: Difficulty;
  date: string;
}

const DAILY_DIFFICULTIES: Difficulty[] = ['easy', 'mild', 'medium', 'hard', 'expert'];

function getStorageKey(date: string): string {
  return `soduken-daily-${date}`;
}

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

function getDailyDifficulty(dateString: string): Difficulty {
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = ((hash << 5) - hash + dateString.charCodeAt(i)) | 0;
  }
  return DAILY_DIFFICULTIES[Math.abs(hash) % DAILY_DIFFICULTIES.length];
}

export function getDailyPuzzle(): DailyPuzzleData {
  const date = getTodayString();
  const storageKey = getStorageKey(date);

  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(storageKey);
    if (cached) {
      return JSON.parse(cached);
    }
  }

  const difficulty = getDailyDifficulty(date);
  const { board, solution } = generatePuzzle(difficulty);
  const data: DailyPuzzleData = { board, solution, difficulty, date };

  if (typeof window !== 'undefined') {
    localStorage.setItem(storageKey, JSON.stringify(data));
    pruneOldDailies();
  }

  return data;
}

function pruneOldDailies() {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  const cutoffStr = cutoff.toISOString().split('T')[0];

  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key?.startsWith('soduken-daily-')) {
      const date = key.replace('soduken-daily-', '');
      if (date < cutoffStr) {
        localStorage.removeItem(key);
      }
    }
  }
}
