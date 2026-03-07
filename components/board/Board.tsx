'use client';
import { Cell } from './Cell';

export function Board() {
  return (
    <div className="w-full max-w-[min(100vw-2rem,420px)] mx-auto aspect-square">
      <div
        className="grid grid-cols-9 grid-rows-9 gap-0 w-full h-full rounded-xl overflow-hidden border-2 border-brown/30"
        style={{ boxShadow: 'var(--shadow-warm-md)' }}
      >
        {Array.from({ length: 81 }, (_, i) => {
          const row = Math.floor(i / 9);
          const col = i % 9;

          const borderClasses = [
            col % 3 === 0 && col !== 0 ? 'border-l-2 border-l-brown/25' : col !== 0 ? 'border-l border-l-brown/10' : '',
            row % 3 === 0 && row !== 0 ? 'border-t-2 border-t-brown/25' : row !== 0 ? 'border-t border-t-brown/10' : '',
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
