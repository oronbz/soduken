'use client';
import { useStatsStore } from '@/stores/statsStore';
import { formatTime } from '@/lib/time';
import type { Difficulty } from '@/types/game';

const difficultyLabels: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  expert: 'Expert',
};

export function StatsSummary() {
  const stats = useStatsStore(s => s.stats);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <StatBox label="Played" value={stats.overall.totalGamesPlayed.toString()} />
        <StatBox label="Won" value={stats.overall.totalGamesWon.toString()} />
        <StatBox
          label="Streak"
          value={`${stats.streak.currentStreak}`}
          sub={`Best: ${stats.streak.longestStreak}`}
        />
      </div>

      <div>
        <h4 className="text-xs font-semibold text-brown-light mb-2">Best Times</h4>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(difficultyLabels) as Difficulty[]).map(d => {
            const ds = stats.byDifficulty[d];
            return (
              <div key={d} className="bg-cream rounded-xl px-3 py-2.5 shadow-[var(--shadow-warm)]">
                <p className="text-[0.65rem] text-brown-light">{difficultyLabels[d]}</p>
                <p className="font-semibold text-sm text-brown-dark">
                  {ds.bestTimeSeconds !== null ? formatTime(ds.bestTimeSeconds) : '—'}
                </p>
                <p className="text-[0.6rem] text-brown-light">
                  {ds.gamesWon > 0 ? `${ds.gamesWon} win${ds.gamesWon !== 1 ? 's' : ''}` : 'Not played'}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-cream rounded-xl px-3 py-3 text-center shadow-[var(--shadow-warm)]">
      <p className="text-xl font-bold text-brown-dark">{value}</p>
      <p className="text-[0.65rem] text-brown-light">{label}</p>
      {sub && <p className="text-[0.55rem] text-brown-light/60 mt-0.5">{sub}</p>}
    </div>
  );
}
