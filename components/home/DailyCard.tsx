'use client';
import Link from 'next/link';
import { useStatsStore } from '@/stores/statsStore';
import { getTodayString } from '@/lib/time';

export function DailyCard() {
  const stats = useStatsStore(s => s.stats);
  const today = getTodayString();
  const isCompleted = stats.dailyChallenge.completed.includes(today);
  const todaysBest = stats.dailyChallenge.bestTimes[today];

  const date = new Date();
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  const dayNumber = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'short' });

  return (
    <Link
      href="/daily"
      className={`
        block rounded-2xl p-5 transition-shadow
        ${isCompleted
          ? 'bg-sage/15 shadow-[var(--shadow-warm)]'
          : 'bg-gradient-to-br from-sage/20 to-sage/5 shadow-[var(--shadow-warm-md)] hover:shadow-[var(--shadow-glow-sage)]'
        }
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-sage-dark mb-1">Daily Challenge</p>
          <p className="font-display text-lg font-bold text-brown-dark">{dayName}</p>
          {isCompleted ? (
            <p className="text-xs text-sage-dark mt-1">
              ✓ Completed {todaysBest ? `in ${Math.floor(todaysBest / 60)}m ${todaysBest % 60}s` : ''}
            </p>
          ) : (
            <p className="text-xs text-brown-light mt-1">A new puzzle awaits</p>
          )}
        </div>
        <div className="text-center bg-cream rounded-xl px-3 py-2 shadow-[var(--shadow-warm)]">
          <p className="text-2xl font-display font-bold text-brown-dark leading-none">{dayNumber}</p>
          <p className="text-[0.6rem] text-brown-light uppercase tracking-wider">{month}</p>
        </div>
      </div>
    </Link>
  );
}
