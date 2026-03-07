'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/stores/gameStore';
import type { Difficulty } from '@/types/game';

const difficulties: { value: Difficulty; label: string; desc: string; color: string }[] = [
  { value: 'easy', label: 'Easy', desc: 'Relax & unwind', color: 'bg-sage/15 text-sage-dark hover:bg-sage/25 border-sage/30' },
  { value: 'medium', label: 'Medium', desc: 'A gentle challenge', color: 'bg-terracotta/8 text-terracotta hover:bg-terracotta/15 border-terracotta/20' },
  { value: 'hard', label: 'Hard', desc: 'Test your logic', color: 'bg-terracotta/15 text-terracotta-dark hover:bg-terracotta/25 border-terracotta/30' },
  { value: 'expert', label: 'Expert', desc: 'For the brave', color: 'bg-brown/10 text-brown-dark hover:bg-brown/20 border-brown/20' },
];

export function NewGameCard() {
  const [showPicker, setShowPicker] = useState(false);
  const router = useRouter();
  const clearGame = useGameStore(s => s.clearGame);
  const startNewGame = useGameStore(s => s.startNewGame);

  const handleStart = (difficulty: Difficulty) => {
    clearGame();
    startNewGame(difficulty);
    router.push('/play');
  };

  return (
    <div className="mt-4">
      {!showPicker ? (
        <button
          onClick={() => setShowPicker(true)}
          className="w-full py-4 rounded-2xl bg-cream text-brown-dark font-semibold text-sm
                     shadow-[var(--shadow-warm-md)] hover:shadow-[var(--shadow-warm-lg)]
                     transition-shadow border border-cream-dark/30"
        >
          ✦ New Game
        </button>
      ) : (
        <div className="bg-cream rounded-2xl p-4 shadow-[var(--shadow-warm-md)] border border-cream-dark/30">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-brown">Choose difficulty</p>
            <button
              onClick={() => setShowPicker(false)}
              className="text-brown-light text-xs hover:text-brown"
            >
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {difficulties.map(d => (
              <button
                key={d.value}
                onClick={() => handleStart(d.value)}
                className={`
                  py-3 px-3 rounded-xl text-left transition-colors border
                  ${d.color}
                `}
              >
                <p className="font-semibold text-sm">{d.label}</p>
                <p className="text-[0.65rem] opacity-70">{d.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
