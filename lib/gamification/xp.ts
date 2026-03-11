import type { Difficulty } from '@/types/game';

const BASE_XP: Record<Difficulty, number> = {
  easy: 50,
  mild: 75,
  medium: 100,
  hard: 200,
  expert: 400,
};

const PAR_TIMES: Record<Difficulty, number> = {
  easy: 300,
  mild: 450,
  medium: 600,
  hard: 1200,
  expert: 2400,
};

export function calculateXP(params: {
  difficulty: Difficulty;
  hintsUsed: number;
  errorsCount: number;
  elapsedSeconds: number;
  isDaily: boolean;
}): { total: number; breakdown: { base: number; noHints: number; noErrors: number; speed: number; daily: number } } {
  const base = BASE_XP[params.difficulty];
  const noHints = params.hintsUsed === 0 ? Math.floor(base * 0.5) : 0;
  const noErrors = params.errorsCount === 0 ? Math.floor(base * 0.25) : 0;

  const par = PAR_TIMES[params.difficulty];
  const speedRatio = Math.max(0, 1 - params.elapsedSeconds / par);
  const speed = Math.floor(base * 0.5 * speedRatio);

  const subtotal = base + noHints + noErrors + speed;
  const daily = params.isDaily ? Math.floor(subtotal * 0.2) : 0;

  return {
    total: subtotal + daily,
    breakdown: { base, noHints, noErrors, speed, daily },
  };
}
