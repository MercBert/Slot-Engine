export const GAME_CONFIG = {
  gridRows: 7,
  gridCols: 6,
  minClusterSize: 5,
  startingBalance: 1000,
  defaultBet: 1,
  betOptions: [0.5, 1, 2, 5, 10, 25],
  // Payout multipliers by cluster size, tuned to ~95% RTP
  // (measured via `npm run simulate`; final win = bet × payout × tier multiplier)
  clusterPayouts: {
    5: 0.77,
    6: 1.12,
    7: 1.9,
    8: 3,
    9: 4.5,
    10: 5.7,
    11: 7.5,
    12: 11,
    13: 19,
    14: 28,
    15: 38,
  } as Record<number, number>,
  // Animation timing (ms)
  animation: {
    spinDuration: 400,
    landStagger: 40,
    clusterHighlight: 800,
    symbolRemove: 200,
    gravityFall: 500,
    newSymbolDrop: 400,
    cascadePause: 150,
    winDisplay: 2000,
  },
};
