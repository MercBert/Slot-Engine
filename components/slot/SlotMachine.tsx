'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useSlotMachine } from '@/hooks/useSlotMachine';
import { useScreenShake } from '@/hooks/useScreenShake';
import { useAutoSpin, AUTO_SPIN_OPTIONS } from '@/hooks/useAutoSpin';
import { useTurboMode } from '@/hooks/useTurboMode';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useSessionStats } from '@/hooks/useSessionStats';
import { ReelGrid } from './ReelGrid';
import { BetControls } from './BetControls';
import { WinDisplay } from './WinDisplay';
import { ClusterParticles } from './ClusterParticles';
import { BigWinOverlay } from './BigWinOverlay';
import { SessionStatsBar } from './SessionStatsBar';
import { SettingsPanel } from './SettingsPanel';
import { GAME_CONFIG } from '@/config/game-config';
import { SlotState } from '@/types';

export function SlotMachine() {
  /* ---------------------------------------------------------------- */
  /*  Core hooks                                                       */
  /* ---------------------------------------------------------------- */
  const { turboEnabled, toggleTurbo, speedMultiplier } = useTurboMode();
  const { gameState, spin, setBet, isSpinning } = useSlotMachine(speedMultiplier);
  const { shakeControls, triggerShake } = useScreenShake();
  const { stats, recordSpin } = useSessionStats();

  /* ---------------------------------------------------------------- */
  /*  Big win overlay (declared early — auto-spin needs showBigWin)    */
  /* ---------------------------------------------------------------- */
  const [showBigWin, setShowBigWin] = useState(false);
  const bigWinRef = useRef({ totalWin: 0, betAmount: 1 });

  useEffect(() => {
    if (
      gameState.state === 'WIN_DISPLAY' &&
      gameState.totalWin >= gameState.betAmount * 20
    ) {
      bigWinRef.current = {
        totalWin: gameState.totalWin,
        betAmount: gameState.betAmount,
      };
      setShowBigWin(true);
    }
  }, [gameState.state, gameState.totalWin, gameState.betAmount]);

  const dismissBigWin = useCallback(() => setShowBigWin(false), []);

  /* ---------------------------------------------------------------- */
  /*  Auto-spin                                                        */
  /* ---------------------------------------------------------------- */
  const { autoSpinning, remainingSpins, startAutoSpin, stopAutoSpin } = useAutoSpin({
    spin,
    isSpinning,
    balance: gameState.balance,
    betAmount: gameState.betAmount,
    paused: showBigWin,
  });

  /* ---------------------------------------------------------------- */
  /*  Keyboard shortcuts                                               */
  /* ---------------------------------------------------------------- */
  const betOptionsRef = useRef(GAME_CONFIG.betOptions);

  const handleBetUp = useCallback(() => {
    const opts = betOptionsRef.current;
    const idx = opts.indexOf(gameState.betAmount);
    if (idx < opts.length - 1) setBet(opts[idx + 1]);
  }, [gameState.betAmount, setBet]);

  const handleBetDown = useCallback(() => {
    const opts = betOptionsRef.current;
    const idx = opts.indexOf(gameState.betAmount);
    if (idx > 0) setBet(opts[idx - 1]);
  }, [gameState.betAmount, setBet]);

  useKeyboardShortcuts({
    onSpin: spin,
    onBetUp: handleBetUp,
    onBetDown: handleBetDown,
    enabled: !isSpinning && !autoSpinning,
  });

  /* ---------------------------------------------------------------- */
  /*  Record stats on spin completion                                  */
  /* ---------------------------------------------------------------- */
  const prevStateRef = useRef<SlotState>('IDLE');

  useEffect(() => {
    const curr = gameState.state;
    const prev = prevStateRef.current;

    // Trigger screen shake when entering CASCADING
    if (curr === 'CASCADING' && prev !== 'CASCADING') {
      const totalCells = gameState.activeClusters.reduce(
        (sum, c) => sum + c.size,
        0,
      );
      if (totalCells > 0) triggerShake(totalCells);
    }

    // Record stats when returning to IDLE after a spin
    if (curr === 'IDLE' && prev !== 'IDLE') {
      recordSpin(gameState.betAmount, gameState.totalWin);
    }

    prevStateRef.current = curr;
  }, [gameState.state, gameState.activeClusters, gameState.betAmount, gameState.totalWin, triggerShake, recordSpin]);

  /* ---------------------------------------------------------------- */
  /*  Settings panel                                                   */
  /* ---------------------------------------------------------------- */
  const [settingsOpen, setSettingsOpen] = useState(false);

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-slate-950 flex flex-col items-center relative">
      {/* Header */}
      <header className="p-4 text-center">
        <h1 className="text-3xl font-bold text-amber-300 drop-shadow-lg">
          ⚙️ Slot Engine
        </h1>
        <p className="text-purple-300/60 text-sm mt-1">
          Cluster Pay • Cascade • v1
          {turboEnabled && <span className="ml-2 text-amber-400">⚡ TURBO</span>}
        </p>
      </header>

      {/* Balance */}
      <div className="text-center mb-4">
        <span className="text-purple-300 text-sm">Balance</span>
        <p className="text-2xl font-bold text-white tabular-nums">
          ${gameState.balance.toFixed(2)}
        </p>
      </div>

      {/* Win Display */}
      <WinDisplay
        currentWin={gameState.currentWin}
        totalWin={gameState.totalWin}
        state={gameState.state}
        cascadeDepth={gameState.cascadeDepth}
        betAmount={gameState.betAmount}
      />

      {/* Grid — wrapped in shake container with particle overlay */}
      <motion.div
        animate={shakeControls}
        className="my-4 px-2 w-full max-w-lg relative"
      >
        <ReelGrid
          grid={gameState.grid}
          activeClusters={gameState.activeClusters}
          state={gameState.state}
          cascadeNewCellKeys={gameState.cascadeNewCellKeys}
          cascadeFallenCells={gameState.cascadeFallenCells}
        />

        <ClusterParticles
          clusters={gameState.activeClusters}
          state={gameState.state}
          rows={GAME_CONFIG.gridRows}
          cols={GAME_CONFIG.gridCols}
        />

        {/* Big Win Overlay — positioned over the grid */}
        <BigWinOverlay
          show={showBigWin}
          totalWin={bigWinRef.current.totalWin}
          betAmount={bigWinRef.current.betAmount}
          onDismiss={dismissBigWin}
        />
      </motion.div>

      {/* Session Stats */}
      <div className="mb-3 px-4 w-full max-w-lg">
        <SessionStatsBar stats={stats} />
      </div>

      {/* Controls */}
      <BetControls
        betAmount={gameState.betAmount}
        onBetChange={setBet}
        onSpin={spin}
        isSpinning={isSpinning}
        balance={gameState.balance}
        betOptions={GAME_CONFIG.betOptions}
      />

      {/* Auto-spin + Settings buttons */}
      <div className="flex items-center gap-3 mt-4 mb-2">
        {autoSpinning ? (
          <button
            onClick={stopAutoSpin}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors"
          >
            Stop Auto ({remainingSpins})
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-purple-400 text-xs">Auto:</span>
            {AUTO_SPIN_OPTIONS.map((count) => (
              <button
                key={count}
                onClick={() => startAutoSpin(count)}
                disabled={isSpinning || gameState.balance < gameState.betAmount}
                className="px-3 py-1.5 rounded-lg bg-purple-800/50 hover:bg-purple-700/60 text-purple-200 text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {count}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={() => setSettingsOpen((v) => !v)}
          className="px-3 py-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-600/60 text-purple-300 text-sm transition-colors"
        >
          ⚙️
        </button>
      </div>

      {/* Settings Panel */}
      <div className="px-4 w-full max-w-lg mb-4">
        <SettingsPanel
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          turboEnabled={turboEnabled}
          onToggleTurbo={toggleTurbo}
        />
      </div>

    </div>
  );
}
