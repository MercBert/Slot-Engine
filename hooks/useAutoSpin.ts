'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseAutoSpinArgs {
  spin: () => void;
  isSpinning: boolean;
  balance: number;
  betAmount: number;
  /** When true, auto-spin waits instead of chaining the next spin */
  paused?: boolean;
}

interface UseAutoSpinReturn {
  autoSpinning: boolean;
  autoSpinCount: number;
  remainingSpins: number;
  startAutoSpin: (count: number) => void;
  stopAutoSpin: () => void;
}

export const AUTO_SPIN_OPTIONS = [10, 25, 50, 100] as const;

export function useAutoSpin({
  spin,
  isSpinning,
  balance,
  betAmount,
  paused = false,
}: UseAutoSpinArgs): UseAutoSpinReturn {
  const [autoSpinning, setAutoSpinning] = useState(false);
  const [autoSpinCount, setAutoSpinCount] = useState(0);
  const [remainingSpins, setRemainingSpins] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopAutoSpin = useCallback(() => {
    setAutoSpinning(false);
    setAutoSpinCount(0);
    setRemainingSpins(0);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const startAutoSpin = useCallback(
    (count: number) => {
      setAutoSpinning(true);
      setAutoSpinCount(count);
      setRemainingSpins(count);
      // Kick off the first spin immediately
      spin();
    },
    [spin],
  );

  // Chain spins: when a spin finishes and auto-spin is active, queue the next
  useEffect(() => {
    if (!autoSpinning) return;
    // Only act when spinning just finished (isSpinning went false)
    if (isSpinning) return;
    // Wait while paused (e.g. big win overlay showing)
    if (paused) return;

    // Check stop conditions
    if (remainingSpins <= 1 || balance < betAmount) {
      stopAutoSpin();
      return;
    }

    // Wait 500ms then fire the next spin
    timeoutRef.current = setTimeout(() => {
      setRemainingSpins((prev) => prev - 1);
      spin();
    }, 500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isSpinning, autoSpinning, paused, remainingSpins, balance, betAmount, spin, stopAutoSpin]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    autoSpinning,
    autoSpinCount,
    remainingSpins,
    startAutoSpin,
    stopAutoSpin,
  };
}
