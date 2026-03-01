export const GAME_CONFIG = {
  gridRows: 7,
  gridCols: 6,
  minClusterSize: 5,
  startingBalance: 1000,
  defaultBet: 1,
  betOptions: [0.5, 1, 2, 5, 10, 25],
  // Payout multipliers by cluster size (dummy values)
  clusterPayouts: {
    5: 2,
    6: 3,
    7: 5,
    8: 8,
    9: 12,
    10: 15,
    11: 20,
    12: 30,
    13: 50,
    14: 75,
    15: 100,
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
