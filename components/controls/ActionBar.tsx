'use client';
import { useGameStore } from '@/stores/gameStore';
import { Undo2, PenLine, Lightbulb } from 'lucide-react';
import type { ReactNode } from 'react';

function ActionButton({ onClick, label, icon, isActive }: {
  onClick: () => void;
  label: string;
  icon: ReactNode;
  isActive?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center gap-1 px-5 py-3 rounded-xl transition-all min-w-[4rem]
        ${isActive
          ? 'bg-terracotta/15 text-terracotta-dark'
          : 'text-brown-light hover:bg-cream-dark/40'
        }
      `}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-[0.65rem] font-medium">{label}</span>
    </button>
  );
}

export function ActionBar() {
  const undo = useGameStore(s => s.undo);
  const togglePencilMode = useGameStore(s => s.togglePencilMode);
  const useHint = useGameStore(s => s.useHint);
  const isPencilMode = useGameStore(s => s.game?.isPencilMode ?? false);

  return (
    <div className="flex items-center justify-center gap-2 w-full max-w-[min(100vw-2rem,420px)] mx-auto">
      <ActionButton onClick={undo} label="Undo" icon={<Undo2 size={20} />} />
      <ActionButton onClick={togglePencilMode} label="Notes" icon={<PenLine size={20} />} isActive={isPencilMode} />
      <ActionButton onClick={useHint} label="Hint" icon={<Lightbulb size={20} />} />
    </div>
  );
}
