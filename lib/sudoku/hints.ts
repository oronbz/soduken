import type { Cell, CellValue } from '@/types/game';

export function getHintIndex(board: Cell[]): number | null {
  const emptyCells: number[] = [];
  for (let i = 0; i < 81; i++) {
    if (!board[i].value && !board[i].isGiven) {
      emptyCells.push(i);
    }
  }
  if (emptyCells.length === 0) return null;
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

export function getHintValue(solution: string, index: number): CellValue {
  return parseInt(solution[index]) as CellValue;
}
