'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/stats', label: 'Stats', icon: '📊' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 bg-cream-light/90 backdrop-blur-md border-t border-cream-dark/30 safe-bottom">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2 px-4">
        {tabs.map(tab => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`
                flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-colors
                ${isActive ? 'text-terracotta' : 'text-brown-light hover:text-brown'}
              `}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-[0.6rem] font-semibold">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
