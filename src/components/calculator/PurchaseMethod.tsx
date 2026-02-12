'use client';

import { BetType, PurchaseMethod as PurchaseMethodType } from '@/lib/types';
import { isPurchaseMethodAvailable, isSingleBet } from '@/lib/calculator/betTypes';

interface PurchaseMethodProps {
  betType: BetType;
  selected: PurchaseMethodType;
  onChange: (method: PurchaseMethodType) => void;
}

const methods: { value: PurchaseMethodType; label: string }[] = [
  { value: '通常', label: '通常' },
  { value: 'ながし', label: 'ながし' },
  { value: 'BOX', label: 'BOX' },
  { value: 'フォーメーション', label: 'フォーメーション' },
];

export default function PurchaseMethod({ betType, selected, onChange }: PurchaseMethodProps) {
  if (isSingleBet(betType)) return null;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">購入方法</label>
      <div className="flex flex-wrap gap-1.5">
        {methods.map(m => {
          const available = isPurchaseMethodAvailable(betType, m.value);
          return (
            <button
              key={m.value}
              onClick={() => available && onChange(m.value)}
              disabled={!available}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                selected === m.value
                  ? 'bg-blue-600 text-white shadow-sm'
                  : available
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-50 text-gray-300 cursor-not-allowed'
              }`}
            >
              {m.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
