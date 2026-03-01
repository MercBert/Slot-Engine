'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Grid, Cluster, SlotState, FallenCellInfo } from './types';
import { SymbolTile } from './SymbolTile';
import { isCellInCluster } from './engine/ClusterDetector';

interface Props {
  grid: Grid;
  activeClusters: Cluster[];
  state: SlotState;
  cascadeNewCellKeys?: string[];
  cascadeFallenCells?: FallenCellInfo[];
}

export function ReelGrid({
  grid,
  activeClusters,
  state,
  cascadeNewCellKeys = [],
  cascadeFallenCells = [],
}: Props) {
  if (grid.length === 0) return null;

  const rows = grid.length;
  const cols = grid[0].length;

  // Build lookup sets for O(1) access
  const newCellSet = useMemo(
    () => new Set(cascadeNewCellKeys),
    [cascadeNewCellKeys],
  );
  const fallenCellMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const f of cascadeFallenCells) {
      map.set(f.key, f.rowsDropped);
    }
    return map;
  }, [cascadeFallenCells]);

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-purple-500/20 p-2 shadow-2xl shadow-purple-900/30">
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {grid.flat().map((cell) => {
          const isInCluster = isCellInCluster(activeClusters, cell.row, cell.col);
          const isLanding = state === 'LANDING';
          const isNewCell = newCellSet.has(cell.key);
          const rowsDropped = fallenCellMap.get(cell.key);
          const isFallenCell = rowsDropped !== undefined && rowsDropped > 0;

          // Determine animation based on cell type
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let initial: any = false;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let animate: any = { y: 0, opacity: 1 };
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let transition: any;

          if (isLanding) {
            // Initial spin landing: drop from above with stagger per column
            initial = { y: -600, opacity: 0 };
            transition = {
              type: 'spring',
              stiffness: 180,
              damping: 20,
              mass: 1.2,
              delay: cell.col * 0.12 + cell.row * 0.03,
            };
          } else if (isNewCell) {
            // New cell from cascade: bounce in from top
            initial = { y: -80, opacity: 0, scale: 0.8 };
            animate = { y: 0, opacity: 1, scale: 1 };
            transition = {
              type: 'spring',
              stiffness: 400,
              damping: 18,
              mass: 0.8,
              delay: cell.col * 0.02,
            };
          } else if (isFallenCell) {
            // Fallen cell: gravity drop from previous position
            const dropDistance = (rowsDropped ?? 1) * 52; // ~52px per row
            initial = { y: -dropDistance };
            animate = { y: 0, opacity: 1 };
            transition = {
              type: 'tween',
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1], // Custom gravity bezier
            };
          } else {
            // Static cell: no animation
            transition = { duration: 0 };
          }

          return (
            <motion.div
              key={cell.key}
              initial={initial}
              animate={animate}
              transition={transition}
            >
              <SymbolTile
                symbolId={cell.symbolId}
                isHighlighted={isInCluster}
                isRemoving={isInCluster && state === 'CASCADING'}
                isLanded={isNewCell || isFallenCell}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
