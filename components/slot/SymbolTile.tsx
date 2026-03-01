'use client';

import { motion } from 'framer-motion';
import { SymbolId } from '@/types';
import { SYMBOL_MAP } from '@/config/symbols';
import { SYMBOL_ICONS } from '@/config/symbol-icons';

interface Props {
  symbolId: SymbolId;
  isHighlighted: boolean;
  isRemoving: boolean;
  /** True when this cell just finished a gravity fall or new-symbol drop */
  isLanded?: boolean;
}

export function SymbolTile({ symbolId, isHighlighted, isRemoving, isLanded = false }: Props) {
  const symbol = SYMBOL_MAP[symbolId];
  if (!symbol) return null;

  const Icon = SYMBOL_ICONS[symbolId];

  // Determine animation state
  const getAnimate = () => {
    if (isHighlighted) {
      return {
        scale: [1, 1.1, 1],
        transition: { repeat: Infinity, duration: 0.5 },
      };
    }
    if (isRemoving) {
      return {
        scale: 0,
        opacity: 0,
        transition: { duration: 0.2 }, // Snappier removal
      };
    }
    if (isLanded) {
      // Subtle land impact: brief scale overshoot then settle
      return {
        scale: [1.06, 1],
        transition: { duration: 0.15, ease: 'easeOut' as const },
      };
    }
    return { scale: 1, opacity: 1 };
  };

  return (
    <motion.div
      suppressHydrationWarning
      className={`
        aspect-square rounded-lg flex items-center justify-center
        transition-shadow duration-200
        ${isHighlighted
          ? 'shadow-lg ring-2 ring-amber-400/80 z-10'
          : 'shadow-sm'
        }
      `}
      style={{
        backgroundColor: `${symbol.color}22`,
        borderColor: `${symbol.color}66`,
        borderWidth: '2px',
      }}
      animate={getAnimate()}
    >
      {Icon ? <Icon size={28} /> : <span className="select-none text-2xl">?</span>}
    </motion.div>
  );
}
