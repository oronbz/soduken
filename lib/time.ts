export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return 'Sweet dreams';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Sweet dreams';
}

export function getGreetingEmoji(): string {
  const hour = new Date().getHours();
  if (hour < 6) return '🌙';
  if (hour < 12) return '☀️';
  if (hour < 17) return '🌤️';
  if (hour < 21) return '🌅';
  return '🌙';
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}
