/**
 * 広告設定
 * 
 * Google AdSense を使用する場合:
 * 1. 環境変数 NEXT_PUBLIC_ADSENSE_CLIENT_ID に pub-XXXXXXXXXXXXXXXX を設定
 * 2. 各スロットの adSlot に AdSense 広告ユニットの ID を設定
 * 
 * 開発環境ではプレースホルダーが表示されます。
 */

// 広告の表示サイズ
export type AdSize = 'banner' | 'rectangle' | 'leaderboard' | 'large-mobile-banner' | 'in-article';

// 広告スロットの設定
export interface AdSlotConfig {
  id: string;
  size: AdSize;
  adSlot?: string;        // AdSense 広告ユニット ID
  label?: string;         // 表示ラベル（「スポンサーリンク」等）
  showOnMobile?: boolean; // モバイルで表示するか
  showOnDesktop?: boolean;// デスクトップで表示するか
}

// 広告サイズの定義（幅 x 高さ）
export const AD_SIZES: Record<AdSize, { width: number; height: number; responsive?: boolean }> = {
  banner: { width: 468, height: 60 },
  rectangle: { width: 336, height: 280 },
  leaderboard: { width: 728, height: 90, responsive: true },
  'large-mobile-banner': { width: 320, height: 100, responsive: true },
  'in-article': { width: 0, height: 0, responsive: true }, // ネイティブ広告（サイズ自動）
};

// AdSense クライアント ID（環境変数から取得）
export const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || '';

// 広告が有効かどうか
export const isAdsEnabled = (): boolean => {
  return !!ADSENSE_CLIENT_ID;
};

// プリセットの広告スロット
export const AD_SLOTS = {
  // ヘッダー下バナー
  headerBanner: {
    id: 'header-banner',
    size: 'leaderboard' as AdSize,
    adSlot: process.env.NEXT_PUBLIC_AD_SLOT_HEADER || '',
    label: 'スポンサーリンク',
    showOnMobile: true,
    showOnDesktop: true,
  },
  // コンテンツ間レクタングル（メインページ内）
  contentRectangle: {
    id: 'content-rectangle',
    size: 'rectangle' as AdSize,
    adSlot: process.env.NEXT_PUBLIC_AD_SLOT_CONTENT || '',
    label: '広告',
    showOnMobile: true,
    showOnDesktop: true,
  },
  // 記事内広告（ガイド・用語集ページ）
  inArticle: {
    id: 'in-article',
    size: 'in-article' as AdSize,
    adSlot: process.env.NEXT_PUBLIC_AD_SLOT_ARTICLE || '',
    label: '広告',
    showOnMobile: true,
    showOnDesktop: true,
  },
  // フッター上バナー
  footerBanner: {
    id: 'footer-banner',
    size: 'leaderboard' as AdSize,
    adSlot: process.env.NEXT_PUBLIC_AD_SLOT_FOOTER || '',
    label: 'スポンサーリンク',
    showOnMobile: true,
    showOnDesktop: true,
  },
  // サイドバー用レクタングル（将来のサイドバーレイアウト用）
  sidebarRectangle: {
    id: 'sidebar-rectangle',
    size: 'rectangle' as AdSize,
    adSlot: process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR || '',
    label: '広告',
    showOnMobile: false,
    showOnDesktop: true,
  },
} as const;
