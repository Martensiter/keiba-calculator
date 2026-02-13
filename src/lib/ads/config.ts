/**
 * 広告管理設定
 *
 * 競馬系アフィリエイト広告を直接管理するシステム。
 * A8.net / バリューコマース / アクセストレード等のアフィリエイトコードをそのまま設定可能。
 *
 * 【広告の入稿方法】
 * 1. AD_CREATIVES 配列にクリエイティブを追加
 *    - type: 'html'  → アフィリエイトASPから取得したHTMLタグをそのまま貼り付け
 *    - type: 'image' → 画像URL + リンクURL を指定
 *    - type: 'text'  → テキストベースの広告（CSS で装飾）
 * 2. 各クリエイティブに position（表示位置）を指定
 *    - 'header': ヘッダー下横長バナー
 *    - 'content': コンテンツ間レクタングル
 *    - 'in-article': 記事内広告
 *    - 'footer': フッター上バナー
 * 3. 同じ position に複数のクリエイティブを設定すると自動ローテーション
 */

// ── 型定義 ──

/** 広告の表示位置 */
export type AdPosition = 'header' | 'content' | 'in-article' | 'footer';

/** 広告クリエイティブの種類 */
export type AdCreativeType = 'html' | 'image' | 'text';

/** 広告クリエイティブの定義 */
export interface AdCreative {
  /** 一意の識別ID */
  id: string;
  /** クリエイティブの種類 */
  type: AdCreativeType;
  /** 表示する位置（複数指定可） */
  positions: AdPosition[];
  /** 表示の優先度（大きいほど優先） */
  priority?: number;
  /** モバイルで表示するか（デフォルト: true） */
  showOnMobile?: boolean;
  /** デスクトップで表示するか（デフォルト: true） */
  showOnDesktop?: boolean;

  // --- type: 'html' ---
  /** アフィリエイトASPから取得したHTMLコード */
  htmlCode?: string;

  // --- type: 'image' ---
  /** バナー画像URL */
  imageUrl?: string;
  /** リンク先URL */
  linkUrl?: string;
  /** alt テキスト */
  altText?: string;
  /** 画像幅 (px) */
  width?: number;
  /** 画像高さ (px) */
  height?: number;

  // --- type: 'text' ---
  /** 広告タイトル */
  title?: string;
  /** 広告説明文 */
  description?: string;
  /** CTAボタンテキスト */
  ctaText?: string;
  /** CTAリンク先URL */
  ctaUrl?: string;
  /** アイコン（絵文字 or テキスト） */
  icon?: string;
  /** テーマカラー */
  themeColor?: string;
  /** サブラベル（例: "PR", "AD"） */
  badge?: string;
}

/** 広告スロットの設定 */
export interface AdSlotConfig {
  position: AdPosition;
  label?: string;
  maxAds?: number; // このスロットに表示する最大広告数（デフォルト: 1）
}

// ── 広告スロット定義 ──

export const AD_SLOTS: Record<string, AdSlotConfig> = {
  headerBanner: {
    position: 'header',
    label: 'スポンサーリンク',
    maxAds: 1,
  },
  contentRectangle: {
    position: 'content',
    label: '広告',
    maxAds: 1,
  },
  inArticle: {
    position: 'in-article',
    label: '広告',
    maxAds: 1,
  },
  footerBanner: {
    position: 'footer',
    label: 'スポンサーリンク',
    maxAds: 1,
  },
};

// ── 広告クリエイティブ ──
// ※ AdSense審査中は空配列を推奨（即PAT等のカスタム広告はリジェクト要因になりうる）
// ※ 審査通過後、アフィリエイトASPのコードを追加する場合は AD_CREATIVES に追記
export const AD_CREATIVES: AdCreative[] = [];

// ── ヘルパー関数 ──

/**
 * 指定ポジションの広告クリエイティブを取得（優先度順）
 */
export function getCreativesForPosition(position: AdPosition, maxCount: number = 1): AdCreative[] {
  const creatives = AD_CREATIVES
    .filter(c => c.positions.includes(position))
    .sort((a, b) => (b.priority || 0) - (a.priority || 0));

  return creatives.slice(0, maxCount);
}

/**
 * 広告クリエイティブが1つ以上存在するか
 */
export function hasAdsForPosition(position: AdPosition): boolean {
  return AD_CREATIVES.some(c => c.positions.includes(position));
}
