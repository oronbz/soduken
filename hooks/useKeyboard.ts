'use client';
import { useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';

export function useKeyboard() {
  const selectCell = useGameStore(s => s.selectCell);
  const enterNumber = useGameStore(s => s.enterNumber);
  const erase = useGameStore(s => s.erase);
  const undo = useGameStore(s => s.undo);
  const togglePencilMode = useGameStore(s => s.togglePencilMode);
  const selectedCell = useGameStore(s => s.game?.selectedCell ?? null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key >= '1' && e.key <= '9') {
        enterNumber(parseInt(e.key));
        return;
      }

      switch (e.key) {
        case 'Backspace':
        case 'Delete':
          erase();
          break;
        case 'z':
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            undo();
          }
          break;
        case 'p':
          togglePencilMode();
          break;
        case 'ArrowUp':
          if (selectedCell !== null && selectedCell >= 9) selectCell(selectedCell - 9);
          break;
        case 'ArrowDown':
          if (selectedCell !== null && selectedCell < 72) selectCell(selectedCell + 9);
          break;
        case 'ArrowLeft':
          if (selectedCell !== null && selectedCell % 9 > 0) selectCell(selectedCell - 1);
          break;
        case 'ArrowRight':
          if (selectedCell !== null && selectedCell % 9 < 8) selectCell(selectedCell + 1);
          break;
        case 'Escape':
          selectCell(null);
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectCell, enterNumber, erase, undo, togglePencilMode, selectedCell]);
}
