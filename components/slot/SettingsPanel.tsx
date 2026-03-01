'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  turboEnabled: boolean;
  onToggleTurbo: () => void;
}

function ToggleSwitch({ enabled, onToggle, label }: { enabled: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full py-3 group"
    >
      <span className="text-purple-200 group-hover:text-white transition-colors">{label}</span>
      <div
        className={`
          relative w-11 h-6 rounded-full transition-colors duration-200
          ${enabled ? 'bg-amber-500' : 'bg-slate-600'}
        `}
      >
        <motion.div
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow"
          animate={{ left: enabled ? 22 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </div>
    </button>
  );
}

export function SettingsPanel({ isOpen, onClose, turboEnabled, onToggleTurbo }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="settings"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="w-full max-w-lg mx-auto bg-slate-800/90 border border-purple-500/20 rounded-xl p-4 backdrop-blur"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-purple-200">⚙️ Settings</h3>
            <button
              onClick={onClose}
              className="text-purple-400 hover:text-white transition-colors text-xl leading-none"
            >
              ✕
            </button>
          </div>

          <div className="divide-y divide-purple-500/10">
            <ToggleSwitch
              enabled={turboEnabled}
              onToggle={onToggleTurbo}
              label="⚡ Turbo Mode"
            />
          </div>

          <p className="text-xs text-purple-400/50 mt-3">
            Keyboard: Space = Spin · ↑↓ = Bet · Turbo halves animation speed
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
