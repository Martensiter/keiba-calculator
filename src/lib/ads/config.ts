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
// ※ 以下はサンプル広告です。実際の運用時はアフィリエイトASPから取得したコードに差し替えてください。

export const AD_CREATIVES: AdCreative[] = [
  // ──────────────────────────────────────────────
  // 【ヘッダー下バナー】横長テキスト広告
  // ──────────────────────────────────────────────
  {
    id: 'sample-header-ipat',
    type: 'text',
    positions: ['header'],
    priority: 10,
    title: 'JRA 即PAT',
    description: 'スマホでかんたん馬券購入。JRA公式のインターネット投票サービス。新規登録で便利に。',
    ctaText: '詳しくはこちら',
    ctaUrl: 'https://www.jra.go.jp/',
    icon: '🏇',
    themeColor: '#15803d',
    badge: 'PR',
  },

  // ──────────────────────────────────────────────
  // 【コンテンツ間レクタングル】競馬予想サイト広告
  // ──────────────────────────────────────────────
  {
    id: 'sample-content-yosou',
    type: 'text',
    positions: ['content'],
    priority: 10,
    title: '競馬予想なら netkeiba.com',
    description: '国内最大級の競馬情報サイト。レース予想・オッズ・出馬表・過去データが充実。無料会員登録で予想印が見られます。',
    ctaText: '無料会員登録',
    ctaUrl: 'https://www.netkeiba.com/',
    icon: '📊',
    themeColor: '#dc2626',
    badge: 'PR',
  },

  // ──────────────────────────────────────────────
  // 【記事内広告】競馬ブック
  // ──────────────────────────────────────────────
  {
    id: 'sample-article-keibabook',
    type: 'text',
    positions: ['in-article'],
    priority: 10,
    title: '週刊競馬ブック',
    description: 'プロの予想家による精度の高い予想をお届け。デジタル版なら毎週金曜日にスマホ・タブレットで閲覧可能。',
    ctaText: 'デジタル版を試す',
    ctaUrl: 'https://www.keibabook.co.jp/',
    icon: '📰',
    themeColor: '#2563eb',
    badge: 'PR',
  },

  // ──────────────────────────────────────────────
  // 【フッター上バナー】即PAT登録促進
  // ──────────────────────────────────────────────
  {
    id: 'sample-footer-umaca',
    type: 'text',
    positions: ['footer'],
    priority: 10,
    title: 'JRA UMACA',
    description: 'キャッシュレスで馬券購入。ICカード対応で競馬場・ウインズでスマートに投票できます。',
    ctaText: '公式サイトへ',
    ctaUrl: 'https://www.jra.go.jp/',
    icon: '💳',
    themeColor: '#7c3aed',
    badge: 'PR',
  },

  // ──────────────────────────────────────────────
  // 【HTML広告サンプル】
  // アフィリエイトASPから取得したHTMLコードをそのまま貼る場合の例
  // 実際のアフィリエイトコードに差し替えてください
  // ──────────────────────────────────────────────
  // {
  //   id: 'a8net-keiba-banner',
  //   type: 'html',
  //   positions: ['content', 'in-article'],
  //   priority: 20, // priority が高いほど優先表示
  //   htmlCode: `
  //     <!-- A8.net アフィリエイトコード例 -->
  //     <a href="https://px.a8.net/svt/ejp?a8mat=XXXXX" rel="nofollow">
  //       <img border="0" width="300" height="250" alt="" src="https://www.example.com/banner.jpg">
  //     </a>
  //     <img border="0" width="1" height="1" src="https://www.example.com/impression" alt="">
  //   `,
  // },

  // ──────────────────────────────────────────────
  // 【画像広告サンプル】
  // バナー画像 + リンク先URL を指定する場合
  // ──────────────────────────────────────────────
  // {
  //   id: 'custom-banner-keiba',
  //   type: 'image',
  //   positions: ['header'],
  //   priority: 20,
  //   imageUrl: '/ads/keiba-banner-728x90.png',
  //   linkUrl: 'https://www.example.com/affiliate?ref=keiba-calc',
  //   altText: '競馬予想サービス 初回無料',
  //   width: 728,
  //   height: 90,
  // },
];

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
