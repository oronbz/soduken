'use client';
import { useProfileStore } from '@/stores/profileStore';

export function AchievementGrid() {
  const achievements = useProfileStore(s => s.achievements);
  const unlocked = achievements.filter(a => a.unlockedAt);
  const locked = achievements.filter(a => !a.unlockedAt);

  return (
    <div>
      <h3 className="font-display text-sm font-bold text-brown-dark mb-3">
        Achievements ({unlocked.length}/{achievements.length})
      </h3>
      <div className="grid grid-cols-4 gap-2">
        {[...unlocked, ...locked].map(a => (
          <div
            key={a.id}
            className={`
              flex flex-col items-center gap-1 p-2.5 rounded-xl text-center
              ${a.unlockedAt
                ? 'bg-cream shadow-[var(--shadow-warm)]'
                : 'bg-cream-dark/20 opacity-40'
              }
            `}
            title={a.description}
          >
            <span className="text-xl">{a.icon}</span>
            <span className="text-[0.55rem] leading-tight font-medium text-brown-dark line-clamp-2">{a.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
