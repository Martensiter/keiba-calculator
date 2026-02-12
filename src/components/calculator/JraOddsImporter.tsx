'use client';

import { useState } from 'react';
import { BetType, BetSelection } from '@/lib/types';
import { parseJraOddsText, JraOddsResult } from '@/lib/jra/oddsParser';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface JraOddsImporterProps {
  betType: BetType;
  selections: BetSelection[];
  onOddsApply: (updatedSelections: BetSelection[]) => void;
}

export default function JraOddsImporter({ betType, selections, onOddsApply }: JraOddsImporterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const [step, setStep] = useState<'guide' | 'input' | 'preview'>('guide');
  const [parseResult, setParseResult] = useState<JraOddsResult | null>(null);
  const [matchCount, setMatchCount] = useState(0);

  const handleParse = () => {
    if (!text.trim()) return;
    const result = parseJraOddsText(text);
    setParseResult(result);

    // 現在の買い目とマッチングして件数をカウント
    let matched = 0;
    for (const sel of selections) {
      const key = sel.horses.join('-');
      const found = result.odds.find(o => o.key === key);
      if (found) matched++;
    }
    setMatchCount(matched);
    setStep('preview');
  };

  const handleApply = () => {
    if (!parseResult) return;

    const oddsMap = new Map(parseResult.odds.map(o => [o.key, o.value]));
    const updated = selections.map(sel => {
      const key = sel.horses.join('-');
      const odds = oddsMap.get(key);
      return odds !== undefined ? { ...sel, odds } : sel;
    });

    onOddsApply(updated);
    handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
    setText('');
    setStep('guide');
    setParseResult(null);
    setMatchCount(0);
  };

  // JRA公式サイトでのオッズ確認手順ガイド
  const jraGuideSteps = [
    {
      step: 1,
      title: 'JRA公式サイトにアクセス',
      description: (
        <>
          <a
            href="https://www.jra.go.jp/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            JRA公式サイト
          </a>
          にアクセスし、「オッズ」メニューを選択します。
        </>
      ),
    },
    {
      step: 2,
      title: 'レースを選択',
      description: '開催場・レース番号を選び、確認したい馬券種のオッズを表示します。',
    },
    {
      step: 3,
      title: 'オッズ表をコピー',
      description: '表示されたオッズ一覧をマウスで範囲選択し、Ctrl+C（Mac: ⌘+C）でコピーします。',
    },
    {
      step: 4,
      title: '下のテキストエリアに貼り付け',
      description: '「次へ」をクリックしてテキストエリアに Ctrl+V（Mac: ⌘+V）で貼り付け、「解析」ボタンを押します。',
    },
  ];

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        disabled={selections.length === 0}
        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
      >
        <span className="mr-1">📋</span>
        JRAオッズ一括入力
      </Button>

      <Modal isOpen={isOpen} onClose={handleClose} title="JRAオッズ一括入力">
        {/* ステップ: ガイド */}
        {step === 'guide' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-blue-800 mb-2">JRA公式サイトからオッズを転記する方法</h3>
              <p className="text-sm text-blue-700 mb-3">
                JRA公式サイトに表示されるオッズ表をコピー＆ペーストするだけで、一括でオッズを取り込めます。
              </p>
              <ol className="space-y-3">
                {jraGuideSteps.map(s => (
                  <li key={s.step} className="flex gap-3">
                    <span className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {s.step}
                    </span>
                    <div>
                      <p className="font-medium text-blue-900 text-sm">{s.title}</p>
                      <p className="text-xs text-blue-700 mt-0.5">{s.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 text-sm mb-2">対応している形式の例</h4>
              <div className="bg-white rounded border p-3 font-mono text-xs text-gray-600 space-y-1">
                <p className="text-gray-400">-- 馬連・ワイド・枠連 --</p>
                <p>1 - 2 &nbsp; 15.3</p>
                <p>1 - 3 &nbsp; 8.7</p>
                <p className="text-gray-400 mt-2">-- 馬単 --</p>
                <p>1 → 2 &nbsp; 25.0</p>
                <p className="text-gray-400 mt-2">-- 3連単 --</p>
                <p>1 → 2 → 3 &nbsp; 500.0</p>
                <p className="text-gray-400 mt-2">-- 単勝・複勝 --</p>
                <p>1 &nbsp; 2.5</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500">
                現在の買い目: <strong>{selections.length}点</strong>（{betType}）
              </p>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={handleClose}>閉じる</Button>
                <Button onClick={() => setStep('input')}>次へ → テキスト入力</Button>
              </div>
            </div>
          </div>
        )}

        {/* ステップ: テキスト入力 */}
        {step === 'input' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              JRA公式サイトからコピーしたオッズテキストを貼り付けてください。
              馬券種は自動検出しますが、現在の設定（<strong>{betType}</strong>）が優先されます。
            </p>

            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              rows={12}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={`ここにオッズテキストを貼り付け...\n\n例:\n1 - 2  15.3\n1 - 3  8.7\n2 - 3  12.1`}
              autoFocus
            />

            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep('guide')}>← ガイドに戻る</Button>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={handleClose}>キャンセル</Button>
                <Button onClick={handleParse} disabled={!text.trim()}>解析する</Button>
              </div>
            </div>
          </div>
        )}

        {/* ステップ: プレビュー */}
        {step === 'preview' && parseResult && (
          <div className="space-y-4">
            {/* 解析結果サマリー */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                <p className="text-xs text-green-600">検出オッズ数</p>
                <p className="text-xl font-bold text-green-800">{parseResult.odds.length}</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                <p className="text-xs text-blue-600">買い目とマッチ</p>
                <p className="text-xl font-bold text-blue-800">{matchCount}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-600">未マッチ</p>
                <p className="text-xl font-bold text-gray-800">{selections.length - matchCount}</p>
              </div>
            </div>

            {parseResult.betType && parseResult.betType !== betType && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                ⚠️ テキストから検出された馬券種「{parseResult.betType}」と現在の設定「{betType}」が異なります。
                現在の設定のまま適用します。
              </div>
            )}

            {/* オッズ一覧テーブル */}
            {parseResult.odds.length > 0 ? (
              <div className="max-h-60 overflow-y-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="text-left px-3 py-2 font-medium text-gray-600">組み合わせ</th>
                      <th className="text-right px-3 py-2 font-medium text-gray-600">オッズ</th>
                      <th className="text-center px-3 py-2 font-medium text-gray-600 w-20">状態</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parseResult.odds.map((o, i) => {
                      const isMatched = selections.some(
                        sel => sel.horses.join('-') === o.key
                      );
                      return (
                        <tr key={i} className={`border-t border-gray-100 ${isMatched ? 'bg-green-50' : ''}`}>
                          <td className="px-3 py-1.5 font-mono text-gray-800">{o.key}</td>
                          <td className="px-3 py-1.5 text-right font-mono">{o.value.toFixed(1)}</td>
                          <td className="px-3 py-1.5 text-center">
                            {isMatched ? (
                              <span className="text-green-600 text-xs font-medium">✓ 反映</span>
                            ) : (
                              <span className="text-gray-400 text-xs">--</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-700 font-medium">オッズデータを検出できませんでした</p>
                <p className="text-red-600 text-sm mt-1">テキスト形式を確認して再度お試しください</p>
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep('input')}>← テキストを修正</Button>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={handleClose}>キャンセル</Button>
                <Button
                  onClick={handleApply}
                  disabled={matchCount === 0}
                >
                  {matchCount}件のオッズを反映する
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

