'use client';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGameStore } from '@/stores/gameStore';
import { useTimer } from '@/hooks/useTimer';
import { useKeyboard } from '@/hooks/useKeyboard';
import { useSounds } from '@/hooks/useSounds';
import { Board } from '@/components/board/Board';
import { NumberPad } from '@/components/controls/NumberPad';
import { ActionBar } from '@/components/controls/ActionBar';
import { GameHeader } from '@/components/game/GameHeader';
import { PauseOverlay } from '@/components/game/PauseOverlay';
import { GameComplete } from '@/components/game/GameComplete';
import type { Difficulty } from '@/types/game';
import { Suspense } from 'react';

function PlayContent() {
  const searchParams = useSearchParams();
  const game = useGameStore(s => s.game);
  const startNewGame = useGameStore(s => s.startNewGame);

  useTimer();
  useKeyboard();
  useSounds();

  useEffect(() => {
    if (!game) {
      const difficulty = (searchParams.get('difficulty') as Difficulty) || 'easy';
      startNewGame(difficulty);
    }
  }, [game, searchParams, startNewGame]);

  if (!game) {
    return (
      <div className="flex items-center justify-center h-dvh">
        <div className="text-brown-light animate-pulse">Generating puzzle...</div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-dvh px-4 pt-3 safe-bottom overflow-hidden">
      <GameHeader />
      <div className="flex-1 flex flex-col items-center justify-center min-h-0">
        <div className="relative w-full">
          <Board />
          <PauseOverlay />
        </div>
        <div className="w-full mt-3">
          <NumberPad />
        </div>
      </div>
      <div className="flex flex-col items-center pb-2 pt-3 shrink-0">
        <ActionBar />
      </div>
      <GameComplete />
    </div>
  );
}

export default function PlayPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-dvh">
        <div className="text-brown-light animate-pulse">Loading...</div>
      </div>
    }>
      <PlayContent />
    </Suspense>
  );
}
