'use client';
import { useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { useProfileStore } from '@/stores/profileStore';
import { sounds } from '@/lib/sounds';

export function useSounds() {
  useEffect(() => {
    const unsub = useGameStore.subscribe((state, prev) => {
      if (!useProfileStore.getState().profile.soundEnabled) return;

      const game = state.game;
      const prevGame = prev.game;
      if (!game || !prevGame) return;

      // Completion
      if (game.isComplete && !prevGame.isComplete) {
        sounds.complete();
        return;
      }

      // Error
      if (game.errorsCount > prevGame.errorsCount) {
        sounds.error();
        return;
      }

      // Hint
      if (game.hintsUsed > prevGame.hintsUsed) {
        sounds.hint();
        return;
      }

      // Undo (history shrunk)
      if (game.moveHistory.length < prevGame.moveHistory.length) {
        sounds.undo();
        return;
      }

      // Pencil mode toggled
      if (game.isPencilMode !== prevGame.isPencilMode) {
        sounds.toggle();
        return;
      }

      // Move made (history grew)
      if (game.moveHistory.length > prevGame.moveHistory.length) {
        const lastMove = game.moveHistory[game.moveHistory.length - 1];
        if (lastMove.newValue === null && lastMove.prevValue !== null) {
          sounds.erase();
        } else if (lastMove.newValue !== null) {
          sounds.place();
        } else {
          sounds.pencil();
        }
        return;
      }

      // Cell selection changed
      if (game.selectedCell !== prevGame.selectedCell && game.selectedCell !== null) {
        sounds.tap();
      }
    });

    return unsub;
  }, []);
}
