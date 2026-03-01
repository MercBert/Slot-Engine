export type SymbolId = string;

export interface SymbolDef {
  id: SymbolId;
  name: string;
  color: string;
  weight: number; // Higher = more common
  tier: number;   // 1 = highest value, 8 = lowest
}

export interface GridCell {
  symbolId: SymbolId;
  row: number;
  col: number;
  key: string; // Unique key for animation tracking
}

export type Grid = GridCell[][];

export interface Cluster {
  symbolId: SymbolId;
  cells: { row: number; col: number }[];
  size: number;
}

export interface SpinResult {
  grid: Grid;
  clusters: Cluster[];
  cascades: CascadeStep[];
  totalWin: number;
}

export interface CascadeStep {
  removedCells: { row: number; col: number }[];
  fallenCells: { from: { row: number; col: number }; to: { row: number; col: number }; symbolId: SymbolId }[];
  newCells: GridCell[];
  newClusters: Cluster[];
  stepWin: number;
}

export type SlotState = 'IDLE' | 'SPINNING' | 'LANDING' | 'RESOLVING' | 'CASCADING' | 'WIN_DISPLAY';

export interface FallenCellInfo {
  key: string;
  rowsDropped: number;
}

export interface GameState {
  state: SlotState;
  grid: Grid;
  balance: number;
  betAmount: number;
  currentWin: number;
  totalWin: number;
  cascadeDepth: number;
  activeClusters: Cluster[];
  /** Keys of cells that just dropped in from top during a cascade */
  cascadeNewCellKeys: string[];
  /** Cells that fell during a cascade, with distance info */
  cascadeFallenCells: FallenCellInfo[];
}
