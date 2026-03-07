import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuid } from 'uuid';
import type { GameState, Difficulty, CellValue, Cell } from '@/types/game';
import { generatePuzzle } from '@/lib/sudoku/generator';
import { findConflicts, isBoardComplete } from '@/lib/sudoku/validator';
import { getHintIndex, getHintValue } from '@/lib/sudoku/hints';

interface GameStore {
  game: GameState | null;
  conflicts: Set<number>;

  startNewGame: (difficulty: Difficulty, isDaily?: boolean, dailyDate?: string | null, pregenBoard?: Cell[], pregenSolution?: string) => void;
  selectCell: (index: number | null) => void;
  enterNumber: (value: number) => void;
  togglePencilMode: () => void;
  erase: () => void;
  undo: () => void;
  useHint: () => void;
  tick: () => void;
  togglePause: () => void;
  clearGame: () => void;
  getNumberCounts: () => Record<number, number>;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      game: null,
      conflicts: new Set<number>(),

      startNewGame: (difficulty, isDaily = false, dailyDate = null, pregenBoard, pregenSolution) => {
        let board: Cell[];
        let solution: string;

        if (pregenBoard && pregenSolution) {
          board = pregenBoard;
          solution = pregenSolution;
        } else {
          const puzzle = generatePuzzle(difficulty);
          board = puzzle.board;
          solution = puzzle.solution;
        }

        set({
          game: {
            id: uuid(),
            board,
            solution,
            difficulty,
            selectedCell: null,
            isPencilMode: false,
            moveHistory: [],
            hintsUsed: 0,
            errorsCount: 0,
            elapsedSeconds: 0,
            isPaused: false,
            isComplete: false,
            startedAt: Date.now(),
            completedAt: null,
            isDaily,
            dailyDate,
          },
          conflicts: new Set(),
        });
      },

      selectCell: (index) => {
        const { game } = get();
        if (!game || game.isComplete) return;
        set({ game: { ...game, selectedCell: index } });
      },

      enterNumber: (value) => {
        const { game } = get();
        if (!game || game.selectedCell === null || game.isComplete || game.isPaused) return;

        const idx = game.selectedCell;
        const cell = game.board[idx];
        if (cell.isGiven) return;

        const newBoard = [...game.board];
        const move = {
          index: idx,
          prevValue: cell.value,
          prevPencilMarks: [...cell.pencilMarks],
          newValue: cell.value,
          newPencilMarks: [...cell.pencilMarks],
        };

        if (game.isPencilMode) {
          const newMarks = cell.pencilMarks.includes(value)
            ? cell.pencilMarks.filter(m => m !== value)
            : [...cell.pencilMarks, value].sort();
          newBoard[idx] = { ...cell, pencilMarks: newMarks, value: null };
          move.newPencilMarks = newMarks;
          move.newValue = null;
        } else {
          const newValue = cell.value === value ? null : value as CellValue;
          newBoard[idx] = { ...cell, value: newValue, pencilMarks: [] };
          move.newValue = newValue;
          move.newPencilMarks = [];
        }

        const newConflicts = findConflicts(newBoard);
        let newErrors = game.errorsCount;
        if (!game.isPencilMode && move.newValue !== null) {
          const correctValue = parseInt(game.solution[idx]);
          if (move.newValue !== correctValue) {
            newErrors++;
          }
        }

        const complete = isBoardComplete(newBoard, game.solution);

        set({
          game: {
            ...game,
            board: newBoard,
            moveHistory: [...game.moveHistory, move],
            errorsCount: newErrors,
            isComplete: complete,
            completedAt: complete ? Date.now() : null,
          },
          conflicts: newConflicts,
        });
      },

      togglePencilMode: () => {
        const { game } = get();
        if (!game) return;
        set({ game: { ...game, isPencilMode: !game.isPencilMode } });
      },

      erase: () => {
        const { game } = get();
        if (!game || game.selectedCell === null || game.isComplete || game.isPaused) return;

        const idx = game.selectedCell;
        const cell = game.board[idx];
        if (cell.isGiven) return;

        const newBoard = [...game.board];
        const move = {
          index: idx,
          prevValue: cell.value,
          prevPencilMarks: [...cell.pencilMarks],
          newValue: null as CellValue,
          newPencilMarks: [] as number[],
        };

        newBoard[idx] = { ...cell, value: null, pencilMarks: [] };
        const newConflicts = findConflicts(newBoard);

        set({
          game: {
            ...game,
            board: newBoard,
            moveHistory: [...game.moveHistory, move],
          },
          conflicts: newConflicts,
        });
      },

      undo: () => {
        const { game } = get();
        if (!game || game.moveHistory.length === 0 || game.isComplete || game.isPaused) return;

        const newHistory = [...game.moveHistory];
        const lastMove = newHistory.pop()!;
        const newBoard = [...game.board];
        const cell = newBoard[lastMove.index];

        newBoard[lastMove.index] = {
          ...cell,
          value: lastMove.prevValue,
          pencilMarks: lastMove.prevPencilMarks,
        };

        const newConflicts = findConflicts(newBoard);

        set({
          game: {
            ...game,
            board: newBoard,
            moveHistory: newHistory,
          },
          conflicts: newConflicts,
        });
      },

      useHint: () => {
        const { game } = get();
        if (!game || game.isComplete || game.isPaused) return;

        const hintIdx = getHintIndex(game.board);
        if (hintIdx === null) return;

        const hintValue = getHintValue(game.solution, hintIdx);
        const cell = game.board[hintIdx];
        const newBoard = [...game.board];

        const move = {
          index: hintIdx,
          prevValue: cell.value,
          prevPencilMarks: [...cell.pencilMarks],
          newValue: hintValue,
          newPencilMarks: [] as number[],
        };

        newBoard[hintIdx] = {
          ...cell,
          value: hintValue,
          pencilMarks: [],
          isHinted: true,
        };

        const newConflicts = findConflicts(newBoard);
        const complete = isBoardComplete(newBoard, game.solution);

        set({
          game: {
            ...game,
            board: newBoard,
            selectedCell: hintIdx,
            moveHistory: [...game.moveHistory, move],
            hintsUsed: game.hintsUsed + 1,
            isComplete: complete,
            completedAt: complete ? Date.now() : null,
          },
          conflicts: newConflicts,
        });
      },

      tick: () => {
        const { game } = get();
        if (!game || game.isPaused || game.isComplete) return;
        set({ game: { ...game, elapsedSeconds: game.elapsedSeconds + 1 } });
      },

      togglePause: () => {
        const { game } = get();
        if (!game || game.isComplete) return;
        set({ game: { ...game, isPaused: !game.isPaused } });
      },

      clearGame: () => {
        set({ game: null, conflicts: new Set() });
      },

      getNumberCounts: () => {
        const { game } = get();
        const counts: Record<number, number> = {};
        for (let i = 1; i <= 9; i++) counts[i] = 0;
        if (game) {
          for (const cell of game.board) {
            if (cell.value) counts[cell.value]++;
          }
        }
        return counts;
      },
    }),
    {
      name: 'soduken-game',
      partialize: (state) => ({ game: state.game }),
      merge: (persisted, current) => {
        const p = persisted as Partial<GameStore>;
        return {
          ...current,
          game: p.game ?? null,
          conflicts: p.game ? findConflicts(p.game.board) : new Set<number>(),
        };
      },
    }
  )
);
