'use client';

import { BetSelection } from '@/lib/types';

interface OddsInputProps {
  selections: BetSelection[];
  onOddsChange: (index: number, odds: number | undefined) => void;
}

export default function OddsInput({ selections, onOddsChange }: OddsInputProps) {
  if (selections.length === 0) return null;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        オッズ入力（任意）
      </label>
      <div className="max-h-60 overflow-y-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="text-left px-3 py-2 font-medium text-gray-600">買い目</th>
              <th className="text-right px-3 py-2 font-medium text-gray-600 w-28">オッズ</th>
            </tr>
          </thead>
          <tbody>
            {selections.map((sel, i) => (
              <tr key={i} className="border-t border-gray-100">
                <td className="px-3 py-1.5 font-mono text-gray-800">
                  {sel.horses.join(' - ')}
                </td>
                <td className="px-3 py-1.5">
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    value={sel.odds ?? ''}
                    onChange={e => {
                      const v = parseFloat(e.target.value);
                      onOddsChange(i, isNaN(v) ? undefined : v);
                    }}
                    placeholder="--"
                    className="w-full text-right border border-gray-200 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
