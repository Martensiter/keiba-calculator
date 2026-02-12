'use client';

import { RaceInfo } from '@/lib/types';

const VENUES = ['東京', '中山', '阪神', '京都', '中京', '小倉', '新潟', '福島', '函館', '札幌'];

interface RaceSetupProps {
  raceInfo: RaceInfo;
  onChange: (info: RaceInfo) => void;
}

export default function RaceSetup({ raceInfo, onChange }: RaceSetupProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">開催地</label>
        <select
          value={raceInfo.venue}
          onChange={e => onChange({ ...raceInfo, venue: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          <option value="">選択してください</option>
          {VENUES.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">レース番号</label>
        <select
          value={raceInfo.raceNumber || ''}
          onChange={e => onChange({ ...raceInfo, raceNumber: parseInt(e.target.value) || 0 })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          <option value="">選択</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map(n => (
            <option key={n} value={n}>{n}R</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">レース名（任意）</label>
        <input
          type="text"
          value={raceInfo.raceName || ''}
          onChange={e => onChange({ ...raceInfo, raceName: e.target.value })}
          placeholder="例: 有馬記念"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>
    </div>
  );
}
