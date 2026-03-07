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

      const vibrate = (pattern: number | number[]) => {
        navigator?.vibrate?.(pattern);
      };

      if (game.isComplete && !prevGame.isComplete) {
        sounds.complete();
        vibrate([30, 50, 30, 50, 80]);
        return;
      }

      if (game.errorsCount > prevGame.errorsCount) {
        sounds.error();
        vibrate([40, 30, 40]);
        return;
      }

      if (game.hintsUsed > prevGame.hintsUsed) {
        sounds.hint();
        vibrate(20);
        return;
      }

      if (game.moveHistory.length < prevGame.moveHistory.length) {
        sounds.undo();
        vibrate(15);
        return;
      }

      if (game.isPencilMode !== prevGame.isPencilMode) {
        sounds.toggle();
        vibrate(10);
        return;
      }

      if (game.moveHistory.length > prevGame.moveHistory.length) {
        const lastMove = game.moveHistory[game.moveHistory.length - 1];
        if (lastMove.newValue === null && lastMove.prevValue !== null) {
          sounds.erase();
          vibrate(15);
        } else if (lastMove.newValue !== null) {
          sounds.place();
          vibrate(20);
        } else {
          sounds.pencil();
          vibrate(10);
        }
        return;
      }

      if (game.selectedCell !== prevGame.selectedCell && game.selectedCell !== null) {
        sounds.tap();
        vibrate(10);
      }
    });

    return unsub;
  }, []);
}
