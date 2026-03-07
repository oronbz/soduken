'use client';
import React, { memo, useMemo } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { isSameRow, isSameCol, isSameBox } from '@/lib/sudoku/validator';

interface CellProps {
  index: number;
}

function CellInner({ index }: CellProps) {
  const cell = useGameStore(s => s.game?.board[index]);
  const selectedCell = useGameStore(s => s.game?.selectedCell ?? null);
  const conflicts = useGameStore(s => s.conflicts);
  const selectCell = useGameStore(s => s.selectCell);
  const solution = useGameStore(s => s.game?.solution);

  const isSelected = selectedCell === index;
  const isHighlighted = useMemo(() => {
    if (selectedCell === null) return false;
    return isSameRow(index, selectedCell) || isSameCol(index, selectedCell) || isSameBox(index, selectedCell);
  }, [index, selectedCell]);

  const selectedValue = useGameStore(s => {
    if (s.game?.selectedCell === null || s.game?.selectedCell === undefined) return null;
    return s.game.board[s.game.selectedCell]?.value ?? null;
  });

  const isSameNumber = cell?.value && selectedValue && cell.value === selectedValue;
  const isConflict = conflicts.has(index);
  const isError = !!(cell?.value && solution && cell.value !== parseInt(solution[index]) && !cell.isGiven);

  if (!cell) return <div className="w-full h-full" />;

  return (
    <button
      onClick={() => selectCell(index)}
      className={`
        w-full h-full flex items-center justify-center relative
        text-3xl font-semibold transition-all duration-150 select-none
        outline-none cursor-pointer
        ${isSelected
          ? 'bg-terracotta/20 ring-2 ring-terracotta shadow-[var(--shadow-glow-terracotta)]'
          : isSameNumber
            ? 'bg-terracotta/12 ring-1 ring-terracotta/30'
            : isHighlighted
              ? 'bg-cream-dark/50'
              : 'bg-cream-light hover:bg-cream-dark/30'
        }
        ${isError ? 'cell-error' : ''}
      `}
      aria-label={`Row ${Math.floor(index / 9) + 1}, Column ${index % 9 + 1}${cell.value ? `, Value ${cell.value}` : ', Empty'}`}
    >
      {cell.value ? (
        <span
          className={`
            font-bold
            ${(isError || (isConflict && !cell.isGiven))
              ? 'text-error'
              : cell.isGiven
                ? 'text-brown-dark'
                : cell.isHinted
                  ? 'text-sage-dark'
                  : 'text-brown-dark'
            }
            ${!cell.isGiven ? 'cell-enter' : ''}
          `}
          key={cell.value}
        >
          {cell.value}
        </span>
      ) : cell.pencilMarks.length > 0 ? (
        <div className="grid grid-cols-3 gap-0 w-full h-full p-0.5 items-center">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <span
              key={n}
              className="text-[0.5rem] leading-none text-center text-brown-light/70"
            >
              {cell.pencilMarks.includes(n) ? n : ''}
            </span>
          ))}
        </div>
      ) : null}
    </button>
  );
}

export const Cell = memo(CellInner);
