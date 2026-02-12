'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { parseOddsText } from '@/lib/ipat/oddsParser';
import { parseHistoryText } from '@/lib/ipat/historyParser';
import { parseRaceInfoText } from '@/lib/ipat/raceInfoParser';
import { Horse, IpatHistoryData, BetType } from '@/lib/types';

type ImportTab = 'odds' | 'history' | 'raceInfo';

interface IpatImporterProps {
  onOddsImport: (data: { betType: BetType | null; odds: { key: string; value: number }[] }) => void;
  onHistoryImport: (data: IpatHistoryData[]) => void;
  onRaceInfoImport: (horses: Horse[], raceName?: string, venue?: string, raceNumber?: number) => void;
}

export default function IpatImporter({ onOddsImport, onHistoryImport, onRaceInfoImport }: IpatImporterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<ImportTab>('odds');
  const [text, setText] = useState('');
  const [step, setStep] = useState<'input' | 'preview'>('input');

  // プレビューデータ
  const [oddsPreview, setOddsPreview] = useState<{ betType: BetType | null; odds: { key: string; value: number }[] } | null>(null);
  const [historyPreview, setHistoryPreview] = useState<IpatHistoryData[] | null>(null);
  const [raceInfoPreview, setRaceInfoPreview] = useState<{ horses: Horse[]; raceName?: string; venue?: string; raceNumber?: number } | null>(null);

  const handleParse = () => {
    if (!text.trim()) return;

    if (tab === 'odds') {
      const result = parseOddsText(text);
      setOddsPreview(result);
    } else if (tab === 'history') {
      const result = parseHistoryText(text);
      setHistoryPreview(result);
    } else {
      const result = parseRaceInfoText(text);
      setRaceInfoPreview(result);
    }
    setStep('preview');
  };

  const handleConfirm = () => {
    if (tab === 'odds' && oddsPreview) {
      onOddsImport(oddsPreview);
    } else if (tab === 'history' && historyPreview) {
      onHistoryImport(historyPreview);
    } else if (tab === 'raceInfo' && raceInfoPreview) {
      onRaceInfoImport(raceInfoPreview.horses, raceInfoPreview.raceName, raceInfoPreview.venue, raceInfoPreview.raceNumber);
    }
    handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
    setText('');
    setStep('input');
    setOddsPreview(null);
    setHistoryPreview(null);
    setRaceInfoPreview(null);
  };

  const tabs: { value: ImportTab; label: string; description: string }[] = [
    { value: 'odds', label: 'オッズ', description: '即PATのオッズ一覧画面からコピーしたテキストを貼り付けてください' },
    { value: 'history', label: '投票履歴', description: '即PATの購入履歴画面からコピーしたテキストを貼り付けてください' },
    { value: 'raceInfo', label: '出馬表', description: '即PATの出馬表画面からコピーしたテキストを貼り付けてください' },
  ];

  const currentTab = tabs.find(t => t.value === tab)!;

  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setIsOpen(true)}>
        即PAT取り込み
      </Button>

      <Modal isOpen={isOpen} onClose={handleClose} title="即PATデータ取り込み">
        {/* タブ */}
        <div className="flex gap-1 mb-4">
          {tabs.map(t => (
            <button
              key={t.value}
              onClick={() => { setTab(t.value); setStep('input'); setText(''); }}
              className={`px-3 py-1.5 text-sm rounded-lg ${
                tab === t.value ? 'bg-green-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {step === 'input' ? (
          <>
            <p className="text-sm text-gray-600 mb-3">{currentTab.description}</p>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              rows={10}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-green-500"
              placeholder="テキストを貼り付け..."
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="secondary" onClick={handleClose}>キャンセル</Button>
              <Button onClick={handleParse} disabled={!text.trim()}>解析する</Button>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-sm font-bold text-gray-700 mb-2">プレビュー</h3>

            {/* オッズプレビュー */}
            {tab === 'odds' && oddsPreview && (
              <div className="max-h-60 overflow-y-auto border rounded-lg">
                {oddsPreview.betType && (
                  <p className="px-3 py-2 bg-gray-50 text-sm">馬券種: <strong>{oddsPreview.betType}</strong></p>
                )}
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-3 py-1">組み合わせ</th>
                      <th className="text-right px-3 py-1">オッズ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {oddsPreview.odds.map((o, i) => (
                      <tr key={i} className="border-t">
                        <td className="px-3 py-1 font-mono">{o.key}</td>
                        <td className="px-3 py-1 text-right">{o.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {oddsPreview.odds.length === 0 && (
                  <p className="px-3 py-4 text-center text-gray-400">オッズデータが検出されませんでした</p>
                )}
              </div>
            )}

            {/* 履歴プレビュー */}
            {tab === 'history' && historyPreview && (
              <div className="max-h-60 overflow-y-auto border rounded-lg">
                {historyPreview.map((h, i) => (
                  <div key={i} className="px-3 py-2 border-b text-sm">
                    <span className="font-medium">{h.raceName}</span>
                    <span className="ml-2 text-green-700">{h.betType}</span>
                    <span className="ml-2 font-mono">{h.selections.join(', ')}</span>
                    <span className="ml-2 text-gray-600">{h.amount.toLocaleString()}円</span>
                  </div>
                ))}
                {historyPreview.length === 0 && (
                  <p className="px-3 py-4 text-center text-gray-400">履歴データが検出されませんでした</p>
                )}
              </div>
            )}

            {/* 出馬表プレビュー */}
            {tab === 'raceInfo' && raceInfoPreview && (
              <div className="max-h-60 overflow-y-auto border rounded-lg">
                {raceInfoPreview.raceName && (
                  <p className="px-3 py-2 bg-gray-50 text-sm">
                    {raceInfoPreview.venue}{raceInfoPreview.raceNumber}R {raceInfoPreview.raceName}
                  </p>
                )}
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-center px-2 py-1 w-10">枠</th>
                      <th className="text-center px-2 py-1 w-10">馬番</th>
                      <th className="text-left px-2 py-1">馬名</th>
                      <th className="text-left px-2 py-1">騎手</th>
                    </tr>
                  </thead>
                  <tbody>
                    {raceInfoPreview.horses.map(h => (
                      <tr key={h.number} className="border-t">
                        <td className="text-center px-2 py-1">{h.frameNumber || '-'}</td>
                        <td className="text-center px-2 py-1 font-bold">{h.number}</td>
                        <td className="px-2 py-1">{h.name || '-'}</td>
                        <td className="px-2 py-1 text-gray-600">{h.jockey || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {raceInfoPreview.horses.length === 0 && (
                  <p className="px-3 py-4 text-center text-gray-400">出馬表データが検出されませんでした</p>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="secondary" onClick={() => setStep('input')}>戻る</Button>
              <Button onClick={handleConfirm}>確定</Button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
