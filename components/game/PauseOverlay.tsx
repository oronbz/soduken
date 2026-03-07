'use client';
import { useGameStore } from '@/stores/gameStore';
import { formatTime } from '@/lib/time';

export function PauseOverlay() {
  const isPaused = useGameStore(s => s.game?.isPaused ?? false);
  const togglePause = useGameStore(s => s.togglePause);
  const elapsedSeconds = useGameStore(s => s.game?.elapsedSeconds ?? 0);

  if (!isPaused) return null;

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-cream-light/95 backdrop-blur-sm rounded-xl">
      <div className="text-center">
        <div className="text-5xl mb-4">☕</div>
        <p className="font-display text-xl text-brown mb-1">Taking a break</p>
        <p className="text-brown-light text-sm mb-6">{formatTime(elapsedSeconds)} elapsed</p>
        <button
          onClick={togglePause}
          className="px-8 py-3 bg-terracotta text-cream-light rounded-xl font-semibold
                     shadow-[var(--shadow-warm-md)] hover:bg-terracotta-dark transition-colors"
        >
          Resume
        </button>
      </div>
    </div>
  );
}
