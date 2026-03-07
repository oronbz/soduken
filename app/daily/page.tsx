'use client';
import { useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { useTimer } from '@/hooks/useTimer';
import { useKeyboard } from '@/hooks/useKeyboard';
import { Board } from '@/components/board/Board';
import { NumberPad } from '@/components/controls/NumberPad';
import { ActionBar } from '@/components/controls/ActionBar';
import { GameHeader } from '@/components/game/GameHeader';
import { PauseOverlay } from '@/components/game/PauseOverlay';
import { GameComplete } from '@/components/game/GameComplete';
import { getDailyPuzzle } from '@/lib/sudoku/dailyPuzzle';

export default function DailyPage() {
  const game = useGameStore(s => s.game);
  const startNewGame = useGameStore(s => s.startNewGame);

  useTimer();
  useKeyboard();

  useEffect(() => {
    if (!game || !game.isDaily) {
      const daily = getDailyPuzzle();
      startNewGame(daily.difficulty, true, daily.date, daily.board, daily.solution);
    }
  }, [game, startNewGame]);

  if (!game) {
    return (
      <div className="flex items-center justify-center h-dvh">
        <div className="text-brown-light animate-pulse">Loading daily puzzle...</div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-dvh px-4 py-3 safe-bottom">
      <GameHeader />
      <div className="flex-1 flex flex-col items-center justify-center gap-4 min-h-0">
        <div className="text-center mb-1">
          <span className="text-xs font-semibold text-terracotta bg-terracotta/10 px-3 py-1 rounded-full">
            Daily Challenge
          </span>
        </div>
        <div className="relative w-full">
          <Board />
          <PauseOverlay />
        </div>
        <ActionBar />
        <NumberPad />
      </div>
      <GameComplete />
    </div>
  );
}
