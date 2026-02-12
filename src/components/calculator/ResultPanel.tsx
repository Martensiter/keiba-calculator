'use client';

import { BetSelection } from '@/lib/types';
import { calculateExpectedPayout } from '@/lib/calculator/payout';

interface ResultPanelProps {
  selections: BetSelection[];
  unitAmount: number;
  onUnitAmountChange: (amount: number) => void;
}

export default function ResultPanel({ selections, unitAmount, onUnitAmountChange }: ResultPanelProps) {
  const { totalPayout, returnRate, totalCost } = calculateExpectedPayout(selections, unitAmount);

  return (
    <div className="space-y-4">
      {/* 1点金額 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">1点あたりの金額</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={100}
            step={100}
            value={unitAmount}
            onChange={e => onUnitAmountChange(Math.max(100, parseInt(e.target.value) || 100))}
            className="w-32 border border-gray-300 rounded-lg px-3 py-2 text-sm text-right focus:ring-2 focus:ring-green-500"
          />
          <span className="text-sm text-gray-600">円</span>
          <div className="flex gap-1 ml-2">
            {[100, 200, 300, 500, 1000].map(amt => (
              <button
                key={amt}
                onClick={() => onUnitAmountChange(amt)}
                className={`px-2 py-1 text-xs rounded ${
                  unitAmount === amt ? 'bg-green-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {amt >= 1000 ? `${amt / 1000}k` : amt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 計算結果 */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 rounded-xl p-4 border border-green-200 dark:border-green-800">
        <h3 className="text-sm font-bold text-green-800 dark:text-green-300 mb-3">計算結果</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <p className="text-xs text-green-600 dark:text-green-400">買い目点数</p>
            <p className="text-xl font-bold text-green-900 dark:text-green-100">{selections.length}<span className="text-sm font-normal">点</span></p>
          </div>
          <div>
            <p className="text-xs text-green-600 dark:text-green-400">合計金額</p>
            <p className="text-xl font-bold text-green-900 dark:text-green-100">{totalCost.toLocaleString()}<span className="text-sm font-normal">円</span></p>
          </div>
          {totalPayout > 0 && (
            <>
              <div>
                <p className="text-xs text-green-600 dark:text-green-400">予想払戻金</p>
                <p className="text-xl font-bold text-green-900 dark:text-green-100">{totalPayout.toLocaleString()}<span className="text-sm font-normal">円</span></p>
              </div>
              <div>
                <p className="text-xs text-green-600 dark:text-green-400">予想回収率</p>
                <p className={`text-xl font-bold ${returnRate >= 100 ? 'text-red-600 dark:text-red-400' : 'text-green-900 dark:text-green-100'}`}>
                  {returnRate.toFixed(1)}<span className="text-sm font-normal">%</span>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
