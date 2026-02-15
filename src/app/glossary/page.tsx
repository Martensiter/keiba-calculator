import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { glossaryData, GlossaryItem } from '@/data/glossary';
import { AdSlot } from '@/components/ads/AdSlot';

export const metadata: Metadata = {
  title: '競馬用語集 | オッズ・買い目計算・馬券用語の辞典',
  description: '競馬の基本用語をカテゴリ別に解説。オッズ・買い目計算・馬券用語（馬連・馬単・ワイド・3連複・3連単）から回収率・JRA用語まで。馬券シミュレーション前に押さえたい用語を網羅。',
  keywords: ['競馬用語', 'オッズ', '買い目計算', '馬連', '馬単', 'ワイド', '3連単', '回収率', '馬券用語'],
};

const categories = ['基本', '馬券', '競馬場', 'レース', '血統', 'その他'] as const;

export default function GlossaryPage() {
  const grouped = categories.reduce((acc, cat) => {
    acc[cat] = glossaryData.filter(item => item.category === cat);
    return acc;
  }, {} as Record<string, GlossaryItem[]>);

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'ホーム', url: '/' },
        { name: '競馬用語集', url: '/glossary' },
      ]} />

      <article className="space-y-8">
        <header>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">競馬用語集</h1>
          <p className="text-gray-600">
            競馬で使われる用語をカテゴリ別に解説しています。馬券購入や予想に役立つ基本用語を押さえましょう。
          </p>
        </header>

        {/* 目次 */}
        <nav className="bg-white rounded-xl shadow-sm border p-4">
          <h2 className="font-bold text-gray-700 mb-2">カテゴリ一覧</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <a
                key={cat}
                href={`#${cat}`}
                className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm hover:bg-green-100 transition-colors"
              >
                {cat}（{grouped[cat]?.length || 0}件）
              </a>
            ))}
          </div>
        </nav>

        {/* 記事内広告（目次後） */}
        <AdSlot format="auto" className="my-4" />

        {/* 用語一覧 */}
        {categories.map(cat => (
          <section key={cat} id={cat} className="scroll-mt-20">
            <h2 className="text-xl font-bold text-gray-900 border-b-2 border-green-600 pb-2 mb-4">{cat}</h2>
            <div className="space-y-3">
              {grouped[cat]?.map(item => (
                <div key={item.term} className="bg-white rounded-xl shadow-sm border p-4">
                  <div className="flex items-baseline gap-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-900">{item.term}</h3>
                    <span className="text-sm text-gray-400">（{item.reading}）</span>
                  </div>
                  <p className="text-sm text-gray-700">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* コンテンツ間広告 */}
        <AdSlot format="auto" className="my-4" />

        {/* CTA */}
        <div className="text-center bg-green-50 rounded-xl p-6 border border-green-200">
          <p className="text-green-800 font-bold mb-2">馬券の計算を始めましょう</p>
          <div className="flex justify-center gap-3">
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
              馬券の買い方ガイド
            </a>
          </div>
        </div>
      </article>
    </>
  );
}
