'use client';
import { useProfileStore } from '@/stores/profileStore';
import { getXPProgress } from '@/lib/gamification/levels';

export function LevelProgress() {
  const profile = useProfileStore(s => s.profile);
  const progress = getXPProgress(profile.totalXP);

  return (
    <div className="bg-cream rounded-2xl p-4 shadow-[var(--shadow-warm)]">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-xs text-brown-light">Level {profile.currentLevel}</p>
          <p className="font-display text-sm font-bold text-brown-dark">{profile.currentTitle}</p>
        </div>
        <p className="text-lg font-bold text-terracotta">{profile.totalXP} XP</p>
      </div>
      <div className="h-2.5 bg-cream-dark/50 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-terracotta to-terracotta-light rounded-full transition-all duration-500"
          style={{ width: `${progress.percentage}%` }}
        />
      </div>
      {progress.needed > 0 && (
        <p className="text-[0.65rem] text-brown-light mt-1.5">
          {progress.current} / {progress.needed} XP to next level
        </p>
      )}
    </div>
  );
}
