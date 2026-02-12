import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '競馬オッズ計算ツール | 馬券点数・回収率計算機',
  description: '競馬の馬券点数・オッズ・回収率を簡単に計算できる無料ツール。単勝・複勝・馬連・馬単・ワイド・3連複・3連単に対応。即PATデータ取り込み機能搭載。BOX・ながし・フォーメーションの点数計算も自動で行えます。',
  keywords: ['競馬', 'オッズ計算', '馬券計算機', '3連単計算', '馬券点数計算', '即PAT', '回収率計算', '馬連', 'ワイド', 'BOX計算'],
  openGraph: {
    title: '競馬オッズ計算ツール | 馬券点数・回収率計算機',
    description: '競馬の馬券点数・オッズ・回収率を簡単に計算。即PATデータ取り込み対応。',
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    title: '競馬オッズ計算ツール',
    description: '馬券の点数・オッズ・回収率を簡単に計算できる無料ツール',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <header className="bg-green-700 text-white shadow-md">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="text-lg font-bold tracking-tight">
              競馬オッズ計算ツール
            </a>
            <nav className="flex gap-4 text-sm">
              <a href="/guide" className="hover:text-green-200 transition-colors">馬券ガイド</a>
              <a href="/glossary" className="hover:text-green-200 transition-colors">用語集</a>
            </nav>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-6">
          {children}
        </main>
        <footer className="bg-gray-800 text-gray-400 mt-12">
          <div className="max-w-5xl mx-auto px-4 py-6 text-sm">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
              <p>&copy; 2025 競馬オッズ計算ツール</p>
              <div className="flex gap-4">
                <a href="/guide" className="hover:text-white transition-colors">馬券の買い方ガイド</a>
                <a href="/glossary" className="hover:text-white transition-colors">競馬用語集</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
