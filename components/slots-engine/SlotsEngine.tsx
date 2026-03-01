"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { bytesToHex } from "viem";
import { toast } from "sonner";
import type { Game } from "@/lib/games";
import { randomBytes } from "@/lib/games";
import GameWindow from "@/components/shared/GameWindow";
import SlotsEngineWindow from "./SlotsEngineWindow";
import SlotsEngineSetupCard from "./SlotsEngineSetupCard";
import { useSlotMachine } from "@/hooks/useSlotMachine";
import { useSessionStats } from "@/hooks/useSessionStats";
import { useTurboMode } from "@/hooks/useTurboMode";

interface SlotsEngineProps {
    game: Game;
}

const SlotsEngine: React.FC<SlotsEngineProps> = ({ game }) => {
    // ── View state ──────────────────────────────────────────────
    const [currentView, setCurrentView] = useState<0 | 1 | 2>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [numberOfSpins, setNumberOfSpins] = useState(10);
    const [currentSpinIndex, setCurrentSpinIndex] = useState(0);
    const [totalSessionBet, setTotalSessionBet] = useState(0);
    const [accumulatedWin, setAccumulatedWin] = useState(0);

    // ── Game ID ─────────────────────────────────────────────────
    const [currentGameId, setCurrentGameId] = useState<bigint>(
        BigInt(bytesToHex(new Uint8Array(randomBytes(32))))
    );

    // ── Game hooks ──────────────────────────────────────────────
    const { turboEnabled, speedMultiplier, toggleTurbo } = useTurboMode();
    const { gameState, spin, setBet, isSpinning } = useSlotMachine(speedMultiplier);
    const { stats, recordSpin } = useSessionStats();

    // ── Derived ─────────────────────────────────────────────────
    const betPerSpin = totalSessionBet / (numberOfSpins || 1);
    const spinsLeft = numberOfSpins - currentSpinIndex;
    const playAgainText = `Play Again (${numberOfSpins} Spins)`;

    // ── Auto-spin ─────────────────────────────────────────────
    const [autoSpinEnabled, setAutoSpinEnabled] = useState(false);
    const autoSpinRef = useRef(false);
    autoSpinRef.current = autoSpinEnabled;

    // ── Track spin completions ──────────────────────────────────
    const prevStateRef = useRef(gameState.state);
    const wasSpinning = useRef(false);
    const autoSpinTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const prev = prevStateRef.current;
        const curr = gameState.state;
        prevStateRef.current = curr;

        // Detect spin completion: was not IDLE, now IDLE
        if (curr === "IDLE" && prev !== "IDLE" && wasSpinning.current) {
            wasSpinning.current = false;

            // Record this spin's win
            const spinWin = gameState.totalWin;
            setAccumulatedWin(prev => prev + spinWin);

            // Record stats
            recordSpin(betPerSpin, spinWin);

            // Advance spin index
            const nextIndex = currentSpinIndex + 1;
            setCurrentSpinIndex(nextIndex);

            // Check if all spins are done
            if (nextIndex >= numberOfSpins) {
                setAutoSpinEnabled(false);
                setTimeout(() => {
                    setCurrentView(2);
                    setGameOver(true);
                }, spinWin > 0 ? 1500 : 800);
            } else if (autoSpinRef.current) {
                // Auto-spin: queue next spin
                const delayMs = spinWin > 0 ? 800 : 400;
                autoSpinTimerRef.current = setTimeout(() => {
                    spin();
                }, delayMs);
            }
        }

        // Track when spinning starts
        if (curr === "SPINNING" && prev === "IDLE") {
            wasSpinning.current = true;
        }
    }, [gameState.state, gameState.totalWin, currentSpinIndex, numberOfSpins, betPerSpin, recordSpin, spin]);

    // Cleanup auto-spin timer on unmount
    useEffect(() => {
        return () => {
            if (autoSpinTimerRef.current) {
                clearTimeout(autoSpinTimerRef.current);
            }
        };
    }, []);

    // When auto-spin is toggled on mid-game and not currently spinning, fire immediately
    const handleAutoSpinToggle = useCallback((enabled: boolean) => {
        setAutoSpinEnabled(enabled);
        if (enabled && !isSpinning && currentSpinIndex < numberOfSpins) {
            spin();
        }
        if (!enabled && autoSpinTimerRef.current) {
            clearTimeout(autoSpinTimerRef.current);
            autoSpinTimerRef.current = null;
        }
    }, [isSpinning, currentSpinIndex, numberOfSpins, spin]);

    // ── Lifecycle functions ──────────────────────────────────────
    const playGame = useCallback(async () => {
        if (gameState.betAmount <= 0) {
            toast.error("Please set a bet amount");
            return;
        }
        if (gameState.balance < gameState.betAmount) {
            toast.error("Insufficient balance");
            return;
        }

        setIsLoading(true);
        setGameOver(false);
        setTotalSessionBet(gameState.betAmount);
        setCurrentSpinIndex(0);
        setAccumulatedWin(0);

        // Simulate transaction
        setTimeout(() => {
            setIsLoading(false);
            setCurrentView(1);
        }, 500);
    }, [gameState.betAmount, gameState.balance]);

    const handleStateAdvance = useCallback(() => {
        if (isSpinning) return;
        if (currentSpinIndex >= numberOfSpins) return;
        spin();
    }, [isSpinning, currentSpinIndex, numberOfSpins, spin]);

    const handleReset = useCallback(() => {
        const newGameId = BigInt(bytesToHex(new Uint8Array(randomBytes(32))));
        setCurrentGameId(newGameId);
        setCurrentView(0);
        setGameOver(false);
        setIsLoading(false);
        setCurrentSpinIndex(0);
        setAccumulatedWin(0);
    }, []);

    const handlePlayAgain = useCallback(async () => {
        const newGameId = BigInt(bytesToHex(new Uint8Array(randomBytes(32))));
        setCurrentGameId(newGameId);
        setGameOver(false);
        setCurrentSpinIndex(0);
        setAccumulatedWin(0);
        setCurrentView(0);

        setTimeout(async () => {
            await playGame();
        }, 100);
    }, [playGame]);

    const handleRewatch = useCallback(() => {
        setCurrentView(1);
        setGameOver(false);
        setCurrentSpinIndex(0);
    }, []);

    // ── Payout for results modal ────────────────────────────────
    const payout = accumulatedWin;
    const shouldShowPNL = accumulatedWin > totalSessionBet;

    return (
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-8 lg:gap-10">
            {/* Game Window */}
            <GameWindow
                game={game}
                currentGameId={currentGameId}
                isLoading={isLoading}
                isGameFinished={gameOver}
                onPlayAgain={handlePlayAgain}
                playAgainText={playAgainText}
                onRewatch={handleRewatch}
                onReset={handleReset}
                betAmount={totalSessionBet}
                payout={payout}
                inReplayMode={false}
                isUserOriginalPlayer={true}
                showPNL={shouldShowPNL}
                isGamePaused={false}
            >
                <SlotsEngineWindow
                    gameState={gameState}
                    betAmount={betPerSpin}
                />
            </GameWindow>

            {/* Setup Card */}
            <SlotsEngineSetupCard
                game={game}
                onPlay={playGame}
                onSpin={handleStateAdvance}
                onRewatch={handleRewatch}
                onReset={handleReset}
                onPlayAgain={handlePlayAgain}
                playAgainText={playAgainText}
                currentView={currentView}
                betAmount={gameState.betAmount}
                setBetAmount={setBet}
                numberOfSpins={numberOfSpins}
                setNumberOfSpins={setNumberOfSpins}
                spinsLeft={spinsLeft}
                isLoading={isLoading}
                isSpinning={isSpinning}
                totalWin={accumulatedWin}
                walletBalance={gameState.balance}
                stats={stats}
                turboMode={turboEnabled}
                toggleTurbo={toggleTurbo}
                autoSpinEnabled={autoSpinEnabled}
                onAutoSpinToggle={handleAutoSpinToggle}
            />
        </div>
    );
};

export default SlotsEngine;
