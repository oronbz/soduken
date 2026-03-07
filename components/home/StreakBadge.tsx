'use client';
import { useStatsStore } from '@/stores/statsStore';

export function StreakBadge() {
  const streak = useStatsStore(s => s.stats.streak.currentStreak);

  if (streak === 0) return null;

  return (
    <div className="inline-flex items-center gap-1.5 bg-terracotta/10 text-terracotta-dark px-3 py-1.5 rounded-full">
      <span className="text-sm">🔥</span>
      <span className="text-xs font-bold">{streak} day{streak !== 1 ? 's' : ''}</span>
    </div>
  );
}
