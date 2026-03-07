'use client';
import { useGameStore } from '@/stores/gameStore';
import { formatTime } from '@/lib/time';
import Link from 'next/link';

const difficultyLabels = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  expert: 'Expert',
};

const difficultyColors = {
  easy: 'bg-sage/20 text-sage-dark',
  medium: 'bg-terracotta/10 text-terracotta',
  hard: 'bg-terracotta/20 text-terracotta-dark',
  expert: 'bg-brown/15 text-brown-dark',
};

export function GameHeader() {
  const difficulty = useGameStore(s => s.game?.difficulty ?? 'easy');
  const elapsedSeconds = useGameStore(s => s.game?.elapsedSeconds ?? 0);
  const isPaused = useGameStore(s => s.game?.isPaused ?? false);
  const errorsCount = useGameStore(s => s.game?.errorsCount ?? 0);
  const hintsUsed = useGameStore(s => s.game?.hintsUsed ?? 0);
  const togglePause = useGameStore(s => s.togglePause);

  return (
    <div className="flex items-center justify-between px-1 py-2">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-cream hover:bg-cream-dark/50 transition-colors text-brown"
        >
          ←
        </Link>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${difficultyColors[difficulty]}`}>
          {difficultyLabels[difficulty]}
        </span>
      </div>

      <div className="flex items-center gap-3 text-xs text-brown-light">
        {errorsCount > 0 && (
          <span className="text-error font-medium">
            {errorsCount} {errorsCount === 1 ? 'error' : 'errors'}
          </span>
        )}
        {hintsUsed > 0 && (
          <span className="text-sage-dark font-medium">
            {hintsUsed} {hintsUsed === 1 ? 'hint' : 'hints'}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-mono text-brown tabular-nums tracking-wider">
          {formatTime(elapsedSeconds)}
        </span>
        <button
          onClick={togglePause}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-cream hover:bg-cream-dark/50 transition-colors text-brown text-sm"
        >
          {isPaused ? '▶' : '⏸'}
        </button>
      </div>
    </div>
  );
}
