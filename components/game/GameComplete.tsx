'use client';
import { useEffect, useState } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { useProfileStore } from '@/stores/profileStore';
import { useStatsStore } from '@/stores/statsStore';
import { calculateXP } from '@/lib/gamification/xp';
import { checkAchievements } from '@/lib/gamification/achievements';
import { formatTime } from '@/lib/time';
import { getXPProgress } from '@/lib/gamification/levels';
import Link from 'next/link';

function Confetti() {
  const colors = ['#C4714A', '#8FAF8A', '#6B4C3B', '#D4906E', '#A8C4A3', '#F5ECD7'];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-40">
      {Array.from({ length: 40 }, (_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: colors[i % colors.length],
            left: `${Math.random() * 100}%`,
            top: '-10px',
            animation: `confettiFall ${2 + Math.random() * 2}s ${Math.random() * 0.5}s linear forwards`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  );
}

export function GameComplete() {
  const game = useGameStore(s => s.game);
  const clearGame = useGameStore(s => s.clearGame);
  const addXP = useProfileStore(s => s.addXP);
  const unlockAchievements = useProfileStore(s => s.unlockAchievements);
  const profile = useProfileStore(s => s.profile);
  const achievements = useProfileStore(s => s.achievements);
  const recordGameComplete = useStatsStore(s => s.recordGameComplete);
  const stats = useStatsStore(s => s.stats);
  const [processed, setProcessed] = useState(false);
  const [xpResult, setXpResult] = useState<ReturnType<typeof calculateXP> | null>(null);
  const [newAchievements, setNewAchievements] = useState<string[]>([]);

  useEffect(() => {
    if (!game?.isComplete || processed) return;

    const xp = calculateXP({
      difficulty: game.difficulty,
      hintsUsed: game.hintsUsed,
      errorsCount: game.errorsCount,
      elapsedSeconds: game.elapsedSeconds,
      isDaily: game.isDaily,
    });

    recordGameComplete(game);
    addXP(xp.total);

    const updatedStats = useStatsStore.getState().stats;
    const updatedProfile = useProfileStore.getState().profile;
    const unlocked = checkAchievements(game, updatedStats, updatedProfile.currentLevel, achievements);

    if (unlocked.length > 0) {
      unlockAchievements(unlocked);
      const defs = achievements.filter(a => unlocked.includes(a.id));
      setNewAchievements(defs.map(a => `${a.icon} ${a.name}`));
    }

    setXpResult(xp);
    setProcessed(true);
  }, [game?.isComplete, processed, game, addXP, unlockAchievements, achievements, recordGameComplete, stats, profile]);

  if (!game?.isComplete) return null;

  const progress = getXPProgress(profile.totalXP);

  return (
    <>
      <Confetti />
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-brown-dark/30 backdrop-blur-sm">
        <div className="bg-cream-light rounded-2xl p-6 mx-4 max-w-sm w-full shadow-[var(--shadow-warm-lg)] text-center">
          <div className="text-4xl mb-2">🎉</div>
          <h2 className="font-display text-2xl text-brown-dark mb-1">Wonderful!</h2>
          <p className="text-brown-light text-sm mb-4">
            You solved it in {formatTime(game.elapsedSeconds)}
          </p>

          {xpResult && (
            <div className="bg-cream rounded-xl p-4 mb-4 text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-brown">XP Earned</span>
                <span className="text-lg font-bold text-terracotta">+{xpResult.total}</span>
              </div>
              <div className="space-y-1 text-xs text-brown-light">
                {xpResult.breakdown.base > 0 && <div className="flex justify-between"><span>Base</span><span>+{xpResult.breakdown.base}</span></div>}
                {xpResult.breakdown.noHints > 0 && <div className="flex justify-between"><span>No hints bonus</span><span>+{xpResult.breakdown.noHints}</span></div>}
                {xpResult.breakdown.noErrors > 0 && <div className="flex justify-between"><span>Flawless bonus</span><span>+{xpResult.breakdown.noErrors}</span></div>}
                {xpResult.breakdown.speed > 0 && <div className="flex justify-between"><span>Speed bonus</span><span>+{xpResult.breakdown.speed}</span></div>}
                {xpResult.breakdown.daily > 0 && <div className="flex justify-between"><span>Daily bonus</span><span>+{xpResult.breakdown.daily}</span></div>}
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-brown font-medium">{profile.currentTitle}</span>
                  <span className="text-brown-light">{progress.percentage}%</span>
                </div>
                <div className="h-2 bg-cream-dark rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-terracotta to-terracotta-light rounded-full transition-all duration-1000"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {newAchievements.length > 0 && (
            <div className="bg-sage/10 rounded-xl p-3 mb-4">
              <p className="text-xs font-semibold text-sage-dark mb-1">New Achievements!</p>
              {newAchievements.map((a, i) => (
                <p key={i} className="text-sm text-brown">{a}</p>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Link
              href="/"
              onClick={() => clearGame()}
              className="flex-1 py-3 rounded-xl bg-cream text-brown font-semibold
                         hover:bg-cream-dark/50 transition-colors text-sm"
            >
              Home
            </Link>
            <Link
              href="/"
              onClick={() => clearGame()}
              className="flex-1 py-3 rounded-xl bg-terracotta text-cream-light font-semibold
                         shadow-[var(--shadow-warm)] hover:bg-terracotta-dark transition-colors text-sm"
            >
              New Game
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
