'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProfileStore } from '@/stores/profileStore';
import { useStatsStore } from '@/stores/statsStore';
import { useHydrated } from '@/hooks/useHydrated';
import { Greeting } from '@/components/home/Greeting';
import { StreakBadge } from '@/components/home/StreakBadge';
import { ContinueCard } from '@/components/home/ContinueCard';
import { DailyCard } from '@/components/home/DailyCard';
import { NewGameCard } from '@/components/home/NewGameCard';
import { LevelProgress } from '@/components/profile/LevelProgress';
import { BottomNav } from '@/components/ui/BottomNav';

export default function HomePage() {
  const isOnboarded = useProfileStore(s => s.profile.isOnboarded);
  const updateStreak = useStatsStore(s => s.updateStreak);
  const router = useRouter();
  const hydrated = useHydrated();

  useEffect(() => {
    if (hydrated && !isOnboarded) {
      router.replace('/onboarding');
    }
  }, [hydrated, isOnboarded, router]);

  useEffect(() => {
    updateStreak();
  }, [updateStreak]);

  if (!hydrated || !isOnboarded) return null;

  return (
    <div className="px-5 pt-8 pb-28">
      <div className="flex items-start justify-between">
        <Greeting />
        <StreakBadge />
      </div>

      <div className="space-y-4">
        <ContinueCard />
        <DailyCard />
        <LevelProgress />
        <NewGameCard />
      </div>

      <BottomNav />
    </div>
  );
}
