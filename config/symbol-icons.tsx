import React from 'react';
import {
  GemIcon,
  ShieldIcon,
  CompassIcon,
  MapIcon,
  BirdIcon,
  PotionIcon,
  CoinIcon,
  LeafIcon,
  type SymbolIconProps,
} from '@/components/symbols';

export const SYMBOL_ICONS: Record<string, React.FC<SymbolIconProps>> = {
  gem: GemIcon,
  shield: ShieldIcon,
  compass: CompassIcon,
  map: MapIcon,
  bird: BirdIcon,
  potion: PotionIcon,
  coin: CoinIcon,
  leaf: LeafIcon,
};
