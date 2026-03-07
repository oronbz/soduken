'use client';
import { Cell } from './Cell';

export function Board() {
  return (
    <div className="w-full max-w-[min(100vw-2rem,420px)] mx-auto aspect-square">
      <div
        className="grid grid-cols-9 grid-rows-9 gap-0 w-full h-full rounded-xl overflow-hidden border-2 border-brown/50"
        style={{ boxShadow: 'var(--shadow-warm-md)' }}
      >
        {Array.from({ length: 81 }, (_, i) => {
          const row = Math.floor(i / 9);
          const col = i % 9;

          const borderClasses = [
            col % 3 === 0 && col !== 0 ? 'border-l-2 border-l-brown/45' : col !== 0 ? 'border-l border-l-brown/20' : '',
            row % 3 === 0 && row !== 0 ? 'border-t-2 border-t-brown/45' : row !== 0 ? 'border-t border-t-brown/20' : '',
          ].join(' ');

          return (
            <div key={i} className={`${borderClasses} w-full h-full`}>
              <Cell index={i} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
