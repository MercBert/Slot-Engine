'use client';

import { useState, useCallback, useRef } from 'react';
import { GameState, Grid, FallenCellInfo } from '@/types';
import { GAME_CONFIG } from '@/config/game-config';
import { createGrid } from '@/engine/Grid';
import { resolveSpin } from '@/engine/SpinResolver';

const initialState: GameState = {
  state: 'IDLE',
  grid: [],
  balance: GAME_CONFIG.startingBalance,
  betAmount: GAME_CONFIG.defaultBet,
  currentWin: 0,
  totalWin: 0,
  cascadeDepth: 0,
  activeClusters: [],
  cascadeNewCellKeys: [],
  cascadeFallenCells: [],
};

function delay(ms: number, multiplier: number = 1): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms * multiplier));
}

export function useSlotMachine(speedMultiplier: number = 1) {
  const [gameState, setGameState] = useState<GameState>(() => ({
    ...initialState,
    grid: createGrid(),
  }));

  const animatingRef = useRef(false);
  const betRef = useRef(GAME_CONFIG.defaultBet);
  const speedRef = useRef(speedMultiplier);
  speedRef.current = speedMultiplier;

  // Keep betRef in sync
  const setBet = useCallback((amount: number) => {
    setGameState(prev => {
      if (prev.state !== 'IDLE') return prev;
      betRef.current = amount;
      return { ...prev, betAmount: amount };
    });
  }, []);

  // Main spin function
  const spin = useCallback(async () => {
    if (animatingRef.current) return;
    animatingRef.current = true;

    const currentBet = betRef.current;

    // Deduct bet
    setGameState(prev => {
      if (prev.state !== 'IDLE') return prev;
      if (prev.balance < prev.betAmount) return prev;
      return {
        ...prev,
        state: 'SPINNING',
        balance: prev.balance - prev.betAmount,
        currentWin: 0,
        totalWin: 0,
        cascadeDepth: 0,
        activeClusters: [],
        cascadeNewCellKeys: [],
        cascadeFallenCells: [],
      };
    });

    try {
      // Get spin result from resolver
      const result = await resolveSpin(currentBet);
      const { animation } = GAME_CONFIG;

      // Phase 1: Land the initial grid
      setGameState(prev => ({
        ...prev,
        state: 'LANDING',
        grid: result.grid,
        activeClusters: [],
        cascadeNewCellKeys: [],
        cascadeFallenCells: [],
      }));

      const speed = speedRef.current;
      await delay(animation.spinDuration + animation.landStagger * GAME_CONFIG.gridRows, speed);

      if (result.clusters.length === 0 && result.cascades.length === 0) {
        // No wins — back to idle
        setGameState(prev => ({
          ...prev,
          state: 'IDLE',
          totalWin: 0,
        }));
        return;
      }

      // Phase 2: Highlight initial clusters
      setGameState(prev => ({
        ...prev,
        state: 'RESOLVING',
        activeClusters: result.clusters,
      }));

      await delay(animation.clusterHighlight, speed);

      // Phase 3: Process cascade chain
      let currentGrid: Grid = result.grid;
      let cumulativeWin = 0;

      for (let i = 0; i < result.cascades.length; i++) {
        const cascade = result.cascades[i];
        cumulativeWin += cascade.stepWin;

        // Show removal animation (mark cascading state)
        setGameState(prev => ({
          ...prev,
          state: 'CASCADING',
          cascadeDepth: i + 1,
          currentWin: cumulativeWin,
        }));

        await delay(animation.symbolRemove, speed);

        // Apply cascade: rebuild grid from cascade step data
        const newGrid = applyCascadeToGrid(currentGrid, cascade);
        currentGrid = newGrid;

        // Build cascade metadata for animations
        const newCellKeys = cascade.newCells.map(c => c.key);
        const fallenCells: FallenCellInfo[] = cascade.fallenCells.map(f => ({
          key: currentGrid[f.to.row]?.[f.to.col]?.key ?? '',
          rowsDropped: f.to.row - f.from.row,
        }));

        // Update grid with fallen + new symbols and cascade metadata
        setGameState(prev => ({
          ...prev,
          grid: newGrid,
          activeClusters: [],
          cascadeNewCellKeys: newCellKeys,
          cascadeFallenCells: fallenCells,
        }));

        await delay(animation.gravityFall + animation.newSymbolDrop, speed);

        // Brief pause between cascade phases
        if (animation.cascadePause > 0) {
          await delay(animation.cascadePause, speed);
        }

        // Highlight new clusters (if any)
        if (cascade.newClusters.length > 0) {
          setGameState(prev => ({
            ...prev,
            state: 'RESOLVING',
            activeClusters: cascade.newClusters,
          }));

          await delay(animation.clusterHighlight, speed);
        }
      }

      // Phase 4: Win display
      if (result.totalWin > 0) {
        setGameState(prev => ({
          ...prev,
          state: 'WIN_DISPLAY',
          totalWin: result.totalWin,
          balance: prev.balance + result.totalWin,
          activeClusters: [],
          cascadeNewCellKeys: [],
          cascadeFallenCells: [],
        }));

        await delay(animation.winDisplay, speed);
      }

      // Back to idle
      setGameState(prev => ({
        ...prev,
        state: 'IDLE',
        activeClusters: [],
        cascadeNewCellKeys: [],
        cascadeFallenCells: [],
      }));

    } catch (error) {
      console.error('[SlotMachine] Spin error:', error);
      setGameState(prev => ({
        ...prev,
        state: 'IDLE',
      }));
    } finally {
      animatingRef.current = false;
    }
  }, []);

  return {
    gameState,
    spin,
    setBet,
    isSpinning: gameState.state !== 'IDLE',
    // Template-compliant aliases
    playGame: spin,
    handleStateAdvance: spin,
    handleReset: useCallback(() => {
      setGameState(prev => ({ ...initialState, grid: createGrid(), balance: prev.balance }));
      animatingRef.current = false;
    }, []),
    handlePlayAgain: spin,
    handleRewatch: useCallback(() => {}, []),
  };
}

/**
 * Apply a cascade step to the current grid:
 * 1. Start from a copy of the current grid (preserving static cells)
 * 2. Clear removed cells + vacated positions
 * 3. Place fallen cells at their new positions
 * 4. Insert new cells at top
 */
function applyCascadeToGrid(
  grid: Grid,
  cascade: { removedCells: { row: number; col: number }[]; fallenCells: { from: { row: number; col: number }; to: { row: number; col: number }; symbolId: string }[]; newCells: { symbolId: string; row: number; col: number; key: string }[] }
): Grid {
  const rows = grid.length;
  const cols = grid[0].length;

  // Start from a copy — this preserves cells that survived AND didn't move
  const newGrid: Grid = grid.map(row => row.map(cell => ({ ...cell })));

  // Build sets for removed cells and vacated positions (cells that moved away)
  const removedSet = new Set(
    cascade.removedCells.map(c => `${c.row},${c.col}`)
  );
  const movedFromSet = new Set(
    cascade.fallenCells.map(f => `${f.from.row},${f.from.col}`)
  );

  // Clear removed cells and vacated positions
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const key = `${r},${c}`;
      if (removedSet.has(key) || movedFromSet.has(key)) {
        newGrid[r][c] = { symbolId: '', row: r, col: c, key: `empty-${r}-${c}` };
      }
    }
  }

  // Place fallen cells at their destination positions
  for (const fallen of cascade.fallenCells) {
    const originalCell = grid[fallen.from.row]?.[fallen.from.col];
    if (originalCell) {
      newGrid[fallen.to.row][fallen.to.col] = {
        ...originalCell,
        row: fallen.to.row,
        col: fallen.to.col,
      };
    }
  }

  // Place new cells at top
  for (const cell of cascade.newCells) {
    newGrid[cell.row][cell.col] = {
      symbolId: cell.symbolId,
      row: cell.row,
      col: cell.col,
      key: cell.key,
    };
  }

  return newGrid;
}
