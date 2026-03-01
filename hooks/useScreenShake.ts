'use client';

import { useCallback } from 'react';
import { useAnimationControls } from 'framer-motion';

/**
 * Returns Framer Motion animation controls and a trigger function
 * for applying a screen-shake effect to a motion.div.
 *
 * Attach `shakeControls` to the target element:
 *   <motion.div animate={shakeControls}>...</motion.div>
 *
 * Shake intensity scales with the number of cells removed.
 */
export function useScreenShake() {
  const shakeControls = useAnimationControls();

  const triggerShake = useCallback(
    (cellCount: number) => {
      // Intensity: 1 px base + 0.4 px per cell, capped at 6 px
      const intensity = Math.min(1 + cellCount * 0.4, 6);

      shakeControls.start({
        x: [
          0,
          -intensity,
          intensity,
          -intensity * 0.6,
          intensity * 0.6,
          -intensity * 0.3,
          0,
        ],
        y: [
          0,
          intensity * 0.4,
          -intensity * 0.4,
          intensity * 0.2,
          -intensity * 0.2,
          0,
        ],
        transition: { duration: 0.25, ease: 'easeInOut' },
      });
    },
    [shakeControls],
  );

  return { shakeControls, triggerShake };
}
