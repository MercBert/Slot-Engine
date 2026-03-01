'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cluster, SlotState } from '@/types';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ParticleData {
  id: string;
  /** CSS left % */
  x: number;
  /** CSS top % */
  y: number;
  /** Pixel offset – random outward drift */
  dx: number;
  dy: number;
  /** Stagger delay in seconds */
  delay: number;
  /** Diameter in pixels */
  size: number;
}

interface Props {
  clusters: Cluster[];
  state: SlotState;
  rows: number;
  cols: number;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * Lightweight DOM-based sparkle overlay.
 *
 * Absolutely-positioned over the grid (use `position: relative` on the
 * parent wrapper). Spawns 3-4 small amber/gold particles per cluster
 * cell while state === 'RESOLVING'.
 */
export function ClusterParticles({ clusters, state, rows, cols }: Props) {
  const [particles, setParticles] = useState<ParticleData[]>([]);

  const isResolving = state === 'RESOLVING';

  useEffect(() => {
    if (!isResolving || clusters.length === 0) {
      setParticles([]);
      return;
    }

    const next: ParticleData[] = [];
    let id = 0;

    for (const cluster of clusters) {
      for (const cell of cluster.cells) {
        // Centre of the cell as a percentage of the grid area
        const cx = ((cell.col + 0.5) / cols) * 100;
        const cy = ((cell.row + 0.5) / rows) * 100;

        // 5-7 sparkles per cell for more visual punch
        const count = 5 + Math.floor(Math.random() * 3);

        for (let i = 0; i < count; i++) {
          next.push({
            id: `sp-${id++}`,
            // Jitter around the cell centre
            x: cx + (Math.random() - 0.5) * (100 / cols) * 0.8,
            y: cy + (Math.random() - 0.5) * (100 / rows) * 0.8,
            // Wider outward drift with upward bias
            dx: (Math.random() - 0.5) * 50,
            dy: (Math.random() - 0.5) * 40 - 15,
            delay: Math.random() * 0.2,
            size: 6 + Math.random() * 6, // 6-12 px
          });
        }
      }
    }

    setParticles(next);
  }, [isResolving, clusters, rows, cols]);

  return (
    <div className="absolute inset-2 overflow-hidden pointer-events-none z-20">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              background:
                'radial-gradient(circle, rgba(255,220,80,1) 0%, rgba(251,191,36,0.9) 40%, rgba(245,158,11,0) 100%)',
              boxShadow: '0 0 10px 4px rgba(251,191,36,0.6)',
            }}
            initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
            animate={{
              scale: [0, 2, 0.8],
              opacity: [1, 1, 0],
              x: p.dx,
              y: p.dy,
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              duration: 0.65,
              delay: p.delay,
              ease: 'easeOut',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
