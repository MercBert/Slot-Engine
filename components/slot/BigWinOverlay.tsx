'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Props {
  show: boolean;
  totalWin: number;
  betAmount: number;
  onDismiss: () => void;
}

type WinTier = 'BIG' | 'MEGA' | 'LEGENDARY';

interface ParticleData {
  id: string;
  /** Angle in radians – direction from centre */
  angle: number;
  /** Distance to travel (px) */
  distance: number;
  /** Stagger delay in seconds */
  delay: number;
  /** Diameter in pixels */
  size: number;
  /** Rotation (degrees) for visual variety */
  rotation: number;
  /** Which emoji/shape to render */
  variant: 'coin' | 'star' | 'sparkle';
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getWinTier(totalWin: number, betAmount: number): WinTier {
  const multiplier = betAmount > 0 ? totalWin / betAmount : 0;
  if (multiplier >= 100) return 'LEGENDARY';
  if (multiplier >= 50) return 'MEGA';
  return 'BIG';
}

function tierLabel(tier: WinTier): string {
  switch (tier) {
    case 'LEGENDARY':
      return 'LEGENDARY WIN!';
    case 'MEGA':
      return 'MEGA WIN!';
    case 'BIG':
    default:
      return 'BIG WIN!';
  }
}

function tierLabelClass(tier: WinTier): string {
  switch (tier) {
    case 'LEGENDARY':
      return 'bg-gradient-to-r from-red-400 via-yellow-300 via-green-400 via-blue-400 to-purple-500 bg-clip-text text-transparent';
    case 'MEGA':
      return 'bg-gradient-to-r from-purple-400 via-fuchsia-300 to-purple-400 bg-clip-text text-transparent';
    case 'BIG':
    default:
      return 'bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent';
  }
}

function tierGlow(tier: WinTier): string {
  switch (tier) {
    case 'LEGENDARY':
      return '0 0 40px rgba(168,85,247,0.6), 0 0 80px rgba(251,191,36,0.4)';
    case 'MEGA':
      return '0 0 30px rgba(192,38,211,0.5), 0 0 60px rgba(168,85,247,0.3)';
    case 'BIG':
    default:
      return '0 0 30px rgba(251,191,36,0.5), 0 0 60px rgba(245,158,11,0.3)';
  }
}

const PARTICLE_VARIANTS = ['coin', 'star', 'sparkle'] as const;

function particleEmoji(variant: ParticleData['variant']): string {
  switch (variant) {
    case 'coin':
      return '🪙';
    case 'star':
      return '⭐';
    case 'sparkle':
      return '✨';
  }
}

function generateParticles(count: number): ParticleData[] {
  const particles: ParticleData[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
    particles.push({
      id: `bw-p-${i}`,
      angle,
      distance: 120 + Math.random() * 200,
      delay: Math.random() * 0.3,
      size: 16 + Math.random() * 16,
      rotation: Math.random() * 360,
      variant: PARTICLE_VARIANTS[Math.floor(Math.random() * PARTICLE_VARIANTS.length)],
    });
  }
  return particles;
}

/* ------------------------------------------------------------------ */
/*  Count-up hook (rAF, ease-out cubic) — mirrors WinDisplay pattern   */
/* ------------------------------------------------------------------ */

function useCountUp(target: number, active: boolean) {
  const [displayed, setDisplayed] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    if (!active || target <= 0) {
      prevRef.current = 0;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional count-up reset; subsequent updates run in rAF
      setDisplayed(0);
      return;
    }

    const from = prevRef.current;
    const to = target;
    prevRef.current = to;

    if (from === to) {
      setDisplayed(to);
      return;
    }

    const duration = 1200; // ms — slower for big win drama
    const start = performance.now();
    let frameId: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(from + (to - from) * eased);
      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [target, active]);

  return displayed;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function BigWinOverlay({ show, totalWin, betAmount, onDismiss }: Props) {
  /* --- auto-dismiss timer ------------------------------------------ */
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (show) {
      timerRef.current = setTimeout(onDismiss, 4000);
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }
  }, [show, onDismiss]);

  /* --- dismiss handler (click/tap) --------------------------------- */
  const handleDismiss = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    onDismiss();
  }, [onDismiss]);

  /* --- win tier ----------------------------------------------------- */
  const tier = getWinTier(totalWin, betAmount);

  /* --- particles (memoised per show toggle) ------------------------- */
  const particles = useMemo<ParticleData[]>(
    () => (show ? generateParticles(40) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [show],
  );

  /* --- count-up animation ------------------------------------------ */
  const animatedAmount = useCountUp(totalWin, show);

  /* --- render ------------------------------------------------------- */
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="big-win-overlay"
          className="absolute inset-0 z-50 flex items-center justify-center cursor-pointer"
          onClick={handleDismiss}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Particle burst */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((p) => {
              const dx = Math.cos(p.angle) * p.distance;
              const dy = Math.sin(p.angle) * p.distance;
              return (
                <motion.div
                  key={p.id}
                  className="absolute left-1/2 top-1/2"
                  style={{
                    fontSize: p.size,
                    marginLeft: -p.size / 2,
                    marginTop: -p.size / 2,
                  }}
                  initial={{
                    scale: 0,
                    opacity: 1,
                    x: 0,
                    y: 0,
                    rotate: 0,
                  }}
                  animate={{
                    scale: [0, 1.4, 0.6],
                    opacity: [1, 1, 0],
                    x: dx,
                    y: dy,
                    rotate: p.rotation,
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{
                    duration: 1.0,
                    delay: p.delay,
                    ease: 'easeOut',
                  }}
                >
                  {particleEmoji(p.variant)}
                </motion.div>
              );
            })}
          </div>

          {/* Central content */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-3 px-8 py-6 select-none"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
              opacity: { duration: 0.3 },
            }}
          >
            {/* Glow ring behind text */}
            <div
              className="absolute inset-0 rounded-3xl"
              style={{ boxShadow: tierGlow(tier) }}
            />

            {/* Tier label */}
            <motion.h2
              className={`text-5xl sm:text-6xl font-black tracking-tight drop-shadow-lg ${tierLabelClass(tier)}`}
              animate={{
                scale: [1, 1.08, 1],
                rotate: [0, 1.5, -1.5, 0],
              }}
              transition={{
                scale: { repeat: Infinity, duration: 0.7, ease: 'easeInOut' },
                rotate: { repeat: Infinity, duration: 0.5, ease: 'easeInOut' },
              }}
            >
              {tierLabel(tier)}
            </motion.h2>

            {/* Win amount (count-up) */}
            <motion.p
              className="text-4xl sm:text-5xl font-bold tabular-nums text-white drop-shadow-lg"
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            >
              ${animatedAmount.toFixed(2)}
            </motion.p>

            {/* Multiplier badge */}
            <motion.span
              className="text-sm font-semibold text-white/60 tracking-wide uppercase"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {betAmount > 0 ? `${(totalWin / betAmount).toFixed(0)}x your bet` : ''}
            </motion.span>

            {/* Tap to dismiss hint */}
            <motion.span
              className="text-xs text-white/40 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              Tap to dismiss
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
