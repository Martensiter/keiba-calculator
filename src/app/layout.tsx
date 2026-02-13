import type { Metadata, Viewport } from 'next';
import './globals.css';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { AnalyticsScripts } from '@/components/analytics/AnalyticsScripts';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://keiba-calculator.vercel.app';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#15803d',
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: '競馬オッズ計算ツール | 馬券点数・回収率・収支を簡単シミュレーション',
    template: '%s | 競馬オッズ計算ツール',
  },
  description: '競馬の馬券点数・オッズ・回収率を簡単に計算できる無料ツール。単勝・複勝・馬連・馬単・ワイド・3連複・3連単に対応。即PATデータ取り込み・JRA公式オッズ転記機能搭載。BOX・ながし・フォーメーションの点数計算も自動で行えます。',
  keywords: ['競馬', 'オッズ計算', '馬券計算機', '3連単計算', '馬券点数計算', '即PAT', '回収率計算', '馬連', 'ワイド', 'BOX計算', '競馬初心者', '馬券の買い方', 'JRAオッズ', 'フォーメーション計算'],
  openGraph: {
    title: '競馬オッズ計算ツール | 馬券点数・回収率・収支を簡単シミュレーション',
    description: '競馬の馬券点数・オッズ・回収率を簡単に計算。即PATデータ取り込み・JRA公式オッズ転記対応。初心者ガイド付き。',
    type: 'website',
    locale: 'ja_JP',
    siteName: '競馬オッズ計算ツール',
  },
  twitter: {
    card: 'summary_large_image',
    title: '競馬オッズ計算ツール',
    description: '馬券の点数・オッズ・回収率を簡単に計算できる無料ツール。初心者ガイド付き。',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        {/* ダークモードちらつき防止: ページ描画前にクラスを適用 */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('keiba-theme');var d=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches);if(d)document.documentElement.classList.add('dark')}catch(e){}})()` }} />
      </head>
      <body className="bg-(--color-surface) text-(--color-text-primary) min-h-screen transition-colors">
        <AnalyticsScripts />
        <header className="bg-green-700 dark:bg-green-900 text-white shadow-md">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="text-lg font-bold tracking-tight">
              競馬オッズ計算ツール
            </a>
            <div className="flex items-center gap-3">
              <nav className="flex gap-3 text-sm">
                <a href="/beginners" className="hover:text-green-200 transition-colors">はじめての方へ</a>
                <a href="/guide" className="hover:text-green-200 transition-colors">馬券ガイド</a>
                <a href="/glossary" className="hover:text-green-200 transition-colors">用語集</a>
              </nav>
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-6">
          {children}
        </main>
        <footer className="bg-gray-800 dark:bg-gray-950 text-gray-400 mt-12">
          <div className="max-w-5xl mx-auto px-4 py-6 text-sm">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p>&copy; {new Date().getFullYear()} 競馬オッズ計算ツール</p>
              <div className="flex flex-wrap gap-4">
                <a href="/beginners" className="hover:text-white transition-colors">はじめての方へ</a>
                <a href="/guide" className="hover:text-white transition-colors">馬券の買い方ガイド</a>
                <a href="/glossary" className="hover:text-white transition-colors">競馬用語集</a>
                <a href="/privacy" className="hover:text-white transition-colors">プライバシーポリシー</a>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              ※ 当サイトは馬券の購入を推奨するものではありません。馬券購入は自己責任で、20歳以上の方に限られます。
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
