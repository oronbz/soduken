'use client';
import { LevelProgress } from '@/components/profile/LevelProgress';
import { AchievementGrid } from '@/components/profile/AchievementGrid';
import { StatsSummary } from '@/components/stats/StatsSummary';
import { StreakCalendar } from '@/components/stats/StreakCalendar';
import { BottomNav } from '@/components/ui/BottomNav';

export default function StatsPage() {
  return (
    <div className="px-5 pt-8 pb-28">
      <h1 className="font-display text-2xl font-bold text-brown-dark mb-6">Your Progress</h1>

      <div className="space-y-5">
        <LevelProgress />
        <StatsSummary />
        <StreakCalendar />
        <AchievementGrid />
      </div>

      <BottomNav />
    </div>
  );
}
