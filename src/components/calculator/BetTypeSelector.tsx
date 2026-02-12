'use client';

import { BetType } from '@/lib/types';
import { BET_TYPES } from '@/lib/calculator/betTypes';

interface BetTypeSelectorProps {
  selected: BetType;
  onChange: (betType: BetType) => void;
}

const betTypeOrder: BetType[] = ['単勝', '複勝', '枠連', '馬連', 'ワイド', '馬単', '3連複', '3連単'];

export default function BetTypeSelector({ selected, onChange }: BetTypeSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">馬券種</label>
      <div className="flex flex-wrap gap-1.5">
        {betTypeOrder.map(type => (
          <button
            key={type}
            onClick={() => onChange(type)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              selected === type
                ? 'bg-green-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {BET_TYPES[type].displayName}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-1.5">{BET_TYPES[selected].description}</p>
    </div>
  );
}
