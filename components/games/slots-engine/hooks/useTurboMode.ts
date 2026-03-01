'use client';

import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'slot-turbo-mode';

interface UseTurboModeReturn {
  turboEnabled: boolean;
  toggleTurbo: () => void;
  speedMultiplier: number;
}

export function useTurboMode(): UseTurboModeReturn {
  const [turboEnabled, setTurboEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === 'true';
    } catch {
      return false;
    }
  });

  // Persist to localStorage whenever turboEnabled changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(turboEnabled));
    } catch {
      // localStorage unavailable — silently ignore
    }
  }, [turboEnabled]);

  const toggleTurbo = useCallback(() => {
    setTurboEnabled((prev) => !prev);
  }, []);

  const speedMultiplier = turboEnabled ? 0.5 : 1.0;

  return {
    turboEnabled,
    toggleTurbo,
    speedMultiplier,
  };
}
