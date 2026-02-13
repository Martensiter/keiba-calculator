import type { Metadata } from 'next';
import { BreadcrumbJsonLd, HowToJsonLd, ArticleJsonLd } from '@/components/seo/JsonLd';
import AdBanner from '@/components/ads/AdBanner';
import { AD_SLOTS } from '@/lib/ads/config';

export const metadata: Metadata = {
  title: 'はじめての方へ | 競馬初心者向けガイド',
  description: '競馬初心者の方へ。馬券の仕組み・買い方・計算ツールの使い方をゼロからわかりやすく解説。初めての馬券購入を安心してサポートします。',
  alternates: { canonical: '/beginners' },
};

const steps = [
  {
    icon: '🏇',
    title: '競馬の基本を知ろう',
    content: [
      '競馬はレースに出走する馬の着順を予想するスポーツです。',
      'JRA（日本中央競馬会）が主催する中央競馬では、毎週土日にレースが開催されます。',
      '1レースは通常8〜18頭の馬が出走し、各馬には「馬番」と「枠番」が割り当てられます。',
    ],
    details: [
      { label: '馬番', text: '出走する馬に割り当てられる番号（1〜18番）' },
      { label: '枠番', text: '馬番をグループ分けした番号（1〜8枠）。各枠は色で表示されます' },
      { label: 'オッズ', text: '馬券が的中した時の払戻倍率。人気の馬ほど低くなります' },
    ],
  },
  {
    icon: '🎫',
    title: '馬券の種類を理解しよう',
    content: [
      '馬券には8種類あり、難易度と配当のバランスが異なります。',
      '初心者は「単勝」「複勝」から始めるのがおすすめです。',
    ],
    betTypes: [
      { name: '単勝', desc: '1着を当てる', difficulty: '★☆☆☆☆', rec: true },
      { name: '複勝', desc: '3着以内を当てる', difficulty: '★☆☆☆☆', rec: true },
      { name: 'ワイド', desc: '3着以内の2頭を当てる', difficulty: '★★☆☆☆', rec: true },
      { name: '馬連', desc: '1-2着の組み合わせ', difficulty: '★★★☆☆', rec: false },
      { name: '枠連', desc: '1-2着の枠番組み合わせ', difficulty: '★★☆☆☆', rec: false },
      { name: '馬単', desc: '1-2着を順番通り', difficulty: '★★★★☆', rec: false },
      { name: '3連複', desc: '1-3着の3頭組み合わせ', difficulty: '★★★★☆', rec: false },
      { name: '3連単', desc: '1-3着を順番通り', difficulty: '★★★★★', rec: false },
    ],
  },
  {
    icon: '🧮',
    title: '計算ツールを使ってみよう',
    content: [
      'このツールを使えば、馬券の点数や合計金額を自動で計算できます。',
      '購入前に「いくらかかるか」「回収率はどのくらいか」を確認することで、計画的な馬券購入が可能になります。',
    ],
    toolSteps: [
      { step: 1, text: 'レース設定で開催地・レース番号を選択' },
      { step: 2, text: '馬券種を選択（初心者は単勝・複勝がおすすめ）' },
      { step: 3, text: '馬番を選択' },
      { step: 4, text: '計算結果で点数・金額を確認' },
      { step: 5, text: '必要に応じてオッズを入力して予想回収率を確認' },
    ],
  },
  {
    icon: '💰',
    title: '予算管理のコツ',
    content: [
      '競馬を長く楽しむためには、適切な予算管理が重要です。',
    ],
    tips: [
      { title: '予算を決めてから始める', text: '1日の上限金額を事前に決め、それを超えないようにしましょう。' },
      { title: '回収率を意識する', text: '計算ツールで回収率を確認し、100%を超える買い方を目指しましょう。' },
      { title: 'トリガミに注意', text: '点数を増やしすぎると、的中しても投資額を下回る「トリガミ」になることがあります。' },
      { title: '記録をつける', text: '購入リスト機能を使って収支を記録すると、傾向が見えてきます。' },
    ],
  },
];

export default function BeginnersPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'ホーム', url: '/' },
        { name: 'はじめての方へ', url: '/beginners' },
      ]} />
      <HowToJsonLd
        name="競馬のはじめ方"
        description="競馬初心者向けに、馬券の仕組みと買い方をゼロから解説します"
        steps={[
          { name: '競馬の基本を知る', text: '馬番・枠番・オッズなどの基本概念を理解します' },
          { name: '馬券の種類を理解する', text: '8種類の馬券種の中から自分に合ったものを選びます' },
          { name: '計算ツールを使う', text: '点数や金額を計算ツールで確認してから購入します' },
          { name: '予算管理を行う', text: '収支を記録し、計画的に楽しみます' },
        ]}
      />
      <ArticleJsonLd
        title="はじめての方へ | 競馬初心者向けガイド"
        description="競馬初心者の方へ。馬券の仕組み・買い方・計算ツールの使い方をゼロから解説。"
        datePublished="2025-01-01"
        dateModified="2026-02-12"
      />

      <article className="space-y-10">
        <header className="text-center py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">はじめての方へ</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            競馬は難しそう？ 大丈夫です。<br />
            このページでは、馬券の仕組みから計算ツールの使い方まで、ゼロから分かりやすく解説します。
          </p>
        </header>

        {/* 目次 */}
        <nav className="bg-white rounded-xl shadow-sm border p-5">
          <h2 className="font-bold text-gray-800 mb-3">このページの内容</h2>
          <ol className="space-y-2">
            {steps.map((s, i) => (
              <li key={i}>
                <a
                  href={`#step-${i + 1}`}
                  className="flex items-center gap-2 text-green-700 hover:text-green-900 transition-colors"
                >
                  <span className="text-lg">{s.icon}</span>
                  <span className="text-sm font-medium">STEP {i + 1}: {s.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* 記事内広告（目次後） */}
        <AdBanner slot={AD_SLOTS.inArticle} className="my-6" />

        {/* 各ステップ */}
        {steps.map((step, i) => (
          <section key={i} id={`step-${i + 1}`} className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{step.icon}</span>
              <div>
                <p className="text-xs text-green-600 font-bold">STEP {i + 1}</p>
                <h2 className="text-xl font-bold text-gray-900">{step.title}</h2>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-5 space-y-4">
              {step.content.map((text, j) => (
                <p key={j} className="text-gray-700">{text}</p>
              ))}

              {/* 基本用語 */}
              {step.details && (
                <div className="grid sm:grid-cols-3 gap-3 mt-3">
                  {step.details.map(d => (
                    <div key={d.label} className="bg-gray-50 rounded-lg p-3">
                      <p className="font-bold text-gray-800 text-sm">{d.label}</p>
                      <p className="text-xs text-gray-600 mt-1">{d.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* 馬券種一覧 */}
              {step.betTypes && (
                <div className="grid sm:grid-cols-2 gap-2 mt-3">
                  {step.betTypes.map(bt => (
                    <div
                      key={bt.name}
                      className={`rounded-lg p-3 border ${
                        bt.rec ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-sm">{bt.name}</span>
                        <span className="text-yellow-500 text-xs">{bt.difficulty}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">{bt.desc}</p>
                      {bt.rec && (
                        <span className="inline-block mt-1 text-[10px] bg-green-600 text-white px-1.5 py-0.5 rounded font-medium">
                          初心者おすすめ
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* ツールの使い方ステップ */}
              {step.toolSteps && (
                <ol className="space-y-2 mt-3">
                  {step.toolSteps.map(ts => (
                    <li key={ts.step} className="flex items-center gap-3 bg-green-50 rounded-lg p-3">
                      <span className="flex-shrink-0 w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {ts.step}
                      </span>
                      <p className="text-sm text-gray-800">{ts.text}</p>
                    </li>
                  ))}
                </ol>
              )}

              {/* 予算管理のコツ */}
              {step.tips && (
                <div className="grid sm:grid-cols-2 gap-3 mt-3">
                  {step.tips.map(tip => (
                    <div key={tip.title} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="font-bold text-yellow-900 text-sm">{tip.title}</p>
                      <p className="text-xs text-yellow-800 mt-1">{tip.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        ))}

        {/* コンテンツ間広告 */}
        <AdBanner slot={AD_SLOTS.contentRectangle} className="my-6" />

        {/* 注意事項 */}
        <section className="bg-red-50 border border-red-200 rounded-xl p-5">
          <h2 className="font-bold text-red-800 mb-2">ご注意ください</h2>
          <ul className="space-y-1.5 text-sm text-red-700">
            <li>・ 馬券の購入は20歳以上の方に限られます</li>
            <li>・ 馬券は余裕資金の範囲内で楽しみましょう</li>
            <li>・ JRAの控除率（20〜27.5%）のため、長期的には負けやすい設計です</li>
            <li>・ 当サイトは馬券購入を推奨するものではありません</li>
          </ul>
        </section>

        {/* CTA */}
        <div className="text-center bg-green-50 rounded-xl p-8 border border-green-200">
          <p className="text-green-800 font-bold text-lg mb-2">準備ができたら計算してみましょう</p>
          <p className="text-green-700 text-sm mb-4">
            計算ツールで点数と金額を確認してから購入すれば安心です。
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="/"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors"
            >
              計算ツールを使う
            </a>
            <a
              href="/guide"
              className="inline-block bg-white text-green-700 border border-green-600 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition-colors"
            >
              馬券の種類を詳しく見る
            </a>
            <a
              href="/glossary"
              className="inline-block bg-white text-green-700 border border-green-600 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition-colors"
            >
              用語集を見る
            </a>
          </div>
        </div>
      </article>
    </>
  );
}

