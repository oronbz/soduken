'use client';
import { useGameStore } from '@/stores/gameStore';

export function NumberPad() {
  const enterNumber = useGameStore(s => s.enterNumber);
  const erase = useGameStore(s => s.erase);
  const game = useGameStore(s => s.game);

  const counts: Record<number, number> = {};
  for (let i = 1; i <= 9; i++) counts[i] = 0;
  if (game) {
    for (const cell of game.board) {
      if (cell.value) counts[cell.value]++;
    }
  }

  return (
    <div className="grid grid-cols-5 gap-2.5 w-full max-w-[min(100vw-2rem,420px)] mx-auto">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => {
        const isComplete = counts[n] >= 9;
        return (
          <button
            key={n}
            onClick={() => !isComplete && enterNumber(n)}
            disabled={isComplete}
            className={`
              numpad-btn aspect-square rounded-2xl font-display font-bold text-3xl
              flex items-center justify-center select-none
              transition-all duration-150 outline-none
              ${isComplete
                ? 'bg-cream-dark/40 text-brown-light/25 cursor-default shadow-none'
                : `bg-gradient-to-b from-cream to-cream-dark/50
                   text-brown-dark
                   shadow-[0_2px_0_0_var(--color-cream-dark),0_3px_8px_rgba(107,76,59,0.12)]
                   hover:shadow-[0_2px_0_0_var(--color-cream-dark),0_4px_12px_rgba(107,76,59,0.18)]
                   hover:from-cream-light hover:to-cream-dark/40
                   active:shadow-[0_1px_0_0_var(--color-cream-dark),0_1px_4px_rgba(107,76,59,0.08)]
                   active:translate-y-[1px]`
              }
            `}
          >
            {n}
          </button>
        );
      })}
      <button
        onClick={erase}
        className="
          numpad-btn aspect-square rounded-2xl text-2xl
          flex items-center justify-center select-none
          transition-all duration-150 outline-none
          bg-gradient-to-b from-cream-dark/60 to-cream-dark/80
          text-brown-light
          shadow-[0_2px_0_0_var(--color-cream-dark),0_3px_8px_rgba(107,76,59,0.1)]
          hover:shadow-[0_2px_0_0_var(--color-cream-dark),0_4px_12px_rgba(107,76,59,0.16)]
          hover:text-terracotta
          active:shadow-[0_1px_0_0_var(--color-cream-dark),0_1px_4px_rgba(107,76,59,0.06)]
          active:translate-y-[1px]
        "
      >
        ⌫
      </button>
    </div>
  );
}
