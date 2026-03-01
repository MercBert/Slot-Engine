'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { SessionStats } from '@/hooks/useSessionStats';

interface SessionStatsBarProps {
  stats: SessionStats;
}

function formatCurrency(value: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function SessionStatsBar({ stats }: SessionStatsBarProps) {
  const pnlPositive = stats.netPnL >= 0;
  const pnlColor = pnlPositive ? 'rgb(74, 222, 128)' : 'rgb(248, 113, 113)'; // green-400 / red-400
  const pnlSign = pnlPositive ? '+' : '-';
  const pnlDisplay = `${pnlSign}$${formatCurrency(Math.abs(stats.netPnL))}`;

  return (
    <div className="flex items-center justify-center gap-3 text-sm text-purple-300/60 tabular-nums">
      <span>
        Spins: <span className="text-purple-300/80">{stats.totalSpins}</span>
      </span>
      <span className="text-purple-300/30">|</span>
      <span>
        Wagered:{' '}
        <span className="text-purple-300/80">
          ${formatCurrency(stats.totalWagered)}
        </span>
      </span>
      <span className="text-purple-300/30">|</span>
      <span>
        Won:{' '}
        <span className="text-purple-300/80">
          ${formatCurrency(stats.totalWon)}
        </span>
      </span>
      <span className="text-purple-300/30">|</span>
      <span>
        P&amp;L:{' '}
        <AnimatePresence mode="wait">
          <motion.span
            key={pnlPositive ? 'positive' : 'negative'}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0, color: pnlColor }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
            className="inline-block font-medium"
          >
            {pnlDisplay}
          </motion.span>
        </AnimatePresence>
      </span>
    </div>
  );
}
