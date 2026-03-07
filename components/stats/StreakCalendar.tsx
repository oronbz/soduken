'use client';
import { useMemo } from 'react';
import { useStatsStore } from '@/stores/statsStore';

export function StreakCalendar() {
  const playedDates = useStatsStore(s => s.stats.streak.playedDates);

  const { weeks, monthLabel } = useMemo(() => {
    const today = new Date();
    const played = new Set(playedDates);
    const days: { date: string; played: boolean; isToday: boolean; dayOfMonth: number }[] = [];

    for (let i = 27; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        played: played.has(dateStr),
        isToday: i === 0,
        dayOfMonth: d.getDate(),
      });
    }

    const weeks: typeof days[] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    const monthLabel = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return { weeks, monthLabel };
  }, [playedDates]);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-brown-light">Activity</h4>
        <span className="text-[0.6rem] text-brown-light/60">{monthLabel}</span>
      </div>
      <div className="flex gap-1.5">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1.5 flex-1">
            {week.map(day => (
              <div
                key={day.date}
                className={`
                  aspect-square rounded-md flex items-center justify-center text-[0.5rem]
                  ${day.played
                    ? 'bg-sage text-cream-light font-bold'
                    : day.isToday
                      ? 'bg-terracotta/15 text-terracotta ring-1 ring-terracotta/30'
                      : 'bg-cream-dark/30 text-brown-light/40'
                  }
                `}
                title={day.date}
              >
                {day.dayOfMonth}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
