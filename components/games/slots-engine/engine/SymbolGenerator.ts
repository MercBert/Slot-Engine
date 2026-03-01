import { SymbolId } from '../types';
import { SYMBOLS } from '../config/symbols';

/**
 * Generate a random symbol based on weights
 * Higher weight = more likely to appear
 */
export function generateWeightedSymbol(): SymbolId {
  const totalWeight = SYMBOLS.reduce((sum, s) => sum + s.weight, 0);
  let random = Math.random() * totalWeight;

  for (const symbol of SYMBOLS) {
    random -= symbol.weight;
    if (random <= 0) {
      return symbol.id;
    }
  }

  // Fallback (shouldn't reach here)
  return SYMBOLS[SYMBOLS.length - 1].id;
}

/**
 * Generate multiple symbols
 */
export function generateSymbols(count: number): SymbolId[] {
  return Array(count).fill(0).map(() => generateWeightedSymbol());
}
