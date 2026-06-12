import { describe, it, expect } from 'vitest';
import { createGrid, cloneGrid, setCell, getCell, gridSize, flatCells } from '@/engine/Grid';
import { GAME_CONFIG } from '@/config/game-config';
import { SYMBOL_MAP } from '@/config/symbols';
import { gridFromLayout } from './helpers';

describe('createGrid', () => {
  it('creates a grid with the configured dimensions by default', () => {
    const grid = createGrid();
    expect(gridSize(grid)).toEqual({ rows: GAME_CONFIG.gridRows, cols: GAME_CONFIG.gridCols });
  });

  it('respects explicit dimensions', () => {
    expect(gridSize(createGrid(3, 4))).toEqual({ rows: 3, cols: 4 });
  });

  it('fills every cell with a valid weighted symbol and correct coordinates', () => {
    const grid = createGrid();
    grid.forEach((row, r) =>
      row.forEach((cell, c) => {
        expect(SYMBOL_MAP[cell.symbolId]).toBeDefined();
        expect(cell.row).toBe(r);
        expect(cell.col).toBe(c);
      })
    );
  });

  it('assigns a unique animation key to every cell', () => {
    const keys = flatCells(createGrid()).map(cell => cell.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe('cloneGrid', () => {
  it('produces a deep copy — mutating the clone leaves the original intact', () => {
    const grid = gridFromLayout([['gem', 'coin'], ['bird', 'leaf']]);
    const clone = cloneGrid(grid);

    clone[0][0].symbolId = 'shield';

    expect(grid[0][0].symbolId).toBe('gem');
  });
});

describe('setCell', () => {
  it('returns a new grid with the symbol changed, without mutating the original', () => {
    const grid = gridFromLayout([['gem', 'coin'], ['bird', 'leaf']]);

    const next = setCell(grid, 1, 0, 'map');

    expect(next[1][0].symbolId).toBe('map');
    expect(grid[1][0].symbolId).toBe('bird');
  });
});

describe('getCell', () => {
  it('returns the cell inside bounds and null outside', () => {
    const grid = gridFromLayout([['gem', 'coin'], ['bird', 'leaf']]);

    expect(getCell(grid, 0, 1)?.symbolId).toBe('coin');
    expect(getCell(grid, -1, 0)).toBeNull();
    expect(getCell(grid, 2, 0)).toBeNull();
    expect(getCell(grid, 0, 2)).toBeNull();
  });
});
