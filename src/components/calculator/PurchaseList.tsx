'use client';

import { BetTicket } from '@/lib/types';

interface PurchaseListProps {
  tickets: BetTicket[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export default function PurchaseList({ tickets, onRemove, onClear }: PurchaseListProps) {
  if (tickets.length === 0) return null;

  const totalInvestment = tickets.reduce((sum, t) => sum + t.totalCost, 0);
  const totalPayout = tickets.reduce((sum, t) => sum + (t.actualPayout || 0), 0);
  const totalProfit = totalPayout - totalInvestment;
  const returnRate = totalInvestment > 0 ? (totalPayout / totalInvestment) * 100 : 0;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b">
        <h3 className="font-bold text-gray-800">購入リスト ({tickets.length}件)</h3>
        <button onClick={onClear} className="text-xs text-red-500 hover:text-red-700">全てクリア</button>
      </div>

      <div className="max-h-60 overflow-y-auto">
        {tickets.map(ticket => (
          <div key={ticket.id} className="flex items-center justify-between px-4 py-2 border-b border-gray-100 text-sm hover:bg-gray-50">
            <div className="flex-1">
              <span className="inline-block bg-green-100 text-green-800 text-xs font-medium rounded px-1.5 py-0.5 mr-2">
                {ticket.betType}
              </span>
              <span className="text-gray-600">
                {ticket.selections.length}点 / {ticket.totalCost.toLocaleString()}円
              </span>
              {ticket.purchaseMethod !== '通常' && (
                <span className="ml-1 text-xs text-gray-400">({ticket.purchaseMethod})</span>
              )}
            </div>
            <button
              onClick={() => onRemove(ticket.id)}
              className="text-gray-400 hover:text-red-500 ml-2"
              aria-label="削除"
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      {/* 合計 */}
      <div className="bg-gray-50 px-4 py-3 border-t">
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
