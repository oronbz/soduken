import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile, Achievement, AchievementId, ThemePreference } from '@/types/profile';
import { getLevelForXP } from '@/lib/gamification/levels';
import { createInitialAchievements } from '@/lib/gamification/achievements';

interface ProfileStore {
  profile: UserProfile;
  achievements: Achievement[];

  setName: (name: string) => void;
  completeOnboarding: () => void;
  addXP: (amount: number) => void;
  unlockAchievements: (ids: AchievementId[]) => void;
  toggleSound: () => void;
  setTheme: (theme: ThemePreference) => void;
}

const defaultProfile: UserProfile = {
  name: '',
  createdAt: Date.now(),
  totalXP: 0,
  currentLevel: 1,
  currentTitle: 'Sudoku Seedling',
  isOnboarded: false,
  soundEnabled: true,
  theme: 'system',
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

      toggleSound: () => {
        const { profile } = get();
        set({ profile: { ...profile, soundEnabled: !profile.soundEnabled } });
      },

      setTheme: (theme) => {
        const { profile } = get();
        set({ profile: { ...profile, theme } });
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
      merge: (persisted, current) => {
        const p = persisted as Partial<ProfileStore>;
        return {
          ...current,
          profile: { ...defaultProfile, ...p.profile },
          achievements: p.achievements ?? current.achievements,
        };
      },
    }
  )
);
