import { getSudoku } from 'sudoku-gen';
import type { Cell, Difficulty } from '@/types/game';

const difficultyMap: Record<Difficulty, 'easy' | 'medium' | 'hard' | 'expert'> = {
  easy: 'easy',
  medium: 'medium',
  hard: 'hard',
  expert: 'expert',
};

export function generatePuzzle(difficulty: Difficulty): { board: Cell[]; solution: string } {
  const sudoku = getSudoku(difficultyMap[difficulty]);
  return parsePuzzle(sudoku.puzzle, sudoku.solution);
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
