'use client';
import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

/**
 * Returns false on server and first client render, true after hydration.
 * Prevents acting on Zustand default state before localStorage loads.
 */
export function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
