'use client';

import { BetSelection, BetResult, BetType } from '@/lib/types';
import { calculateExpectedPayout, calculateActualResult } from '@/lib/calculator/payout';
import { processRefund } from '@/lib/calculator/refund';
import { useState } from 'react';

interface ResultPanelProps {
  betType: BetType;
  selections: BetSelection[];
  unitAmount: number;
  onUnitAmountChange: (amount: number) => void;
}

export default function ResultPanel({ betType, selections, unitAmount, onUnitAmountChange }: ResultPanelProps) {
  const [result, setResult] = useState<BetResult | null>(null);
  const [refundHorses, setRefundHorses] = useState<string>('');
  const [dividend, setDividend] = useState<string>('');

  const { totalPayout, returnRate, totalCost } = calculateExpectedPayout(selections, unitAmount);

  const refundNums = refundHorses
    .split(/[,、\s]+/)
    .map(s => parseInt(s, 10))
    .filter(n => !isNaN(n));

  const refundResult = refundNums.length > 0
    ? processRefund(betType, selections, refundNums, unitAmount)
    : null;

  const effectiveSelections = refundResult ? refundResult.validSelections : selections;
  const effectiveCost = refundResult ? refundResult.newTotalCost : totalCost;

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
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
        <h3 className="text-sm font-bold text-green-800 mb-3">計算結果</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <p className="text-xs text-green-600">買い目点数</p>
            <p className="text-xl font-bold text-green-900">{effectiveSelections.length}<span className="text-sm font-normal">点</span></p>
          </div>
          <div>
            <p className="text-xs text-green-600">合計金額</p>
            <p className="text-xl font-bold text-green-900">{effectiveCost.toLocaleString()}<span className="text-sm font-normal">円</span></p>
          </div>
          {totalPayout > 0 && (
            <>
              <div>
                <p className="text-xs text-green-600">予想払戻金</p>
                <p className="text-xl font-bold text-green-900">{totalPayout.toLocaleString()}<span className="text-sm font-normal">円</span></p>
              </div>
              <div>
                <p className="text-xs text-green-600">予想回収率</p>
                <p className={`text-xl font-bold ${returnRate >= 100 ? 'text-red-600' : 'text-green-900'}`}>
                  {returnRate.toFixed(1)}<span className="text-sm font-normal">%</span>
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 返還馬 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">返還馬（カンマ区切り）</label>
        <input
          type="text"
          value={refundHorses}
          onChange={e => setRefundHorses(e.target.value)}
          placeholder="例: 3, 7"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
        />
        {refundResult && refundResult.refundCount > 0 && (
          <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
            <p className="text-yellow-800">
              返還: {refundResult.refundCount}点 / {refundResult.refundAmount.toLocaleString()}円
            </p>
            <p className="text-yellow-700">
              有効: {refundResult.validSelections.length}点 / {refundResult.newTotalCost.toLocaleString()}円
            </p>
          </div>
        )}
      </div>

      {/* 結果入力 */}
      <div className="border-t pt-4">
        <h3 className="text-sm font-bold text-gray-700 mb-2">レース結果入力</h3>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-xs text-gray-500 mb-1">1着</label>
            <input
              type="number" min={1} max={18}
              onChange={e => setResult(prev => ({ first: parseInt(e.target.value) || 0, second: prev?.second || 0, third: prev?.third }))}
              className="w-full border rounded px-2 py-1.5 text-sm text-center"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">2着</label>
            <input
              type="number" min={1} max={18}
              onChange={e => setResult(prev => ({ first: prev?.first || 0, second: parseInt(e.target.value) || 0, third: prev?.third }))}
              className="w-full border rounded px-2 py-1.5 text-sm text-center"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">3着</label>
            <input
              type="number" min={1} max={18}
              onChange={e => setResult(prev => ({ first: prev?.first || 0, second: prev?.second || 0, third: parseInt(e.target.value) || undefined }))}
              className="w-full border rounded px-2 py-1.5 text-sm text-center"
            />
          </div>
        </div>
        <div className="mt-2">
          <label className="block text-xs text-gray-500 mb-1">配当金（1点あたり）</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={dividend}
              onChange={e => setDividend(e.target.value)}
              placeholder="例: 1250"
              className="w-40 border rounded px-2 py-1.5 text-sm text-right"
            />
            <span className="text-sm text-gray-500">円</span>
          </div>
        </div>

        {result && result.first > 0 && result.second > 0 && (
          <div className="mt-3">
            {(() => {
              const actualResult = calculateActualResult(
                betType,
                effectiveSelections,
                unitAmount,
                { ...result, dividend: parseFloat(dividend) || undefined }
              );
              const isHit = actualResult.hitTickets && actualResult.hitTickets.length > 0;
              return (
                <div className={`rounded-xl p-4 border ${isHit ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                  <h4 className={`text-sm font-bold mb-2 ${isHit ? 'text-red-700' : 'text-gray-600'}`}>
                    {isHit ? '的中!' : 'ハズレ'}
                  </h4>
                  {isHit && actualResult.hitTickets && (
                    <p className="text-sm text-gray-700 mb-1">
                      的中買い目: {actualResult.hitTickets.map(t => t.horses.join('-')).join(', ')}
                    </p>
                  )}
                  {actualResult.actualPayout !== undefined && actualResult.actualPayout > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div>
                        <p className="text-xs text-gray-500">払戻金</p>
                        <p className="font-bold">{actualResult.actualPayout.toLocaleString()}円</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">損益</p>
                        <p className={`font-bold ${(actualResult.profit || 0) >= 0 ? 'text-red-600' : 'text-blue-600'}`}>
                          {(actualResult.profit || 0) >= 0 ? '+' : ''}{(actualResult.profit || 0).toLocaleString()}円
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">回収率</p>
                        <p className={`font-bold ${(actualResult.actualReturn || 0) >= 100 ? 'text-red-600' : 'text-blue-600'}`}>
                          {(actualResult.actualReturn || 0).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
