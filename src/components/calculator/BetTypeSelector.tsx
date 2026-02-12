'use client';

import { useState } from 'react';
import { BetType } from '@/lib/types';
import { BET_TYPES } from '@/lib/calculator/betTypes';

interface BetTypeSelectorProps {
  selected: BetType;
  onChange: (betType: BetType) => void;
}

const betTypeOrder: BetType[] = ['単勝', '複勝', '応援馬券', '枠連', '馬連', 'ワイド', '馬単', '3連複', '3連単'];

// 馬券種ごとの詳細説明（初心者向け）
const betTypeHelp: Record<BetType, {
  howTo: string;
  difficulty: number;
  returnRate: string;
  example: string;
  tip: string;
}> = {
  '単勝': {
    howTo: '1着になる馬を1頭選びます',
    difficulty: 1,
    returnRate: '80%',
    example: '3番の馬が1着 → 的中！',
    tip: '初心者はまずここから。1番人気の的中率は約30%です。',
  },
  '複勝': {
    howTo: '3着以内に入る馬を1頭選びます',
    difficulty: 1,
    returnRate: '80%',
    example: '5番の馬が3着 → 的中！',
    tip: '的中率が最も高い馬券。配当は低めですが堅実です。',
  },
  '応援馬券': {
    howTo: '応援したい馬の単勝と複勝をセットで購入します',
    difficulty: 1,
    returnRate: '80%',
    example: '3番を応援 → 単勝(1着的中)+複勝(3着以内的中)の2点購入',
    tip: '好きな馬を応援しながら、単勝と複勝の両方で的中チャンスがあります。',
  },
  '枠連': {
    howTo: '1着と2着の枠番の組み合わせを当てます（順不同）',
    difficulty: 2,
    returnRate: '77.5%',
    example: '1枠・3枠が1-2着 → 的中！',
    tip: '同枠に2頭以上いると的中しやすくなります。',
  },
  '馬連': {
    howTo: '1着と2着の馬番の組み合わせを当てます（順不同）',
    difficulty: 3,
    returnRate: '77.5%',
    example: '2番・7番が1-2着(順不問) → 的中！',
    tip: 'BOX買いで幅広くカバーするのが人気の買い方です。',
  },
  'ワイド': {
    howTo: '3着以内に入る2頭の組み合わせを当てます（順不同）',
    difficulty: 2,
    returnRate: '77.5%',
    example: '1番・4番が3着以内 → 的中！',
    tip: '最大3組の的中パターンがあり、馬連より当てやすいです。',
  },
  '馬単': {
    howTo: '1着と2着を着順通りに当てます',
    difficulty: 4,
    returnRate: '75%',
    example: '2番→7番（2番が1着、7番が2着） → 的中！',
    tip: '1着固定の「ながし」が効率的。逃げ馬を軸にするのも手です。',
  },
  '3連複': {
    howTo: '1〜3着の3頭の組み合わせを当てます（順不同）',
    difficulty: 4,
    returnRate: '75%',
    example: '1番・3番・8番が1〜3着 → 的中！',
    tip: '軸1頭ながしが効率的。軸1頭+相手6頭で15点です。',
  },
  '3連単': {
    howTo: '1〜3着を着順通りに当てます',
    difficulty: 5,
    returnRate: '72.5%',
    example: '5番→2番→9番（着順通り） → 的中！',
    tip: '最高難易度ですが万馬券以上が期待できます。フォーメーションで点数を絞りましょう。',
  },
};

export default function BetTypeSelector({ selected, onChange }: BetTypeSelectorProps) {
  const [showHelp, setShowHelp] = useState(false);
  const help = betTypeHelp[selected];

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <label className="text-sm font-medium text-gray-700">馬券種</label>
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-0.5"
          aria-label="馬券種の説明を表示"
        >
          <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">?</span>
          <span>{showHelp ? '閉じる' : 'この馬券とは？'}</span>
        </button>
      </div>

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

      {/* インラインヘルプパネル */}
      {showHelp && (
        <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2 animate-in">
          <div className="flex items-start justify-between">
            <h4 className="font-bold text-blue-900">{selected}とは？</h4>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-yellow-500">
                {'★'.repeat(help.difficulty)}{'☆'.repeat(5 - help.difficulty)}
              </span>
              <span className="bg-blue-100 px-2 py-0.5 rounded text-blue-700 text-xs">
                還元率 {help.returnRate}
              </span>
            </div>
          </div>
          <p className="text-sm text-blue-800">{help.howTo}</p>
          <div className="bg-white rounded-lg p-2.5 border border-blue-100">
            <p className="text-xs text-blue-600 font-medium">的中例</p>
            <p className="text-sm text-blue-900">{help.example}</p>
          </div>
          <p className="text-xs text-blue-700">💡 <strong>コツ:</strong> {help.tip}</p>
          <a
            href="/guide"
            className="inline-block text-xs text-blue-600 hover:text-blue-800 underline"
          >
            → 全馬券種の詳しい解説を見る
          </a>
        </div>
      )}
    </div>
  );
}
