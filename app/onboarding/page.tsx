'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfileStore } from '@/stores/profileStore';

export default function OnboardingPage() {
  const [name, setName] = useState('');
  const setProfileName = useProfileStore(s => s.setName);
  const completeOnboarding = useProfileStore(s => s.completeOnboarding);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setProfileName(name.trim());
    completeOnboarding();
    router.replace('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-8">
      <div className="text-center mb-10">
        <div className="text-6xl mb-4">🍵</div>
        <h1 className="font-display text-4xl font-bold text-brown-dark tracking-tight mb-2">
          Soduken
        </h1>
        <p className="text-brown-light text-sm">
          A cozy place for puzzles
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <label className="block text-sm font-medium text-brown mb-2">
          What should I call you?
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          autoFocus
          className="w-full px-4 py-3 rounded-xl bg-cream border border-cream-dark/40
                     text-brown-dark placeholder:text-brown-light/40
                     focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta/40
                     shadow-[var(--shadow-warm)] text-center text-lg font-medium"
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full mt-4 py-3.5 rounded-xl bg-terracotta text-cream-light font-semibold
                     shadow-[var(--shadow-warm-md)] hover:bg-terracotta-dark transition-colors
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Let&apos;s play!
        </button>
      </form>
    </div>
  );
}
