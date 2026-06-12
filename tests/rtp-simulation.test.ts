import { describe, it, expect } from 'vitest';
import { createGrid } from '@/engine/Grid';
import { detectClusters } from '@/engine/ClusterDetector';
import { runFullCascade } from '@/engine/CascadeEngine';

/**
 * Statistical simulation of the game economics. Not part of the fast test
 * loop — run with `npm run simulate` (SIM=1). Spin count via SPINS env var.
 *
 * RTP (return to player) = total won / total bet. Casino slots typically
 * target 92–97%; this harness measures what the current config actually pays.
 */
const SPINS = Number(process.env.SPINS ?? 100_000);
const BET = 1;

describe.runIf(process.env.SIM)('RTP simulation', () => {
  it(`measures RTP and hit frequency over ${SPINS.toLocaleString()} spins`, () => {
    let totalWin = 0;
    let hits = 0;
    let totalCascades = 0;
    let maxCascades = 0;
    let maxWin = 0;
    // Win-multiple buckets: loss, (0,1x], (1,5x], (5,20x], (20,100x], >100x
    const buckets = { loss: 0, '≤1x': 0, '1–5x': 0, '5–20x': 0, '20–100x': 0, '>100x': 0 };

    const started = Date.now();
    for (let i = 0; i < SPINS; i++) {
      const grid = createGrid();
      const clusters = detectClusters(grid);
      const result = runFullCascade(grid, clusters, BET);

      const win = result.totalWin;
      totalWin += win;
      totalCascades += result.cascades.length;
      if (result.cascades.length > maxCascades) maxCascades = result.cascades.length;
      if (win > maxWin) maxWin = win;

      if (win === 0) buckets.loss++;
      else if (win <= BET) buckets['≤1x']++;
      else if (win <= 5 * BET) buckets['1–5x']++;
      else if (win <= 20 * BET) buckets['5–20x']++;
      else if (win <= 100 * BET) buckets['20–100x']++;
      else buckets['>100x']++;

      if (win > 0) hits++;
    }
    const elapsed = (Date.now() - started) / 1000;

    const rtp = totalWin / (SPINS * BET);
    const hitFrequency = hits / SPINS;

    process.stdout.write(`
=== RTP Simulation — ${SPINS.toLocaleString()} spins @ bet ${BET} (${elapsed.toFixed(1)}s) ===
RTP:                ${(rtp * 100).toFixed(2)}%
Hit frequency:      ${(hitFrequency * 100).toFixed(2)}% of spins win
Avg cascades/spin:  ${(totalCascades / SPINS).toFixed(3)}
Max cascade chain:  ${maxCascades}
Max single win:     ${maxWin.toFixed(2)}x bet
Win distribution:   ${Object.entries(buckets)
      .map(([k, v]) => `${k}: ${((v / SPINS) * 100).toFixed(2)}%`)
      .join('  |  ')}
`);

    expect(Number.isFinite(totalWin)).toBe(true);
    expect(totalWin).toBeGreaterThanOrEqual(0);

    // Regression band: clusterPayouts are tuned to ~94-95% RTP (measured
    // ±1.5% noise at 100k spins). A payout/weight/tier change that moves RTP
    // outside 90-100% breaks the game's economics and must fail here.
    expect(rtp).toBeGreaterThan(0.9);
    expect(rtp).toBeLessThan(1.0);
  }, 600_000);
});
