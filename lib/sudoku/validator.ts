import type { Cell } from '@/types/game';

export function getRow(index: number): number {
  return Math.floor(index / 9);
}

export function getCol(index: number): number {
  return index % 9;
}

export function getBox(index: number): number {
  return Math.floor(getRow(index) / 3) * 3 + Math.floor(getCol(index) / 3);
}

export function getRowIndices(row: number): number[] {
  return Array.from({ length: 9 }, (_, i) => row * 9 + i);
}

export function getColIndices(col: number): number[] {
  return Array.from({ length: 9 }, (_, i) => i * 9 + col);
}

export function getBoxIndices(box: number): number[] {
  const startRow = Math.floor(box / 3) * 3;
  const startCol = (box % 3) * 3;
  const indices: number[] = [];
  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      indices.push(r * 9 + c);
    }
  }
  return indices;
}

export function findConflicts(board: Cell[]): Set<number> {
  const conflicts = new Set<number>();

  const checkGroup = (indices: number[]) => {
    for (let i = 0; i < indices.length; i++) {
      const a = board[indices[i]];
      if (!a.value) continue;
      for (let j = i + 1; j < indices.length; j++) {
        const b = board[indices[j]];
        if (b.value === a.value) {
          conflicts.add(indices[i]);
          conflicts.add(indices[j]);
        }
      }
    }
  };

  for (let i = 0; i < 9; i++) {
    checkGroup(getRowIndices(i));
    checkGroup(getColIndices(i));
    checkGroup(getBoxIndices(i));
  }

  return conflicts;
}

export function isBoardComplete(board: Cell[], solution: string): boolean {
  for (let i = 0; i < 81; i++) {
    if (!board[i].value) return false;
    if (board[i].value !== parseInt(solution[i])) return false;
  }
  return true;
}

export function isSameRow(a: number, b: number): boolean {
  return getRow(a) === getRow(b);
}

export function isSameCol(a: number, b: number): boolean {
  return getCol(a) === getCol(b);
}

export function isSameBox(a: number, b: number): boolean {
  return getBox(a) === getBox(b);
}
