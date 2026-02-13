import type { Metadata } from 'next';
import { BreadcrumbJsonLd, HowToJsonLd } from '@/components/seo/JsonLd';
import AdBanner from '@/components/ads/AdBanner';
import { AD_SLOTS } from '@/lib/ads/config';

export const metadata: Metadata = {
  title: '馬券の買い方ガイド | 初心者向け競馬馬券入門',
  description: '競馬初心者向けに馬券の種類・買い方・コツを解説。単勝・複勝・馬連・馬単・ワイド・3連複・3連単の特徴と期待値を分かりやすく説明します。',
};

const betGuides = [
  {
    name: '単勝',
    difficulty: 1,
    returnRate: '80%',
    description: '1着になる馬を1頭選ぶ最もシンプルな馬券です。',
    tips: '初心者はまず単勝から始めるのがおすすめ。1番人気の単勝的中率は約30%です。',
    example: '3番の馬が1着なら的中',
  },
  {
    name: '複勝',
    difficulty: 1,
    returnRate: '80%',
    description: '3着以内に入る馬を1頭選びます。単勝より的中率が高い反面、配当は低めです。',
    tips: '的中率が高いため、複勝で回収率100%超えを狙う戦略（複勝転がし）もあります。',
    example: '5番の馬が1〜3着なら的中',
  },
  {
    name: '枠連',
    difficulty: 2,
    returnRate: '77.5%',
    description: '1着と2着の枠番の組み合わせを当てます（順不同）。同枠に2頭以上いる場合、実質的に的中の幅が広がります。',
    tips: '同枠の馬が多い場合に狙い目。8枠に人気馬が2頭いるときなどが好機です。',
    example: '1枠-3枠の馬が1・2着なら的中',
  },
  {
    name: '馬連',
    difficulty: 3,
    returnRate: '77.5%',
    description: '1着と2着の馬番の組み合わせを当てます（順不同）。',
    tips: 'BOX購入で幅広くカバーする方法が人気。5頭BOXで10点です。',
    example: '2番と7番が1・2着（順不問）なら的中',
  },
  {
    name: 'ワイド',
    difficulty: 2,
    returnRate: '77.5%',
    description: '3着以内に入る2頭の組み合わせを当てます（順不同）。馬連より当てやすいのが特徴。',
    tips: '3着以内の3頭中2頭を選べばよいので、最大3通りの的中パターンがあります。',
    example: '1番と4番が3着以内なら的中',
  },
  {
    name: '馬単',
    difficulty: 4,
    returnRate: '75%',
    description: '1着と2着を着順通りに当てます。馬連の順序あり版です。',
    tips: '1着固定で流す「1着ながし」が基本戦略。逃げ馬や追い込み馬の特性を活かせます。',
    example: '2番→7番（2番が1着、7番が2着）なら的中',
  },
  {
    name: '3連複',
    difficulty: 4,
    returnRate: '75%',
    description: '1着〜3着の3頭の組み合わせを当てます（順不同）。',
    tips: '軸1頭ながしが効率的。軸馬1頭+相手6頭で15点に収まります。',
    example: '1番・3番・8番が1〜3着なら的中',
  },
  {
    name: '3連単',
    difficulty: 5,
    returnRate: '72.5%',
    description: '1着〜3着を着順通りに当てます。最高難易度ですが、万馬券以上の高配当が期待できます。',
    tips: 'フォーメーションで効率的に点数を絞るのがコツ。1着2頭×2着4頭×3着6頭で最大48点。',
    example: '5番→2番→9番（着順通り）なら的中',
  },
];

export default function GuidePage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'ホーム', url: '/' },
        { name: '馬券の買い方ガイド', url: '/guide' },
      ]} />
      <HowToJsonLd
        name="馬券の買い方"
        description="競馬初心者向けに馬券の種類と買い方を4ステップで解説します"
        steps={[
          { name: '馬券の種類を選ぶ', text: '単勝・複勝・馬連・馬単・ワイド・3連複・3連単の中から、自分の予想スタイルに合った馬券種を選びます。' },
          { name: '購入方法を決める', text: '通常・BOX・ながし・フォーメーションの中から購入方法を選びます。初心者は通常かBOXがおすすめです。' },
          { name: '馬番を選択する', text: '予想に基づいて馬番を選択します。オッズを参考にしながら、投資額と配当のバランスを考えましょう。' },
          { name: '点数と金額を確認して購入', text: '計算ツールで点数・合計金額・予想回収率を確認し、予算内であることを確認してから購入します。' },
        ]}
      />

      <article className="space-y-8">
        <header>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">馬券の買い方ガイド</h1>
          <p className="text-gray-600">
            競馬初心者の方向けに、馬券の種類と買い方のコツを分かりやすく解説します。
            各馬券種の特徴を理解して、自分に合った買い方を見つけましょう。
          </p>
        </header>

        {/* 馬券種ごとの解説 */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 border-b-2 border-green-600 pb-2">馬券の種類と特徴</h2>

          {betGuides.map(guide => (
            <div key={guide.name} className="bg-white rounded-xl shadow-sm border p-5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900">{guide.name}</h3>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-500">
                    難易度:
                    <span className="ml-1 text-yellow-500">
                      {'★'.repeat(guide.difficulty)}{'☆'.repeat(5 - guide.difficulty)}
                    </span>
                  </span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                    還元率 {guide.returnRate}
                  </span>
                </div>
              </div>
              <p className="text-gray-700 mb-3">{guide.description}</p>
              <div className="bg-green-50 rounded-lg p-3 mb-2">
                <p className="text-sm text-green-800"><strong>例:</strong> {guide.example}</p>
              </div>
              <p className="text-sm text-gray-600"><strong>コツ:</strong> {guide.tips}</p>
            </div>
          ))}
        </section>

        {/* 記事内広告（馬券種解説後） */}
        <AdBanner slot={AD_SLOTS.inArticle} className="my-4" />

        {/* 購入方法の解説 */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 border-b-2 border-green-600 pb-2">購入方法の種類</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-sm border p-5">
              <h3 className="font-bold text-gray-900 mb-2">通常購入</h3>
              <p className="text-sm text-gray-600">1点ずつ買い目を選択する基本の購入方法。少点数で狙いたい場合に適しています。</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-5">
              <h3 className="font-bold text-gray-900 mb-2">BOX購入</h3>
              <p className="text-sm text-gray-600">選択した馬の全組み合わせを購入。軸が決まらない場合に便利ですが点数が増えやすいです。</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-5">
              <h3 className="font-bold text-gray-900 mb-2">ながし購入</h3>
              <p className="text-sm text-gray-600">軸馬を決めて相手馬との組み合わせを購入。自信のある馬がいる場合に効率的です。</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-5">
              <h3 className="font-bold text-gray-900 mb-2">フォーメーション購入</h3>
              <p className="text-sm text-gray-600">各着順の候補を個別に設定。最も柔軟で、3連単での効率的な購入に最適です。</p>
            </div>
          </div>
        </section>

        {/* 回収率の考え方 */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 border-b-2 border-green-600 pb-2">回収率の考え方</h2>
          <div className="bg-white rounded-xl shadow-sm border p-5 space-y-3">
            <p className="text-gray-700">
              回収率は「払戻金 ÷ 投資額 × 100」で計算します。100%を超えればプラス収支、下回ればマイナス収支です。
            </p>
            <div className="bg-blue-50 rounded-lg p-4 text-sm">
              <p className="font-bold text-blue-800 mb-2">例: 回収率の計算</p>
              <p className="text-blue-700">投資額 3,000円 で 払戻金 5,000円 の場合:</p>
              <p className="text-blue-700">回収率 = 5,000 ÷ 3,000 × 100 = <strong>166.7%</strong></p>
            </div>
            <p className="text-gray-700">
              JRAの控除率は馬券種によって20%〜27.5%。長期的に利益を出すには、控除率を上回る予想精度が求められます。
            </p>
          </div>
        </section>

        {/* コンテンツ間広告 */}
        <AdBanner slot={AD_SLOTS.contentRectangle} className="my-4" />

        {/* JRAオッズの見方 */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 border-b-2 border-green-600 pb-2">JRA公式サイトでオッズを確認する方法</h2>
          <div className="bg-white rounded-xl shadow-sm border p-5 space-y-4">
            <p className="text-gray-700">
              JRA公式サイト（<a href="https://www.jra.go.jp/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">jra.go.jp</a>）では、
              レースごとの最新オッズを確認できます。当ツールの「JRAオッズ一括入力」機能を使えば、オッズ表をコピペするだけで取り込み可能です。
            </p>

            <div className="bg-blue-50 rounded-lg p-4">
              <p className="font-bold text-blue-800 text-sm mb-2">確認手順</p>
              <ol className="space-y-2 text-sm text-blue-700">
                <li className="flex gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <span>JRA公式サイトの「オッズ」メニューからレースを選択</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <span>確認したい馬券種のタブを選択（馬連・馬単・3連単など）</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  <span>表示されたオッズ表をドラッグで選択し、コピー（Ctrl+C / ⌘+C）</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                  <span>当ツールの「JRAオッズ一括入力」ボタンから貼り付け</span>
                </li>
              </ol>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
              <strong>注意:</strong> JRAのオッズは投票締切まで変動します。最終確定オッズはレース発走後に確認できます。
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center bg-green-50 rounded-xl p-6 border border-green-200">
          <p className="text-green-800 font-bold mb-2">早速計算してみましょう</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="/"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors"
            >
              計算ツールを使う
            </a>
            <a
              href="/beginners"
              className="inline-block bg-white text-green-700 border border-green-600 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition-colors"
            >
              はじめての方へ
            </a>
          </div>
        </div>
      </article>
    </>
  );
}
