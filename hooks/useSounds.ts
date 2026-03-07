'use client';
import { useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { useProfileStore } from '@/stores/profileStore';
import { sounds, warmUpAudio } from '@/lib/sounds';

export function useSounds() {
  // Warm up AudioContext on first user interaction (required by mobile browsers)
  useEffect(() => {
    const handler = () => warmUpAudio();
    document.addEventListener('pointerdown', handler);
    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('pointerdown', handler);
      document.removeEventListener('keydown', handler);
    };
  }, []);

  // React to game state changes
  useEffect(() => {
    const unsub = useGameStore.subscribe((state, prev) => {
      if (useProfileStore.getState().profile.soundEnabled === false) return;

      const game = state.game;
      const prevGame = prev.game;
      if (!game || !prevGame) return;

      if (game.isComplete && !prevGame.isComplete) {
        sounds.complete();
        return;
      }

      if (game.errorsCount > prevGame.errorsCount) {
        sounds.error();
        return;
      }

      if (game.hintsUsed > prevGame.hintsUsed) {
        sounds.hint();
        return;
      }

      if (game.moveHistory.length < prevGame.moveHistory.length) {
        sounds.undo();
        return;
      }

      if (game.isPencilMode !== prevGame.isPencilMode) {
        sounds.toggle();
        return;
      }

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

      if (game.selectedCell !== prevGame.selectedCell && game.selectedCell !== null) {
        sounds.tap();
      }
    });

    return unsub;
  }, []);
}
