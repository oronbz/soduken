'use client';
import { useGameStore } from '@/stores/gameStore';

export function NumberPad() {
  const enterNumber = useGameStore(s => s.enterNumber);
  const game = useGameStore(s => s.game);

  const counts: Record<number, number> = {};
  for (let i = 1; i <= 9; i++) counts[i] = 0;
  if (game) {
    for (const cell of game.board) {
      if (cell.value) counts[cell.value]++;
    }
  }

  return (
    <div className="grid grid-cols-5 gap-2 w-full max-w-[min(100vw-2rem,420px)] mx-auto">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => {
        const isComplete = counts[n] >= 9;
        return (
          <button
            key={n}
            onClick={() => !isComplete && enterNumber(n)}
            disabled={isComplete}
            className={`
              numpad-btn relative flex flex-col items-center justify-center
              rounded-xl py-3 font-bold text-3xl transition-all duration-150
              ${isComplete
                ? 'bg-cream-dark/30 text-brown-light/30 cursor-default'
                : 'bg-cream text-brown-dark hover:bg-terracotta/10 active:bg-terracotta/20 shadow-[var(--shadow-warm)]'
              }
            `}
          >
            <span>{n}</span>
            {!isComplete && (
              <span className="text-[0.6rem] text-brown-light/50 mt-0.5">{9 - counts[n]}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
