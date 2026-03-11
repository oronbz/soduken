import { getSudoku } from 'sudoku-gen';
import type { Cell, Difficulty } from '@/types/game';

const MILD_EXTRA_CLUES = 5;

const difficultyMap: Record<Difficulty, 'easy' | 'medium' | 'hard' | 'expert'> = {
  easy: 'easy',
  mild: 'medium',
  medium: 'medium',
  hard: 'hard',
  expert: 'expert',
};

export function generatePuzzle(difficulty: Difficulty): { board: Cell[]; solution: string } {
  const sudoku = getSudoku(difficultyMap[difficulty]);
  let puzzle = sudoku.puzzle;

  if (difficulty === 'mild') {
    const emptyCells: number[] = [];
    for (let i = 0; i < 81; i++) {
      if (puzzle[i] === '-') emptyCells.push(i);
    }
    // Fisher-Yates shuffle and pick first N
    for (let i = emptyCells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [emptyCells[i], emptyCells[j]] = [emptyCells[j], emptyCells[i]];
    }
    const toReveal = emptyCells.slice(0, MILD_EXTRA_CLUES);
    const chars = puzzle.split('');
    for (const idx of toReveal) {
      chars[idx] = sudoku.solution[idx];
    }
    puzzle = chars.join('');
  }

  return parsePuzzle(puzzle, sudoku.solution);
}

export function parsePuzzle(puzzle: string, solution: string): { board: Cell[]; solution: string } {
  const board: Cell[] = [];
  for (let i = 0; i < 81; i++) {
    const char = puzzle[i];
    if (char === '-') {
      board.push({
        value: null,
        pencilMarks: [],
        isGiven: false,
        isHinted: false,
      });
    } else {
      board.push({
        value: parseInt(char) as Cell['value'],
        pencilMarks: [],
        isGiven: true,
        isHinted: false,
      });
    }
  }
  return { board, solution };
}
