import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile, Achievement, AchievementId } from '@/types/profile';
import { getLevelForXP } from '@/lib/gamification/levels';
import { createInitialAchievements } from '@/lib/gamification/achievements';

interface ProfileStore {
  profile: UserProfile;
  achievements: Achievement[];

  setName: (name: string) => void;
  completeOnboarding: () => void;
  addXP: (amount: number) => void;
  unlockAchievements: (ids: AchievementId[]) => void;
}

const defaultProfile: UserProfile = {
  name: '',
  createdAt: Date.now(),
  totalXP: 0,
  currentLevel: 1,
  currentTitle: 'Sudoku Seedling',
  isOnboarded: false,
};

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      profile: defaultProfile,
      achievements: createInitialAchievements(),

      setName: (name) => {
        set({ profile: { ...get().profile, name } });
      },

      completeOnboarding: () => {
        set({ profile: { ...get().profile, isOnboarded: true, createdAt: Date.now() } });
      },

      addXP: (amount) => {
        const { profile } = get();
        const newTotalXP = profile.totalXP + amount;
        const level = getLevelForXP(newTotalXP);
        set({
          profile: {
            ...profile,
            totalXP: newTotalXP,
            currentLevel: level.level,
            currentTitle: level.title,
          },
        });
      },

      unlockAchievements: (ids) => {
        const { achievements } = get();
        const now = Date.now();
        const updated = achievements.map(a =>
          ids.includes(a.id) && !a.unlockedAt ? { ...a, unlockedAt: now } : a
        );
        set({ achievements: updated });
      },
    }),
    {
      name: 'soduken-profile',
    }
  )
);
