"use client";

import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Game } from "@/lib/games";
import BetAmountInput from "@/components/shared/BetAmountInput";
import { CustomSlider } from "@/components/shared/CustomSlider";
import { GAME_CONFIG } from "./config/game-config";
import type { SessionStats } from "./hooks/useSessionStats";

interface SlotsEngineSetupCardProps {
    game: Game;
    onPlay: () => void;
    onSpin: () => void;
    onRewatch: () => void;
    onReset: () => void;
    onPlayAgain: () => void;
    playAgainText?: string;
    currentView: 0 | 1 | 2;

    // Game state
    betAmount: number;
    setBetAmount: (amount: number) => void;
    numberOfSpins: number;
    setNumberOfSpins: (spins: number) => void;
    spinsLeft: number;
    isLoading: boolean;
    isSpinning: boolean;
    totalWin: number;
    walletBalance: number;
    stats: SessionStats;
    turboMode: boolean;
    toggleTurbo: () => void;
    isGamePaused?: boolean;
    autoSpinEnabled?: boolean;
    onAutoSpinToggle?: (enabled: boolean) => void;
}

const MAX_SPINS = 50;

const SlotsEngineSetupCard: React.FC<SlotsEngineSetupCardProps> = ({
    game,
    onPlay,
    onSpin,
    onRewatch,
    onReset,
    onPlayAgain,
    playAgainText = "Play Again",
    currentView,
    betAmount,
    setBetAmount,
    numberOfSpins,
    setNumberOfSpins,
    spinsLeft,
    isLoading,
    isSpinning,
    totalWin,
    walletBalance,
    stats,
    turboMode,
    toggleTurbo,
    isGamePaused = false,
    autoSpinEnabled = false,
    onAutoSpinToggle,
}) => {
    const themeColor = game.themeColorBackground;
    const betPerSpin = betAmount / (numberOfSpins || 1);
    const totalBuyIn = betAmount;

    const getTotalPayoutText = () =>
        `${totalWin.toLocaleString([], { minimumFractionDigits: 0, maximumFractionDigits: 3 })} APE`;

    return (
        <Card className="lg:basis-1/3 p-6 flex flex-col">
            {/* -- View 0: Setup -- */}
            {currentView === 0 && (
                <>
                    <CardContent className="font-roboto">
                        {/* Place bet button — mobile */}
                        <Button
                            onClick={onPlay}
                            className="lg:hidden w-full"
                            style={{ backgroundColor: themeColor, borderColor: themeColor }}
                            disabled={betAmount <= 0 || isGamePaused}
                        >
                            Place Your Bet
                        </Button>

                        {/* Bet amount */}
                        <div className="mt-5">
                            <BetAmountInput
                                min={0}
                                max={walletBalance}
                                step={0.1}
                                value={betAmount}
                                onChange={setBetAmount}
                                balance={walletBalance}
                                usdMode={false}
                                setUsdMode={() => {}}
                                disabled={isLoading}
                                themeColorBackground={themeColor}
                            />
                        </div>

                        {/* Number of spins */}
                        <div className="mt-8">
                            <CustomSlider
                                label="Number of Spins"
                                min={1}
                                max={MAX_SPINS}
                                step={1}
                                value={numberOfSpins}
                                onChange={setNumberOfSpins}
                                presets={[5, 10, 25, 50]}
                                themeColor={themeColor}
                            />
                        </div>
                    </CardContent>

                    <div className="grow" />

                    <CardFooter className="mt-8 w-full flex flex-col font-roboto">
                        <div className="w-full flex flex-col items-center gap-2 font-medium text-xs text-[#91989C]">
                            <div className="w-full flex justify-between items-center gap-2">
                                <p>Bet Per Spin</p>
                                <p className="text-right">{betPerSpin.toFixed(3)} APE</p>
                            </div>
                            <div className="w-full flex justify-between items-center gap-2">
                                <p>Total Buy In</p>
                                <p className="text-right">{totalBuyIn.toFixed(3)} APE</p>
                            </div>
                            <div className="w-full flex justify-between items-center gap-2">
                                <p>Wallet Balance</p>
                                <p className="text-right">{walletBalance.toFixed(2)} APE</p>
                            </div>
                        </div>

                        <Button
                            onClick={onPlay}
                            className="hidden lg:flex mt-6 w-full"
                            style={{ backgroundColor: themeColor, borderColor: themeColor }}
                            disabled={betAmount <= 0 || isGamePaused}
                        >
                            Place Your Bet
                        </Button>
                    </CardFooter>
                </>
            )}

            {/* -- View 1: Ongoing -- */}
            {currentView === 1 && (
                <CardContent className="grow font-roboto flex flex-col-reverse lg:flex-col lg:justify-between gap-8">
                    {/* Stats */}
                    <div className="w-full flex flex-col items-center gap-2 font-medium text-xs text-[#91989C]">
                        <div className="w-full flex justify-between items-center gap-2">
                            <p>Bet Per Spin</p>
                            <p className="text-right">{betPerSpin.toFixed(3)} APE</p>
                        </div>
                        <div className="w-full flex justify-between items-center gap-2">
                            <p>Total Buy In</p>
                            <p className="text-right">{totalBuyIn.toFixed(3)} APE</p>
                        </div>
                        <div className="w-full flex justify-between items-center gap-2">
                            <p>Total Payout</p>
                            <p className={`text-right ${totalWin > totalBuyIn ? "text-green-400" : ""}`}>
                                {getTotalPayoutText()}
                            </p>
                        </div>
                    </div>

                    {/* Spins left — desktop */}
                    <div className="hidden lg:block text-center font-nohemia">
                        <p className="text-lg font-medium text-[#91989C]">Spins Left</p>
                        <p
                            className="mt-2 font-semibold text-2xl sm:text-5xl"
                            style={{ color: themeColor }}
                        >
                            {spinsLeft} / {numberOfSpins}
                        </p>
                    </div>

                    {/* Spin button + turbo */}
                    <div className="flex lg:flex-col justify-evenly items-center">
                        {/* Spins left — mobile */}
                        <div className="lg:hidden text-center font-nohemia">
                            <p className="text-lg font-medium text-[#91989C]">Spins Left</p>
                            <p
                                className="mt-2 font-semibold text-2xl sm:text-5xl"
                                style={{ color: themeColor }}
                            >
                                {spinsLeft} / {numberOfSpins}
                            </p>
                        </div>

                        <div className="flex flex-col items-center gap-3">
                            <Button
                                onClick={onSpin}
                                className="w-full min-w-[120px]"
                                style={{ backgroundColor: themeColor, borderColor: themeColor }}
                                disabled={(isSpinning || spinsLeft <= 0) && !autoSpinEnabled}
                            >
                                {autoSpinEnabled ? `Auto Spinning... (${spinsLeft})` : isSpinning ? "Spinning..." : "Spin"}
                            </Button>
                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={autoSpinEnabled}
                                        onChange={(e) => onAutoSpinToggle?.(e.target.checked)}
                                        disabled={spinsLeft <= 0}
                                        className="w-4 h-4 rounded border-[#91989C] accent-amber-500 cursor-pointer"
                                    />
                                    <span className={`text-xs font-medium ${autoSpinEnabled ? "text-amber-400" : "text-[#91989C]"}`}>
                                        Auto Spin
                                    </span>
                                </label>
                                <button
                                    onClick={toggleTurbo}
                                    className={`text-xs px-3 py-1 rounded-full transition-all ${
                                        turboMode
                                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                            : "bg-[#1E2A35] text-[#91989C]"
                                    }`}
                                >
                                    Turbo {turboMode ? "ON" : "OFF"}
                                </button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            )}

            {/* -- View 2: Game Over -- */}
            {currentView === 2 && (
                <CardContent className="grow font-roboto flex flex-col justify-between gap-8">
                    {/* Action buttons — mobile */}
                    <div className="lg:hidden flex flex-col gap-3">
                        <Button
                            className="w-full"
                            style={{ backgroundColor: themeColor, borderColor: themeColor }}
                            onClick={onPlayAgain}
                            disabled={isGamePaused}
                        >
                            {playAgainText}
                        </Button>
                        <Button className="w-full" variant="secondary" onClick={onRewatch}>
                            Rewatch
                        </Button>
                        <Button className="w-full" variant="secondary" onClick={onReset}>
                            Change Bet
                        </Button>
                    </div>

                    {/* Summary */}
                    <div className="text-center">
                        <p
                            className="text-2xl font-bold"
                            style={{ color: totalWin > totalBuyIn ? "#22c55e" : "#ef4444" }}
                        >
                            {totalWin > totalBuyIn ? "Winner!" : "Better luck next time"}
                        </p>
                    </div>

                    <div className="w-full flex flex-col items-center gap-2 font-medium text-xs text-[#91989C]">
                        <div className="w-full flex justify-between items-center gap-2">
                            <p>Total Spins</p>
                            <p className="text-right">{numberOfSpins}</p>
                        </div>
                        <div className="w-full flex justify-between items-center gap-2">
                            <p>Total Buy In</p>
                            <p className="text-right">{totalBuyIn.toFixed(3)} APE</p>
                        </div>
                        <div className="w-full flex justify-between items-center gap-2">
                            <p>Total Payout</p>
                            <p className={`text-right ${totalWin > totalBuyIn ? "text-green-400" : ""}`}>
                                {getTotalPayoutText()}
                            </p>
                        </div>
                        <div className="w-full flex justify-between items-center gap-2">
                            <p>Wallet Balance</p>
                            <p className="text-right">{walletBalance.toFixed(2)} APE</p>
                        </div>
                    </div>

                    {/* Action buttons — desktop */}
                    <CardFooter className="w-full hidden lg:block">
                        <div className="w-full flex flex-col gap-4">
                            <Button
                                className="w-full"
                                style={{ backgroundColor: themeColor, borderColor: themeColor }}
                                onClick={onPlayAgain}
                                disabled={isGamePaused}
                            >
                                {playAgainText}
                            </Button>
                            <Button className="w-full" variant="secondary" onClick={onRewatch}>
                                Rewatch
                            </Button>
                            <Button className="w-full" variant="secondary" onClick={onReset}>
                                Change Bet
                            </Button>
                        </div>
                    </CardFooter>
                </CardContent>
            )}
        </Card>
    );
};

export default SlotsEngineSetupCard;
