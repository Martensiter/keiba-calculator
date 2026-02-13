'use client';

import { useState, useCallback, useEffect } from 'react';
import { BetType, PurchaseMethod, Horse, BetSelection, BetTicket, FormationSelection, NagashiSelection, IpatHistoryData, BetResult } from '@/lib/types';
import { isSingleBet } from '@/lib/calculator/betTypes';
import { calculateBoxTickets, calculateNagashiTickets, calculateFormationTickets } from '@/lib/calculator/combinations';
import RaceSetup from '@/components/calculator/RaceSetup';
import BetTypeSelector from '@/components/calculator/BetTypeSelector';
import PurchaseMethodComp from '@/components/calculator/PurchaseMethod';
import HorseSelector from '@/components/calculator/HorseSelector';
import OddsInput from '@/components/calculator/OddsInput';
import ResultPanel from '@/components/calculator/ResultPanel';
import PurchaseList from '@/components/calculator/PurchaseList';
import IpatImporter from '@/components/ipat/IpatImporter';
import JraOddsImporter from '@/components/calculator/JraOddsImporter';
import { WebApplicationJsonLd, FAQPageJsonLd } from '@/components/seo/JsonLd';
import { AdSlot } from '@/components/ads/AdSlot';

const STORAGE_KEY = 'keiba-calculator-state';

const FAQ_DATA = [
  { question: '馬券の点数計算はどのように行いますか？', answer: 'BOXは組み合わせの数（nCr）、ながしは軸馬×相手馬の数、フォーメーションは各着順の選択馬番の組み合わせから重複を除いた数で計算します。' },
  { question: '即PATのデータを取り込むにはどうすればいいですか？', answer: '即PATの画面（オッズ一覧・購入履歴・出馬表）からテキストをコピーし、「即PAT取り込み」ボタンから貼り付けることでデータを自動解析します。' },
  { question: 'JRA公式サイトからオッズを取り込むには？', answer: 'JRA公式サイトのオッズ一覧をコピーし、「JRAオッズ一括入力」ボタンから貼り付けることで、現在の買い目にオッズを一括反映できます。' },
  { question: '回収率とは何ですか？', answer: '回収率は払戻金÷投資金額×100で計算されます。100%を超えれば利益、下回れば損失です。' },
  { question: 'マルチとは何ですか？', answer: 'ながし購入時に「マルチ」を選択すると、軸馬と相手馬を入れ替えた組み合わせも自動で追加されます。点数は増えますが、的中の可能性が広がります。' },
  { question: '返還馬があった場合はどうなりますか？', answer: '返還馬を含む買い目は自動で除外され、該当分の金額が返還されます。有効な買い目数と合計金額が再計算されます。' },
  { question: '競馬初心者ですが使えますか？', answer: 'はい。「はじめての方へ」ページで基本を学び、馬券種選択時の「?」ボタンで各馬券の説明を確認できます。まずは単勝・複勝から始めることをおすすめします。' },
];

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export default function CalculatorPage() {
  const [raceInfo, setRaceInfo] = useState<{ venue: string; raceNumber: number; raceName?: string; horses: Horse[] }>({ venue: '', raceNumber: 0, horses: [] });
  const [betType, setBetType] = useState<BetType>('馬連');
  const [purchaseMethod, setPurchaseMethod] = useState<PurchaseMethod>('通常');
  const [horseCount, setHorseCount] = useState(18);
  const [unitAmount, setUnitAmount] = useState(100);

  // 選択状態
  const [selectedHorses, setSelectedHorses] = useState<number[]>([]);
  const [nagashi, setNagashi] = useState<NagashiSelection>({ axis: [], partner: [], axisPosition: '1着' });
  const [formation, setFormation] = useState<FormationSelection>({ first: [], second: [], third: [] });
  const [isMulti, setIsMulti] = useState(false); // マルチ（軸・相手入替）

  // 計算された買い目
  const [currentSelections, setCurrentSelections] = useState<BetSelection[]>([]);

  // 購入リスト
  const [tickets, setTickets] = useState<BetTicket[]>([]);

  // 馬券種変更時にリセット
  const handleBetTypeChange = useCallback((newType: BetType) => {
    setBetType(newType);
    setSelectedHorses([]);
    setNagashi({ axis: [], partner: [], axisPosition: '1着' });
    setFormation({ first: [], second: [], third: [] });
    setCurrentSelections([]);
    if (isSingleBet(newType)) {
      setPurchaseMethod('通常');
    } else if (purchaseMethod === '通常' && !isSingleBet(newType)) {
      // keep current
    }
  }, [purchaseMethod]);

  // 購入方法変更時にリセット
  const handlePurchaseMethodChange = useCallback((method: PurchaseMethod) => {
    setPurchaseMethod(method);
    setSelectedHorses([]);
    setNagashi({ axis: [], partner: [], axisPosition: '1着' });
    setFormation({ first: [], second: [], third: [] });
    setCurrentSelections([]);
    setIsMulti(false);
  }, []);

  // 選択リセット
  const handleResetSelection = useCallback(() => {
    setSelectedHorses([]);
    setNagashi({ axis: [], partner: [], axisPosition: '1着' });
    setFormation({ first: [], second: [], third: [] });
    setCurrentSelections([]);
    setIsMulti(false);
  }, []);

  // 買い目の自動計算
  useEffect(() => {
    let result: { count: number; selections: BetSelection[] } = { count: 0, selections: [] };

    if (purchaseMethod === '通常') {
      if (betType === '応援馬券') {
        // 応援馬券: 1頭につき単勝+複勝の2点
        const sels = selectedHorses.flatMap(h => [
          { horses: [h] },
          { horses: [h] },
        ]);
        result = { count: sels.length, selections: sels };
      } else if (isSingleBet(betType)) {
        result = { count: selectedHorses.length, selections: selectedHorses.map(h => ({ horses: [h] })) };
      } else {
        // 通常モードでは選択された馬番からの直接入力（ここではBOXと同じ計算をする）
        result = calculateBoxTickets(betType, selectedHorses);
      }
    } else if (purchaseMethod === 'BOX') {
      result = calculateBoxTickets(betType, selectedHorses);
    } else if (purchaseMethod === 'ながし') {
      if (nagashi.axis.length > 0 && nagashi.partner.length > 0) {
        result = calculateNagashiTickets(betType, nagashi);
        // マルチ: 軸と相手を入れ替えた買い目も追加
        if (isMulti) {
          const reversed: NagashiSelection = {
            axis: nagashi.partner,
            partner: nagashi.axis,
            axisPosition: nagashi.axisPosition,
          };
          const multiResult = calculateNagashiTickets(betType, reversed);
          // 重複除去して合算
          const seen = new Set(result.selections.map(s => s.horses.join('-')));
          for (const sel of multiResult.selections) {
            const key = sel.horses.join('-');
            if (!seen.has(key)) {
              seen.add(key);
              result.selections.push(sel);
            }
          }
          result.count = result.selections.length;
        }
      }
    } else if (purchaseMethod === 'フォーメーション') {
      if (formation.first.length > 0 && formation.second.length > 0) {
        result = calculateFormationTickets(betType, formation);
      }
    }

    setCurrentSelections(result.selections);
  }, [betType, purchaseMethod, selectedHorses, nagashi, formation, isMulti]);

  // 購入リストに追加
  const addToList = () => {
    if (currentSelections.length === 0) return;
    const ticket: BetTicket = {
      id: generateId(),
      betType,
      purchaseMethod,
      selections: currentSelections,
      unitAmount,
      totalCost: currentSelections.length * unitAmount,
    };
    setTickets(prev => [...prev, ticket]);
  };

  // 購入リストから削除
  const removeTicket = (id: string) => {
    setTickets(prev => prev.filter(t => t.id !== id));
  };

  // 結果更新
  const updateTicketResult = (id: string, result: BetResult, actualPayout: number) => {
    setTickets(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, result, actualPayout }
          : t
      )
    );
  };

  // 即PATインポートハンドラ
  const handleOddsImport = (data: { betType: BetType | null; odds: { key: string; value: number }[] }) => {
    if (data.betType) setBetType(data.betType);
    // オッズを現在の買い目にマッピング
    setCurrentSelections(prev =>
      prev.map(sel => {
        const key = sel.horses.join('-');
        const found = data.odds.find(o => o.key === key);
        return found ? { ...sel, odds: found.value } : sel;
      })
    );
  };

  const handleHistoryImport = (data: IpatHistoryData[]) => {
    // 履歴データからチケットを作成
    const newTickets: BetTicket[] = data.map(h => ({
      id: generateId(),
      betType: h.betType,
      purchaseMethod: '通常' as PurchaseMethod,
      selections: h.selections.map(s => ({
        horses: s.split('-').map(Number),
      })),
      unitAmount: h.amount,
      totalCost: h.amount,
    }));
    setTickets(prev => [...prev, ...newTickets]);
  };

  const handleRaceInfoImport = (horses: Horse[], raceName?: string, venue?: string, raceNumber?: number) => {
    setRaceInfo(prev => ({
      ...prev,
      horses,
      raceName: raceName || prev.raceName,
      venue: venue || prev.venue,
      raceNumber: raceNumber || prev.raceNumber,
    }));
    if (horses.length > 0) {
      setHorseCount(Math.max(...horses.map(h => h.number)));
    }
  };

  // localStorage保存
  useEffect(() => {
    try {
      const state = { raceInfo, tickets, horseCount };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [raceInfo, tickets, horseCount]);

  // localStorage復元
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const state = JSON.parse(saved);
        if (state.raceInfo) setRaceInfo(state.raceInfo);
        if (state.tickets) setTickets(state.tickets);
        if (state.horseCount) setHorseCount(state.horseCount);
      }
    } catch {}
  }, []);

  return (
    <>
      <WebApplicationJsonLd />
      <FAQPageJsonLd faqs={FAQ_DATA} />

      <div className="space-y-6">
        {/* タイトル・説明 */}
        <section>
          <h1 className="text-2xl font-bold text-(--color-text-primary) mb-2">競馬オッズ計算ツール</h1>
          <p className="text-sm text-(--color-text-secondary) mb-2">
            馬券の点数・合計金額・回収率をリアルタイムで計算。BOX・ながし・フォーメーションに対応。
            即PATデータ取り込み・JRA公式オッズ転記にも対応しています。
          </p>
          <p className="text-xs text-(--color-text-muted) italic">
            ※ 当サイトは馬券の購入を推奨しません。馬券購入は自己責任で、20歳以上の方に限られます。
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <a href="/beginners" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline">はじめての方はこちら →</a>
            <a href="/guide" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline">馬券の買い方ガイド →</a>
          </div>
        </section>

        {/* レース設定 */}
        <section className="bg-white dark:bg-(--color-surface-card) rounded-xl shadow-sm border border-(--color-border) p-4 space-y-4">
          <h2 className="text-lg font-bold">レース設定</h2>
          <RaceSetup raceInfo={raceInfo} onChange={setRaceInfo} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">出走頭数</label>
            <select
              value={horseCount}
              onChange={e => setHorseCount(parseInt(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
            >
              {Array.from({ length: 18 }, (_, i) => i + 1).map(n => (
                <option key={n} value={n}>{n}頭</option>
              ))}
            </select>
          </div>
        </section>

        {/* 馬券種・購入方法 */}
        <section className="bg-white dark:bg-(--color-surface-card) rounded-xl shadow-sm border border-(--color-border) p-4 space-y-4">
          <BetTypeSelector selected={betType} onChange={handleBetTypeChange} />
          <PurchaseMethodComp betType={betType} selected={purchaseMethod} onChange={handlePurchaseMethodChange} />
        </section>

        {/* 馬番選択 */}
        <section className="bg-white dark:bg-(--color-surface-card) rounded-xl shadow-sm border border-(--color-border) p-4 space-y-3">
          <HorseSelector
            betType={betType}
            purchaseMethod={purchaseMethod}
            horseCount={horseCount}
            horses={raceInfo.horses}
            selectedHorses={selectedHorses}
            onSelectedHorsesChange={setSelectedHorses}
            nagashi={nagashi}
            onNagashiChange={setNagashi}
            formation={formation}
            onFormationChange={setFormation}
          />
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-3">
              {/* マルチオプション（ながし時のみ） */}
              {purchaseMethod === 'ながし' && (
                <label className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isMulti}
                    onChange={e => setIsMulti(e.target.checked)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span>マルチ（軸・相手入替）</span>
                  <span className="text-xs text-gray-400" title="軸と相手を入れ替えた組み合わせも購入">?</span>
                </label>
              )}
            </div>
            <button
              onClick={handleResetSelection}
              className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors"
            >
              選択をリセット
            </button>
          </div>
        </section>

        {/* オッズ入力 */}
        {currentSelections.length > 0 && currentSelections.length <= 100 && (
          <section className="bg-white dark:bg-(--color-surface-card) rounded-xl shadow-sm border border-(--color-border) p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-(--color-text-primary)">オッズ入力</label>
              <div className="flex items-center gap-2">
                <IpatImporter
                  onOddsImport={handleOddsImport}
                  onHistoryImport={handleHistoryImport}
                  onRaceInfoImport={handleRaceInfoImport}
                />
                <JraOddsImporter
                  betType={betType}
                  selections={currentSelections}
                  onOddsApply={setCurrentSelections}
                />
              </div>
            </div>
            <OddsInput
              selections={currentSelections}
              onOddsChange={(index, odds) => {
                setCurrentSelections(prev =>
                  prev.map((sel, i) => i === index ? { ...sel, odds } : sel)
                );
              }}
            />
          </section>
        )}

        {/* 計算結果 */}
        <section className="bg-white dark:bg-(--color-surface-card) rounded-xl shadow-sm border border-(--color-border) p-4">
          <ResultPanel
            selections={currentSelections}
            unitAmount={unitAmount}
            onUnitAmountChange={setUnitAmount}
          />
        </section>

        {/* 広告（AdSense審査通過後に表示。環境変数設定時のみ） */}
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID && (
          <AdSlot format="auto" className="my-4" />
        )}

        {/* 購入リストに追加 */}
        {currentSelections.length > 0 && (
          <div className="flex justify-center">
            <button
              onClick={addToList}
              className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
            >
              購入リストに追加
            </button>
          </div>
        )}

        {/* 購入リスト */}
        <section>
          <PurchaseList
            tickets={tickets}
            onRemove={removeTicket}
            onClear={() => setTickets([])}
            onUpdateResult={updateTicketResult}
          />
        </section>

        {/* FAQ */}
        <section className="bg-white dark:bg-(--color-surface-card) rounded-xl shadow-sm border border-(--color-border) p-6">
          <h2 className="text-lg font-bold mb-4">よくある質問</h2>
          <dl className="space-y-4">
            {FAQ_DATA.map((faq, i) => (
              <div key={i}>
                <dt className="font-medium text-(--color-text-primary)">{faq.question}</dt>
                <dd className="mt-1 text-sm text-(--color-text-secondary)">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </>
  );
}
