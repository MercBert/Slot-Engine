import { SymbolDef } from '@/types';

export const SYMBOLS: SymbolDef[] = [
  { id: 'gem',     name: 'Gem',     color: '#8b5cf6', weight: 5,  tier: 1 },
  { id: 'shield',  name: 'Shield',  color: '#f59e0b', weight: 8,  tier: 2 },
  { id: 'compass', name: 'Compass', color: '#06b6d4', weight: 10, tier: 3 },
  { id: 'map',     name: 'Map',     color: '#d97706', weight: 12, tier: 4 },
  { id: 'bird',    name: 'Bird',    color: '#ec4899', weight: 15, tier: 5 },
  { id: 'potion',  name: 'Potion',  color: '#22c55e', weight: 18, tier: 6 },
  { id: 'coin',    name: 'Coin',    color: '#eab308', weight: 20, tier: 7 },
  { id: 'leaf',    name: 'Leaf',    color: '#16a34a', weight: 22, tier: 8 },
];

export const SYMBOL_MAP = Object.fromEntries(SYMBOLS.map(s => [s.id, s]));
