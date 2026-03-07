'use client';
import { useProfileStore } from '@/stores/profileStore';
import { getGreeting, getGreetingEmoji } from '@/lib/time';

export function Greeting() {
  const name = useProfileStore(s => s.profile.name);
  const title = useProfileStore(s => s.profile.currentTitle);

  return (
    <div className="mb-6">
      <p className="text-sm text-brown-light mb-1">
        {getGreetingEmoji()} {getGreeting()}, {name || 'friend'}
      </p>
      <h1 className="font-display text-3xl font-bold text-brown-dark tracking-tight">
        Soduken
      </h1>
      <p className="text-xs text-brown-light/70 mt-0.5">{title}</p>
    </div>
  );
}
