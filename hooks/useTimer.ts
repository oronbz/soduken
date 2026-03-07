'use client';
import { useEffect, useRef } from 'react';
import { useGameStore } from '@/stores/gameStore';

export function useTimer() {
  const tick = useGameStore(s => s.tick);
  const isPaused = useGameStore(s => s.game?.isPaused ?? true);
  const isComplete = useGameStore(s => s.game?.isComplete ?? true);
  const hasGame = useGameStore(s => s.game !== null);
  const lastTickRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!hasGame || isPaused || isComplete) return;

    lastTickRef.current = Date.now();

    const interval = setInterval(() => {
      const now = Date.now();
      const delta = now - lastTickRef.current;
      if (delta >= 1000) {
        tick();
        lastTickRef.current = now;
      }
    }, 250);

    return () => clearInterval(interval);
  }, [hasGame, isPaused, isComplete, tick]);
}
