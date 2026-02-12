'use client';

import { useState } from 'react';
import { BetResult } from '@/lib/types';

interface ResultInputProps {
  onSubmit: (result: BetResult) => void;
  onCancel: () => void;
  maxHorseNumber: number;
}

export default function ResultInput({ onSubmit, onCancel, maxHorseNumber }: ResultInputProps) {
  const [first, setFirst] = useState<string>('');
  const [second, setSecond] = useState<string>('');
  const [third, setThird] = useState<string>('');
  const [firstFrame, setFirstFrame] = useState<string>('');
  const [secondFrame, setSecondFrame] = useState<string>('');
  const [dividend, setDividend] = useState<string>('');
  const [refundHorses, setRefundHorses] = useState<string>('');

  const handleSubmit = () => {
    const firstNum = parseInt(first);
    const secondNum = parseInt(second);
    const thirdNum = third ? parseInt(third) : undefined;
    const firstFrameNum = firstFrame ? parseInt(firstFrame) : undefined;
    const secondFrameNum = secondFrame ? parseInt(secondFrame) : undefined;
    const dividendNum = dividend ? parseInt(dividend) : undefined;
    const refundHorsesArr = refundHorses
      .split(',')
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n));

    if (!firstNum || !secondNum) {
      alert('1着と2着は必須です');
      return;
    }

    const result: BetResult = {
      first: firstNum,
      second: secondNum,
      third: thirdNum,
      firstFrame: firstFrameNum,
      secondFrame: secondFrameNum,
      dividend: dividendNum,
      refundHorses: refundHorsesArr.length > 0 ? refundHorsesArr : undefined,
    };

    onSubmit(result);
  };

  const horseOptions = Array.from({ length: maxHorseNumber }, (_, i) => i + 1);
  const frameOptions = Array.from({ length: 8 }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-(--color-surface-card) rounded-xl shadow-2xl max-w-md w-full p-6">
        <h3 className="text-lg font-bold text-(--color-text-primary) mb-4">レース結果入力</h3>

        <div className="space-y-4">
          {/* 着順入力（馬番） */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">着順（馬番）</p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  1着 <span className="text-red-500">*</span>
                </label>
                <select
                  value={first}
                  onChange={e => setFirst(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
                >
                  <option value="">-</option>
                  {horseOptions.map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  2着 <span className="text-red-500">*</span>
                </label>
                <select
                  value={second}
                  onChange={e => setSecond(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
                >
                  <option value="">-</option>
                  {horseOptions.map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  3着
                </label>
                <select
                  value={third}
                  onChange={e => setThird(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
                >
                  <option value="">-</option>
                  {horseOptions.map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 枠番入力 */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              枠番（枠連の判定に使用）
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">1着枠</label>
                <select
                  value={firstFrame}
                  onChange={e => setFirstFrame(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
                >
                  <option value="">-</option>
                  {frameOptions.map(n => (
                    <option key={n} value={n}>{n}枠</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">2着枠</label>
                <select
                  value={secondFrame}
                  onChange={e => setSecondFrame(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
                >
                  <option value="">-</option>
                  {frameOptions.map(n => (
                    <option key={n} value={n}>{n}枠</option>
                  ))}
                </select>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">枠連の的中判定に必要です。枠連を購入していない場合は空欄でOK</p>
          </div>

          {/* 配当入力 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              配当金（円）
            </label>
            <input
              type="number"
              value={dividend}
              onChange={e => setDividend(e.target.value)}
              placeholder="例: 1280"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-gray-500 mt-1">100円あたりの配当金を入力</p>
          </div>

          {/* 返還馬 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              返還馬（カンマ区切り）
            </label>
            <input
              type="text"
              value={refundHorses}
              onChange={e => setRefundHorses(e.target.value)}
              placeholder="例: 3,7"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-gray-500 mt-1">返還があった馬番を入力（なければ空欄）</p>
          </div>
        </div>

        {/* ボタン */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            確定
          </button>
        </div>
      </div>
    </div>
  );
}
