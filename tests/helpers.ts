import { Grid, GridCell, SymbolId } from '@/types';

let testKey = 0;

/** Build a Grid from a 2D array of symbol ids. */
export function gridFromLayout(layout: SymbolId[][]): Grid {
  return layout.map((row, r) =>
    row.map(
      (symbolId, c): GridCell => ({ symbolId, row: r, col: c, key: `test-${++testKey}` })
    )
  );
}

/** Project a Grid back down to its 2D symbol-id layout. */
export function symbolLayout(grid: Grid): SymbolId[][] {
  return grid.map(row => row.map(cell => cell.symbolId));
}

/**
 * Checkerboard of two symbols — no two equal symbols are ever adjacent,
 * so the layout is guaranteed cluster-free. Tests overwrite cells on top
 * of it to create exactly the clusters they want.
 */
export function checkerboard(a: SymbolId, b: SymbolId, rows = 5, cols = 5): SymbolId[][] {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ((r + c) % 2 === 0 ? a : b))
  );
}
