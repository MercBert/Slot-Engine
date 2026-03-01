"use client";

import React, { useState, useCallback } from "react";
import type { GameState } from "./types";
import { GAME_CONFIG } from "./config/game-config";
import { ReelGrid } from "./ReelGrid";
import { WinDisplay } from "./WinDisplay";
import { ClusterParticles } from "./ClusterParticles";
import { BigWinOverlay } from "./BigWinOverlay";

interface SlotsEngineWindowProps {
    gameState: GameState;
    betAmount: number;
}

const SlotsEngineWindow: React.FC<SlotsEngineWindowProps> = ({
    gameState,
    betAmount,
}) => {
    const { grid, activeClusters, state, currentWin, totalWin, cascadeDepth } = gameState;
    const [showBigWin, setShowBigWin] = useState(false);

    // Show big win overlay when appropriate
    React.useEffect(() => {
        if (state === 'WIN_DISPLAY' && totalWin >= betAmount * 10) {
            setShowBigWin(true);
        }
    }, [state, totalWin, betAmount]);

    const dismissBigWin = useCallback(() => {
        setShowBigWin(false);
    }, []);

    return (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
            {/* Grid */}
            <div className="relative w-[85%] max-w-[400px] aspect-[6/7]">
                <ReelGrid
                    grid={grid}
                    activeClusters={activeClusters}
                    state={state}
                    cascadeNewCellKeys={gameState.cascadeNewCellKeys}
                    cascadeFallenCells={gameState.cascadeFallenCells}
                />

                {/* Cluster particles */}
                {activeClusters.length > 0 && (state === 'RESOLVING' || state === 'CASCADING') && (
                    <ClusterParticles
                        clusters={activeClusters}
                        state={state}
                        rows={GAME_CONFIG.gridRows}
                        cols={GAME_CONFIG.gridCols}
                    />
                )}
            </div>

            {/* Win display */}
            {(currentWin > 0 || totalWin > 0) && (
                <WinDisplay
                    currentWin={currentWin}
                    totalWin={totalWin}
                    state={state}
                    cascadeDepth={cascadeDepth}
                    betAmount={betAmount}
                />
            )}

            {/* Big win overlay */}
            <BigWinOverlay
                show={showBigWin}
                totalWin={totalWin}
                betAmount={betAmount}
                onDismiss={dismissBigWin}
            />
        </div>
    );
};

export default SlotsEngineWindow;
