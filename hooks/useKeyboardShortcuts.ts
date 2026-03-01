'use client';

import { useEffect } from 'react';

interface UseKeyboardShortcutsArgs {
  onSpin: () => void;
  onBetUp: () => void;
  onBetDown: () => void;
  enabled: boolean;
}

export function useKeyboardShortcuts({
  onSpin,
  onBetUp,
  onBetDown,
  enabled,
}: UseKeyboardShortcutsArgs): void {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when user is typing in an input / textarea
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      switch (e.key) {
        case ' ':
        case 'Enter':
          e.preventDefault(); // Prevent space from scrolling the page
          onSpin();
          break;
        case 'ArrowUp':
        case '+':
        case '=':
          e.preventDefault();
          onBetUp();
          break;
        case 'ArrowDown':
        case '-':
          e.preventDefault();
          onBetDown();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, onSpin, onBetUp, onBetDown]);
}
