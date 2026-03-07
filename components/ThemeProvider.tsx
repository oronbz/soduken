'use client';

import { useEffect } from 'react';
import { useProfileStore } from '@/stores/profileStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useProfileStore(s => s.profile.theme ?? 'system');

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const apply = () => {
      const isDark = theme === 'dark' || (theme === 'system' && mediaQuery.matches);
      root.classList.toggle('dark', isDark);

      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) {
        meta.setAttribute('content', isDark ? '#0C1521' : '#FBF7EE');
      }
    };

    apply();

    if (theme === 'system') {
      mediaQuery.addEventListener('change', apply);
      return () => mediaQuery.removeEventListener('change', apply);
    }
  }, [theme]);

  return <>{children}</>;
}
