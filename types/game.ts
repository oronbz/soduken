export type Difficulty = 'easy' | 'mild' | 'medium' | 'hard' | 'expert';

export type CellValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | null;

export type PencilMarks = number[];

export interface Cell {
  value: CellValue;
  pencilMarks: PencilMarks;
  isGiven: boolean;
  isHinted: boolean;
}

export interface GameMove {
  index: number;
  prevValue: CellValue;
  prevPencilMarks: PencilMarks;
  newValue: CellValue;
  newPencilMarks: PencilMarks;
}

export interface GameState {
  id: string;
  board: Cell[];
  solution: string;
  difficulty: Difficulty;
  selectedCell: number | null;
  isPencilMode: boolean;
  moveHistory: GameMove[];
  hintsUsed: number;
  errorsCount: number;
  elapsedSeconds: number;
  isPaused: boolean;
  isComplete: boolean;
  startedAt: number;
  completedAt: number | null;
  isDaily: boolean;
  dailyDate: string | null;
}
