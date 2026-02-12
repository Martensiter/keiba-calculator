'use client';

import { useState } from 'react';
import { BetTicket, BetResult } from '@/lib/types';
import { calculateActualResult, checkHit } from '@/lib/calculator/payout';
import ResultInput from './ResultInput';

interface PurchaseListProps {
  tickets: BetTicket[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onUpdateResult: (id: string, result: BetResult, actualPayout: number) => void;
}

export default function PurchaseList({ tickets, onRemove, onClear, onUpdateResult }: PurchaseListProps) {
  const [showResultInput, setShowResultInput] = useState<string | null>(null);
  if (tickets.length === 0) return null;

  const totalInvestment = tickets.reduce((sum, t) => sum + t.totalCost, 0);
  const totalPayout = tickets.reduce((sum, t) => sum + (t.actualPayout || 0), 0);
  const totalProfit = totalPayout - totalInvestment;
  const returnRate = totalInvestment > 0 ? (totalPayout / totalInvestment) * 100 : 0;

  return (
    <div className="border border-(--color-border) rounded-xl overflow-hidden">
      <div className="flex items-center justify-between bg-gray-50 dark:bg-(--color-surface-elevated) px-4 py-3 border-b border-(--color-border)">
        <h3 className="font-bold text-(--color-text-primary)">購入リスト ({tickets.length}件)</h3>
        <button onClick={onClear} className="text-xs text-red-500 hover:text-red-700">全てクリア</button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {tickets.map(ticket => {
          const hasResult = !!ticket.result;
          const hitCount = hasResult
            ? ticket.selections.filter(sel => checkHit(ticket.betType, sel, ticket.result!)).length
            : 0;

          return (
            <div key={ticket.id} className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 ${hasResult && hitCount > 0 ? 'bg-yellow-50' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-block bg-green-100 text-green-800 text-xs font-medium rounded px-1.5 py-0.5">
                      {ticket.betType}
                    </span>
                    <span className="text-sm text-gray-600">
                      {ticket.selections.length}点 / {ticket.totalCost.toLocaleString()}円
                    </span>
                    {ticket.purchaseMethod !== '通常' && (
                      <span className="text-xs text-gray-400">({ticket.purchaseMethod})</span>
                    )}
                    {hasResult && hitCount > 0 && (
                      <span className="inline-block bg-red-100 text-red-800 text-xs font-bold rounded px-1.5 py-0.5">
                        的中 {hitCount}点
                      </span>
                    )}
                    {hasResult && hitCount === 0 && (
                      <span className="inline-block bg-gray-100 text-gray-600 text-xs rounded px-1.5 py-0.5">
                        不的中
                      </span>
                    )}
                  </div>

                  {/* 結果表示 */}
                  {hasResult && (
                    <div className="text-xs text-gray-600 mt-1">
                      結果: {ticket.result!.first}着-{ticket.result!.second}着
                      {ticket.result!.third && `-${ticket.result!.third}着`}
                      {ticket.result!.dividend && (
                        <span className="ml-2">配当: {ticket.result!.dividend.toLocaleString()}円</span>
                      )}
                      {ticket.actualPayout !== undefined && ticket.actualPayout > 0 && (
                        <span className="ml-2 font-bold text-red-600">
                          払戻: {ticket.actualPayout.toLocaleString()}円
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 ml-2">
                  {!hasResult && (
                    <button
                      onClick={() => setShowResultInput(ticket.id)}
                      className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                    >
                      結果入力
                    </button>
                  )}
                  <button
                    onClick={() => onRemove(ticket.id)}
                    className="text-gray-400 hover:text-red-500 text-xl leading-none px-1"
                    aria-label="削除"
                  >
                    &times;
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 結果入力モーダル */}
      {showResultInput && (
        <ResultInput
          maxHorseNumber={18}
          onSubmit={result => {
            const ticket = tickets.find(t => t.id === showResultInput);
            if (ticket) {
              const calcResult = calculateActualResult(
                ticket.betType,
                ticket.selections,
                ticket.unitAmount,
                result
              );
              onUpdateResult(showResultInput, result, calcResult.actualPayout || 0);
            }
            setShowResultInput(null);
          }}
          onCancel={() => setShowResultInput(null)}
        />
      )}

      {/* 合計 */}
      <div className="bg-gray-50 dark:bg-(--color-surface-elevated) px-4 py-3 border-t border-(--color-border)">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
          <div>
            <p className="text-xs text-gray-500">総投資額</p>
            <p className="font-bold">{totalInvestment.toLocaleString()}円</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">総払戻金</p>
            <p className="font-bold">{totalPayout.toLocaleString()}円</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">損益</p>
            <p className={`font-bold ${totalProfit >= 0 ? 'text-red-600' : 'text-blue-600'}`}>
              {totalProfit >= 0 ? '+' : ''}{totalProfit.toLocaleString()}円
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">回収率</p>
            <p className={`font-bold ${returnRate >= 100 ? 'text-red-600' : 'text-blue-600'}`}>
              {totalPayout > 0 ? returnRate.toFixed(1) : '--'}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
