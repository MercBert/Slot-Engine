import { SpinResult, Grid } from '../types';
import { createGrid } from './Grid';
import { detectClusters } from './ClusterDetector';
import { runFullCascade } from './CascadeEngine';

/**
 * Dummy spin resolver — generates a random grid and resolves all cascades
 * In production, this would call a backend API
 */
export async function resolveSpin(betAmount: number): Promise<SpinResult> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));

  // Generate initial grid
  const grid = createGrid();

  // Detect initial clusters
  const clusters = detectClusters(grid);

  // Run full cascade chain
  const { finalGrid, cascades, totalWin } = runFullCascade(grid, clusters, betAmount);

  return {
    grid,
    clusters,
    cascades,
    totalWin,
  };
}

/**
 * Deterministic spin for testing — uses seeded grid
 */
export async function resolveTestSpin(betAmount: number, seedGrid: Grid): Promise<SpinResult> {
  const clusters = detectClusters(seedGrid);
  const { finalGrid, cascades, totalWin } = runFullCascade(seedGrid, clusters, betAmount);

  return {
    grid: seedGrid,
    clusters,
    cascades,
    totalWin,
  };
}
