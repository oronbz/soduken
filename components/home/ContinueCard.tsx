'use client';
import Link from 'next/link';
import { useGameStore } from '@/stores/gameStore';
import { formatTime } from '@/lib/time';

const difficultyLabels = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  expert: 'Expert',
};

export function ContinueCard() {
  const game = useGameStore(s => s.game);

  if (!game || game.isComplete) return null;

  const filledCells = game.board.filter(c => c.value !== null).length;
  const progress = Math.floor((filledCells / 81) * 100);

  return (
    <Link
      href={game.isDaily ? '/daily' : '/play'}
      className="block bg-gradient-to-br from-terracotta to-terracotta-dark rounded-2xl p-5 text-cream-light
                 shadow-[var(--shadow-warm-lg)] hover:shadow-[var(--shadow-glow-terracotta)] transition-shadow"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold opacity-80">Continue Playing</span>
        <span className="text-xs opacity-70">{formatTime(game.elapsedSeconds)}</span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="font-display text-xl font-bold">{difficultyLabels[game.difficulty]}</p>
          {game.isDaily && <p className="text-xs opacity-70 mt-0.5">Daily Challenge</p>}
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{progress}%</p>
          <p className="text-xs opacity-70">complete</p>
        </div>
      </div>
      <div className="mt-3 h-1.5 bg-cream-light/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-cream-light/60 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </Link>
  );
}
