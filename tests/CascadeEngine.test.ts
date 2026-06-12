import { describe, it, expect, beforeEach, vi } from 'vitest';
import { calculateClusterWin, performCascade, runFullCascade } from '@/engine/CascadeEngine';
import { detectClusters } from '@/engine/ClusterDetector';
import { GAME_CONFIG } from '@/config/game-config';
import { Cluster } from '@/types';
import { gridFromLayout, symbolLayout, checkerboard } from './helpers';

// Size payout for a minimum (5-cell) cluster — read from config so payout
// tuning doesn't break these tests. The tier multipliers and scaling logic
// are asserted with literals; the RTP simulation guards the actual values.
const P5 = GAME_CONFIG.clusterPayouts[5];

// Replace the weighted RNG with a scripted queue so every refill is
// deterministic. Each test enqueues exactly the symbols it expects to drop in.
const symbolQueue: string[] = [];
vi.mock('@/engine/SymbolGenerator', () => ({
  generateWeightedSymbol: () => {
    const next = symbolQueue.shift();
    if (next === undefined) throw new Error('symbolQueue exhausted — enqueue more refill symbols');
    return next;
  },
  generateSymbols: (count: number) =>
    Array.from({ length: count }, () => symbolQueue.shift()),
}));

beforeEach(() => {
  symbolQueue.length = 0;
});

function cluster(symbolId: string, size: number, cells: { row: number; col: number }[] = []): Cluster {
  return { symbolId, size, cells };
}

describe('calculateClusterWin', () => {
  it('pays bet × size payout × tier multiplier', () => {
    // gem is tier 1 → multiplier 8
    expect(calculateClusterWin([cluster('gem', 5)], 1)).toBe(P5 * 8);
    // leaf is tier 8 → multiplier 1
    expect(calculateClusterWin([cluster('leaf', 5)], 1)).toBe(P5 * 1);
  });

  it('scales linearly with the bet amount', () => {
    expect(calculateClusterWin([cluster('gem', 5)], 2)).toBe(P5 * 8 * 2);
  });

  it('caps the size payout at the 15-cell tier', () => {
    expect(calculateClusterWin([cluster('gem', 20)], 1)).toBe(calculateClusterWin([cluster('gem', 15)], 1));
  });

  it('sums wins across multiple clusters', () => {
    expect(calculateClusterWin([cluster('gem', 5), cluster('leaf', 5)], 1)).toBe(P5 * 8 + P5);
  });
});

describe('performCascade', () => {
  it('removes cluster cells, drops survivors down, and refills from the top', () => {
    const grid = gridFromLayout([
      ['s1', 's2', 's3'],
      ['s4', 's5', 's6'],
      ['s7', 's8', 's9'],
    ]);
    symbolQueue.push('n1');

    const { newGrid, step } = performCascade(grid, [
      cluster('s7', 1, [{ row: 2, col: 0 }]),
    ]);

    expect(symbolLayout(newGrid)).toEqual([
      ['n1', 's2', 's3'],
      ['s1', 's5', 's6'],
      ['s4', 's8', 's9'],
    ]);
    expect(step.removedCells).toEqual([{ row: 2, col: 0 }]);
    expect(step.fallenCells).toContainEqual({
      from: { row: 1, col: 0 }, to: { row: 2, col: 0 }, symbolId: 's4',
    });
    expect(step.fallenCells).toContainEqual({
      from: { row: 0, col: 0 }, to: { row: 1, col: 0 }, symbolId: 's1',
    });
    expect(step.newCells).toHaveLength(1);
    expect(step.newCells[0]).toMatchObject({ symbolId: 'n1', row: 0, col: 0 });
  });

  it('keeps every cell\'s row/col in sync with its grid position', () => {
    const grid = gridFromLayout([
      ['s1', 's2', 's3'],
      ['s4', 's5', 's6'],
      ['s7', 's8', 's9'],
    ]);
    symbolQueue.push('n1', 'n2');

    const { newGrid } = performCascade(grid, [
      cluster('x', 2, [{ row: 1, col: 1 }, { row: 2, col: 1 }]),
    ]);

    newGrid.forEach((row, r) =>
      row.forEach((cell, c) => {
        expect(cell.row).toBe(r);
        expect(cell.col).toBe(c);
      })
    );
  });

  it('does not mutate the input grid', () => {
    const grid = gridFromLayout([
      ['s1', 's2', 's3'],
      ['s4', 's5', 's6'],
      ['s7', 's8', 's9'],
    ]);
    symbolQueue.push('n1');

    performCascade(grid, [cluster('s7', 1, [{ row: 2, col: 0 }])]);

    expect(symbolLayout(grid)).toEqual([
      ['s1', 's2', 's3'],
      ['s4', 's5', 's6'],
      ['s7', 's8', 's9'],
    ]);
  });
});

describe('runFullCascade', () => {
  it('returns zero win and no cascades when the grid has no clusters', () => {
    const grid = gridFromLayout(checkerboard('coin', 'bird'));

    const { cascades, totalWin } = runFullCascade(grid, detectClusters(grid), 1);

    expect(cascades).toHaveLength(0);
    expect(totalWin).toBe(0);
  });

  it('resolves a single cascade and stops when the refill creates no new clusters', () => {
    const layout = checkerboard('coin', 'bird');
    layout[4] = ['gem', 'gem', 'gem', 'gem', 'gem'];
    const grid = gridFromLayout(layout);
    // Refill row 0 continues the checkerboard, so nothing new can cluster
    symbolQueue.push('bird', 'coin', 'bird', 'coin', 'bird');

    const { finalGrid, cascades, totalWin } = runFullCascade(grid, detectClusters(grid), 1);

    expect(cascades).toHaveLength(1);
    expect(cascades[0].stepWin).toBe(P5 * 8); // gem (tier 1, ×8) cluster of 5 at bet 1
    expect(totalWin).toBe(P5 * 8);
    expect(cascades[0].newClusters).toHaveLength(0);
    expect(detectClusters(finalGrid)).toHaveLength(0);
  });

  it('chains cascades when a refill forms a new cluster, accumulating the win', () => {
    const layout = checkerboard('coin', 'bird');
    layout[4] = ['gem', 'gem', 'gem', 'gem', 'gem'];
    const grid = gridFromLayout(layout);
    // First refill drops 5 shields into row 0 → new cluster → second cascade.
    // Second refill restores the checkerboard → chain ends.
    symbolQueue.push(
      'shield', 'shield', 'shield', 'shield', 'shield',
      'bird', 'coin', 'bird', 'coin', 'bird',
    );

    const { finalGrid, cascades, totalWin } = runFullCascade(grid, detectClusters(grid), 1);

    expect(cascades).toHaveLength(2);
    expect(cascades[0].stepWin).toBe(P5 * 8); // gem: tier 1 → ×8
    expect(cascades[1].stepWin).toBe(P5 * 7); // shield: tier 2 → ×7
    expect(totalWin).toBe(P5 * 8 + P5 * 7);
    expect(detectClusters(finalGrid)).toHaveLength(0);
  });
});
