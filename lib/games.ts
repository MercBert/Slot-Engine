export type Game = {
    title: string;
    description: string;
    gameAddress: string;
    gameBackground: string;
    animatedBackground?: string;
    card: string;
    banner: string;
    advanceToNextStateAsset?: string;
    themeColorBackground: string;
    song?: string;
    payouts: PayoutStructure;
};

export type PayoutStructure = {
    [key: number]: {
        [key: number]: {
            [key: number]: number;
        };
    };
};

export const slotsEngine: Game = {
    title: "Slots Engine",
    description: "Cluster-pay cascade slot machine with explosive chain reactions",
    gameAddress: "0x0000000000000000000000000000000000000000",
    gameBackground: "/slots-engine/background.png",
    card: "/slots-engine/card.png",
    banner: "/slots-engine/banner.png",
    themeColorBackground: "#8B5CF6",
    payouts: {},
};

export const getPayout = (
    payouts: PayoutStructure,
    result0: number,
    result1: number,
    result2: number
): number => {
    return payouts[result0]?.[result1]?.[result2] || 0;
};

export const randomBytes = (amount: number) =>
    crypto.getRandomValues(new Uint8Array(amount));
