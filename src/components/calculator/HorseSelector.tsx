'use client';

import { Horse, BetType, PurchaseMethod, FormationSelection, NagashiSelection } from '@/lib/types';
import { isTripleBet, isSingleBet, isOrderedBet } from '@/lib/calculator/betTypes';

// 枠番の色定義
const FRAME_COLORS: Record<number, string> = {
  1: 'bg-white border-2 border-gray-400 text-gray-800',
  2: 'bg-black text-white',
  3: 'bg-red-600 text-white',
  4: 'bg-blue-600 text-white',
  5: 'bg-yellow-400 text-gray-800',
  6: 'bg-green-600 text-white',
  7: 'bg-orange-500 text-white',
  8: 'bg-pink-400 text-white',
};

interface HorseSelectorProps {
  betType: BetType;
  purchaseMethod: PurchaseMethod;
  horseCount: number;
  horses: Horse[];
  // 通常/BOX用
  selectedHorses: number[];
  onSelectedHorsesChange: (horses: number[]) => void;
  // ながし用
  nagashi: NagashiSelection;
  onNagashiChange: (nagashi: NagashiSelection) => void;
  // フォーメーション用
  formation: FormationSelection;
  onFormationChange: (formation: FormationSelection) => void;
}

function HorseButton({
  num,
  horse,
  selected,
  onClick,
  label,
}: {
  num: number;
  horse?: Horse;
  selected: boolean;
  onClick: () => void;
  label?: string;
}) {
  const frameColor = horse?.frameNumber ? FRAME_COLORS[horse.frameNumber] || '' : '';

  return (
    <button
      onClick={onClick}
      className={`
        relative flex flex-col items-center justify-center w-12 h-14 rounded-lg text-xs font-bold transition-all
        ${selected
          ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-950 shadow-sm'
          : 'bg-gray-50 dark:bg-(--color-surface-elevated) hover:bg-gray-100 dark:hover:bg-gray-700'
        }
      `}
      title={horse?.name || `${num}番`}
    >
      {horse?.frameNumber && (
        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mb-0.5 ${frameColor}`}>
          {horse.frameNumber}
        </span>
      )}
      <span className="text-sm font-bold">{num}</span>
      {horse?.name && (
        <span className="text-[9px] text-gray-500 truncate max-w-[44px]">{horse.name}</span>
      )}
      {label && (
        <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[8px] rounded-full w-3.5 h-3.5 flex items-center justify-center">
          {label}
        </span>
      )}
    </button>
  );
}

export default function HorseSelector({
  betType,
  purchaseMethod,
  horseCount,
  horses,
  selectedHorses,
  onSelectedHorsesChange,
  nagashi,
  onNagashiChange,
  formation,
  onFormationChange,
}: HorseSelectorProps) {
  const nums = Array.from({ length: horseCount }, (_, i) => i + 1);

  const toggleHorse = (num: number, list: number[]): number[] => {
    return list.includes(num) ? list.filter(n => n !== num) : [...list, num];
  };

  // 通常・BOXモード
  if (purchaseMethod === '通常' || purchaseMethod === 'BOX') {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {purchaseMethod === 'BOX' ? 'BOX馬番選択' : '馬番選択'}
        </label>
        <div className="flex flex-wrap gap-1.5">
          {nums.map(num => (
            <HorseButton
              key={num}
              num={num}
              horse={horses.find(h => h.number === num)}
              selected={selectedHorses.includes(num)}
              onClick={() => onSelectedHorsesChange(toggleHorse(num, selectedHorses))}
            />
          ))}
        </div>
      </div>
    );
  }

  // ながしモード
  if (purchaseMethod === 'ながし') {
    return (
      <div className="space-y-3">
        {isOrderedBet(betType) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">軸の位置</label>
            <div className="flex gap-2">
              {(['1着', '2着', ...(isTripleBet(betType) ? ['3着'] as const : [])] as const).map(pos => (
                <button
                  key={pos}
                  onClick={() => onNagashiChange({ ...nagashi, axisPosition: pos })}
                  className={`px-3 py-1 text-sm rounded ${
                    nagashi.axisPosition === pos ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {pos}固定
                </button>
              ))}
            </div>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">軸馬</label>
          <div className="flex flex-wrap gap-1.5">
            {nums.map(num => (
              <HorseButton
                key={num}
                num={num}
                horse={horses.find(h => h.number === num)}
                selected={nagashi.axis.includes(num)}
                onClick={() => onNagashiChange({
                  ...nagashi,
                  axis: toggleHorse(num, nagashi.axis),
                  partner: nagashi.partner.filter(n => n !== num),
                })}
                label={nagashi.axis.includes(num) ? '軸' : undefined}
              />
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">相手馬</label>
          <div className="flex flex-wrap gap-1.5">
            {nums.map(num => (
              <HorseButton
                key={num}
                num={num}
                horse={horses.find(h => h.number === num)}
                selected={nagashi.partner.includes(num)}
                onClick={() => {
                  if (nagashi.axis.includes(num)) return;
                  onNagashiChange({
                    ...nagashi,
                    partner: toggleHorse(num, nagashi.partner),
                  });
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // フォーメーションモード
  if (purchaseMethod === 'フォーメーション') {
    const positions = isTripleBet(betType)
      ? [
          { key: 'first' as const, label: isOrderedBet(betType) ? '1着' : '1頭目' },
          { key: 'second' as const, label: isOrderedBet(betType) ? '2着' : '2頭目' },
          { key: 'third' as const, label: isOrderedBet(betType) ? '3着' : '3頭目' },
        ]
      : [
          { key: 'first' as const, label: isOrderedBet(betType) ? '1着' : '1頭目' },
          { key: 'second' as const, label: isOrderedBet(betType) ? '2着' : '2頭目' },
        ];

    return (
      <div className="space-y-3">
        {positions.map(pos => (
          <div key={pos.key}>
            <label className="block text-sm font-medium text-gray-700 mb-2">{pos.label}</label>
            <div className="flex flex-wrap gap-1.5">
              {nums.map(num => {
                const current = pos.key === 'third'
                  ? formation.third || []
                  : formation[pos.key];
                return (
                  <HorseButton
                    key={num}
                    num={num}
                    horse={horses.find(h => h.number === num)}
                    selected={current.includes(num)}
                    onClick={() => {
                      const updated = toggleHorse(num, current);
                      if (pos.key === 'third') {
                        onFormationChange({ ...formation, third: updated });
                      } else {
                        onFormationChange({ ...formation, [pos.key]: updated });
                      }
                    }}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
