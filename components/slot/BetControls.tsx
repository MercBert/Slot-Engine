'use client';

interface Props {
  betAmount: number;
  onBetChange: (amount: number) => void;
  onSpin: () => void;
  isSpinning: boolean;
  balance: number;
  betOptions: number[];
}

export function BetControls({ betAmount, onBetChange, onSpin, isSpinning, balance, betOptions }: Props) {
  return (
    <div className="w-full max-w-lg px-4 pb-8 space-y-4">
      {/* Bet Selection */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-purple-300 text-sm mr-2">Bet:</span>
        {betOptions.map((amount) => (
          <button
            key={amount}
            onClick={() => onBetChange(amount)}
            disabled={isSpinning}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium transition-all
              ${betAmount === amount
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                : 'bg-slate-800 text-purple-200 hover:bg-slate-700'
              }
              ${isSpinning ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            ${amount}
          </button>
        ))}
      </div>

      {/* Spin Button */}
      <button
        onClick={onSpin}
        disabled={isSpinning || balance < betAmount}
        className={`
          w-full py-4 rounded-xl text-xl font-bold transition-all
          ${isSpinning
            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
            : balance < betAmount
              ? 'bg-red-900/50 text-red-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98]'
          }
        `}
      >
        {isSpinning ? '⏳ Spinning...' : balance < betAmount ? '💸 Insufficient Balance' : '🎰 SPIN'}
      </button>
    </div>
  );
}
