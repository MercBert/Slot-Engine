import { describe, it, expect } from 'vitest';
import { detectClusters, getAllClusterCells } from '@/engine/ClusterDetector';
import { Cluster } from '@/types';
import { gridFromLayout, checkerboard } from './helpers';

describe('detectClusters', () => {
  it('detects a horizontal run of 5 matching symbols as one cluster', () => {
    const layout = checkerboard('coin', 'bird');
    layout[2] = ['gem', 'gem', 'gem', 'gem', 'gem'];

    const clusters = detectClusters(gridFromLayout(layout));

    expect(clusters).toHaveLength(1);
    expect(clusters[0].symbolId).toBe('gem');
    expect(clusters[0].size).toBe(5);
  });

  it('ignores connected groups smaller than the minimum cluster size', () => {
    const layout = checkerboard('coin', 'bird');
    layout[2][0] = 'gem';
    layout[2][1] = 'gem';
    layout[2][2] = 'gem';
    layout[2][3] = 'gem';

    expect(detectClusters(gridFromLayout(layout))).toHaveLength(0);
  });

  it('connects cells through L-shaped (4-directional) adjacency', () => {
    const layout = checkerboard('coin', 'bird');
    layout[0][0] = 'gem';
    layout[1][0] = 'gem';
    layout[2][0] = 'gem';
    layout[2][1] = 'gem';
    layout[2][2] = 'gem';

    const clusters = detectClusters(gridFromLayout(layout));

    expect(clusters).toHaveLength(1);
    expect(clusters[0].size).toBe(5);
  });

  it('does not connect diagonal neighbours', () => {
    const layout = checkerboard('coin', 'bird');
    for (let i = 0; i < 5; i++) layout[i][i] = 'gem';

    expect(detectClusters(gridFromLayout(layout))).toHaveLength(0);
  });

  it('finds multiple distinct clusters in one grid', () => {
    const layout = checkerboard('coin', 'bird');
    layout[0] = ['gem', 'gem', 'gem', 'gem', 'gem'];
    layout[4] = ['shield', 'shield', 'shield', 'shield', 'shield'];

    const clusters = detectClusters(gridFromLayout(layout));

    expect(clusters).toHaveLength(2);
    expect(clusters.map(c => c.symbolId).sort()).toEqual(['gem', 'shield']);
  });
});

describe('getAllClusterCells', () => {
  it('returns unique cells across overlapping clusters', () => {
    const clusters: Cluster[] = [
      { symbolId: 'gem', size: 2, cells: [{ row: 0, col: 0 }, { row: 0, col: 1 }] },
      { symbolId: 'gem', size: 2, cells: [{ row: 0, col: 1 }, { row: 0, col: 2 }] },
    ];

    const cells = getAllClusterCells(clusters);

    expect(cells).toHaveLength(3);
    expect(cells).toContainEqual({ row: 0, col: 1 });
  });
});
