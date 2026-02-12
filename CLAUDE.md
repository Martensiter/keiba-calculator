# 競馬オッズ計算ツール (keiba-calculator)

## プロジェクト概要
Next.js + React + TypeScriptで構築された競馬の馬券計算ツール。
馬券の点数・合計金額・回収率をリアルタイムで計算し、BOX・ながし・フォーメーションに対応。
即PATからのデータ取り込み、JRA公式サイトからのオッズ一括転記も可能。
初心者向けガイド・用語集も充実。

## 技術スタック
- **Framework**: Next.js 14.2.35
- **UI**: React 18.3.1
- **Language**: TypeScript 5.9.3
- **Styling**: Tailwind CSS 4.1.18
- **Build**: PostCSS

## ディレクトリ構造
```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # メインページ（計算機）
│   ├── layout.tsx                # ルートレイアウト（SEO強化済み）
│   ├── beginners/page.tsx        # はじめての方へ（初心者ガイド）
│   ├── guide/page.tsx            # 馬券の買い方ガイド（HowToスキーマ付き）
│   ├── glossary/page.tsx         # 用語集
│   ├── sitemap.ts                # sitemap.xml 自動生成
│   ├── robots.ts                 # robots.txt 自動生成
│   ├── opengraph-image.tsx       # OGP画像の動的生成
│   ├── twitter-image.tsx         # Twitter Card画像の動的生成
│   └── globals.css               # グローバルスタイル（テーマCSS変数定義）
├── components/
│   ├── calculator/               # 計算機関連コンポーネント
│   │   ├── RaceSetup.tsx        # レース設定（会場・レース番号）
│   │   ├── BetTypeSelector.tsx  # 馬券種選択（インラインヘルプ付き）
│   │   ├── PurchaseMethod.tsx   # 購入方法選択
│   │   ├── HorseSelector.tsx    # 馬番選択UI
│   │   ├── OddsInput.tsx        # オッズ個別入力
│   │   ├── JraOddsImporter.tsx  # JRAオッズ一括入力（コピペ転記）
│   │   ├── ResultPanel.tsx      # 計算結果表示
│   │   ├── ResultInput.tsx      # レース結果入力モーダル
│   │   └── PurchaseList.tsx     # 購入リスト
│   ├── ipat/
│   │   └── IpatImporter.tsx     # 即PAT取り込み機能
│   ├── seo/
│   │   └── JsonLd.tsx            # 構造化データ（WebApp/FAQ/HowTo/Article/Breadcrumb）
│   └── ui/                       # 共通UIコンポーネント
│       ├── Tabs.tsx
│       ├── Button.tsx
│       ├── Modal.tsx
│       └── ThemeToggle.tsx       # ダークモード切替ボタン
├── lib/
│   ├── types.ts                  # 型定義（全体）
│   ├── calculator/               # 計算ロジック
│   │   ├── betTypes.ts          # 馬券種の定義・判定
│   │   ├── combinations.ts      # 組み合わせ計算（BOX/ながし/フォーメーション）
│   │   ├── payout.ts            # 配当計算・的中判定
│   │   └── refund.ts            # 返還処理
│   ├── jra/                      # JRAオッズ解析
│   │   └── oddsParser.ts        # JRAオッズテキストパーサー
│   └── ipat/                     # 即PAT解析
│       ├── oddsParser.ts        # オッズ画面解析
│       ├── historyParser.ts     # 購入履歴解析
│       └── raceInfoParser.ts    # 出馬表解析
└── data/
    └── glossary.ts               # 用語集データ
```

## 主要機能

### 1. 馬券計算機能
- **馬券種**: 単勝、複勝、応援馬券（単+複）、枠連、馬連、ワイド、馬単、3連複、3連単
- **購入方法**: 通常、BOX、ながし（マルチ対応）、フォーメーション
- **計算内容**: 点数、合計金額、予想払戻、回収率
- **マルチ**: ながし購入時に軸・相手入替を自動計算

### 2. JRAオッズ手動転記（JraOddsImporter）
- JRA公式サイトのオッズ表をコピペで一括取込
- ステップ形式のガイド付き（初心者にも分かりやすい）
- 対応形式: 馬連/ワイド/枠連(1-2形式), 馬単(1→2形式), 3連複/3連単, 単勝/複勝
- 全角数字・タブ区切り・スペース区切り自動対応
- プレビュー画面でマッチ状況を確認後に反映

### 3. 即PATデータ取り込み
- オッズ一覧画面からのコピペで自動解析
- 購入履歴からの取り込み
- 出馬表からの馬情報取り込み

### 4. 購入リスト管理
- 複数の買い目をリストで管理
- 合計投資額・予想払戻の集計
- localStorage自動保存

### 5. 結果入力・返還対応
- レース結果入力モーダル（着順・枠番・配当・返還馬）
- 枠番入力で枠連の正確な的中判定が可能
- 返還馬を含む買い目の自動除外
- 返還金額の計算・表示

### 6. 初心者向け機能
- **インラインヘルプ**: 馬券種選択時に「この馬券とは？」パネル表示
- **はじめての方へ** (`/beginners`): ゼロからの競馬入門ガイド
- **馬券の買い方ガイド** (`/guide`): 全馬券種の詳細解説 + JRAオッズの見方
- **用語集** (`/glossary`): カテゴリ別競馬用語辞典

### 7. SEO
- **構造化データ**: WebApplication, FAQPage, HowTo, Article, BreadcrumbList
- **メタデータ**: title template, description, keywords, OGP, Twitter Card
- **OGP画像**: `opengraph-image.tsx` / `twitter-image.tsx` で動的生成（edge runtime）
- **技術SEO**: sitemap.xml, robots.txt (Next.js自動生成)
- **canonical URL**: metadataBase設定
- **viewport / themeColor**: レスポンシブ対応

### 8. ダークモード
- **テーマ切替**: ヘッダーの切替ボタンでライト / ダーク / システム追従の3モード
- **CSS変数方式**: globals.css でセマンティックカラー変数を定義（`--color-surface`, `--color-text-primary` 等）
- **ちらつき防止**: `<head>` 内インラインスクリプトでページ描画前にクラスを適用
- **localStorage永続化**: `keiba-theme` キーで保存

## データフロー

### ステート管理（page.tsx）
```typescript
// レース情報
raceInfo: { venue, raceNumber, raceName, horses }

// 馬券設定
betType: '単勝' | '複勝' | '応援馬券' | '枠連' | '馬連' | 'ワイド' | '馬単' | '3連複' | '3連単'
purchaseMethod: '通常' | 'BOX' | 'ながし' | 'フォーメーション'
unitAmount: number (1単位の金額)
isMulti: boolean (マルチ購入 ※ながし時のみ)

// 選択状態
selectedHorses: number[]              // 通常/BOX用
nagashi: { axis, partner, axisPosition }  // ながし用
formation: { first, second, third }   // フォーメーション用

// 計算結果
currentSelections: BetSelection[]     // 現在の買い目
tickets: BetTicket[]                  // 購入リスト
```

### 買い目計算の流れ
1. ユーザーが馬番を選択
2. `useEffect`で自動的に組み合わせ計算
3. `calculateBoxTickets()` / `calculateNagashiTickets()` / `calculateFormationTickets()`
4. マルチON時: 軸・相手を入れ替えた買い目も合算（重複除去）
5. `currentSelections`に結果を格納
6. ResultPanelで点数・金額を表示

### JRAオッズ転記の流れ
1. ユーザーがJRA公式サイトからオッズテキストをコピー
2. `JraOddsImporter`にペースト
3. `parseJraOddsText()`でパース（馬券種自動検出）
4. プレビュー画面で現在の買い目とのマッチ確認
5. 確定で`currentSelections`にオッズ値を一括反映

## 開発コマンド
```bash
npm run dev    # 開発サーバー起動 (http://localhost:3000)
npm run build  # 本番ビルド
npm start      # 本番サーバー起動
```

## モバイル開発
- **GitHub Codespaces対応**: `.devcontainer/devcontainer.json` で設定済み
- **モバイル完結開発**: スマホ・タブレットだけで開発可能
- **詳細ガイド**: `MOBILE_DEV.md` 参照
- **推奨環境**: GitHub Codespaces（月60時間まで無料）
- **devスクリプト**: `-H 0.0.0.0` でネットワークアクセス対応

## 実装済み機能
- ✅ 基本的な馬券計算（全馬券種対応）
- ✅ BOX/ながし/フォーメーション計算
- ✅ マルチ購入（ながし時の軸・相手入替）
- ✅ オッズ入力・配当計算
- ✅ JRAオッズ一括転記（コピペ）
- ✅ 返還処理
- ✅ 即PATデータ取り込み
- ✅ 購入リスト管理
- ✅ localStorage自動保存
- ✅ レスポンシブUI
- ✅ SEO対応（構造化データ・sitemap・robots.txt）
- ✅ 初心者向けガイド（3ページ + インラインヘルプ）
- ✅ 選択リセットボタン
- ✅ 応援馬券（単勝+複勝セット購入）
- ✅ 結果入力モーダル強化（枠番入力・枠連的中判定対応）
- ✅ ダークモード（ライト/ダーク/システム追従、CSS変数方式）
- ✅ OGP画像動的生成（opengraph-image.tsx / twitter-image.tsx）

## TODOリスト / 今後の拡張案
- [ ] 複数レースの一括管理機能
- [ ] 統計・分析機能（回収率推移など）
- [ ] PDFエクスポート機能
- [ ] 過去レースからのインポート
- [ ] レース情報API連携（JRA公式など）

## 注意点
- 単勝・複勝・応援馬券は「通常」購入方法のみ対応（BOX/ながし非対応）
- 応援馬券は1頭につき単勝+複勝の2点を自動生成
- 3連単/3連複はフォーメーション選択時に3着まで選択可能
- オッズ入力は100点以下の場合のみUI表示（多すぎる場合は非表示）
- localStorage保存は`raceInfo`, `tickets`, `horseCount`のみ
- betType/purchaseMethod変更時は選択状態をリセット
- JRAオッズパーサーは全角数字・→・ー等の全角文字を自動で半角に正規化
- BASE_URL は環境変数 `NEXT_PUBLIC_BASE_URL` で設定（デフォルト: example.com）
- ダークモードはclass方式（`html.dark`）。Tailwind v4の `@custom-variant dark` で定義
- テーマのlocalStorageキーは `keiba-theme`（light / dark / system）
- OGP画像はedge runtimeで動的生成されるため静的エクスポート不可

## 最近の作業履歴
- Initial implementation of keiba odds calculator (commit: 5ab7e45)
  - 全馬券種の計算ロジック実装
  - UI/UXの基本構築
  - 即PATデータ取り込み実装
- 機能拡張 (2026-02-12)
  - JRAオッズ手動転記機能追加（パーサー + UIコンポーネント）
  - SEO強化（sitemap.xml / robots.txt / HowTo・Article構造化データ / メタデータ改善）
  - 初心者向け機能（/beginners ページ / BetTypeSelector インラインヘルプ / ガイド強化）
  - UX改善（マルチ購入 / 選択リセット / フッター強化 / FAQ拡充）
- 機能追加 (2026-02-12 続き)
  - 応援馬券（単勝+複勝セット購入）の実装
  - 結果入力モーダルに枠番入力を追加（枠連の正確な的中判定に対応）
- 機能追加 (2026-02-12 続き2)
  - ダークモード実装（CSS変数方式、ライト/ダーク/システム3モード切替）
  - OGP画像・Twitter Card画像の動的生成（edge runtime）

## ファイル参照の目安
- 型定義を確認: `src/lib/types.ts`
- 計算ロジック: `src/lib/calculator/*.ts`
- JRAオッズ解析: `src/lib/jra/oddsParser.ts`
- メインUI: `src/app/page.tsx`
- 各機能のコンポーネント: `src/components/calculator/*.tsx`
- 即PAT解析: `src/lib/ipat/*.ts`
- SEO: `src/components/seo/JsonLd.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`
- OGP画像: `src/app/opengraph-image.tsx`, `src/app/twitter-image.tsx`
- ダークモード: `src/app/globals.css`（テーマ変数）, `src/components/ui/ThemeToggle.tsx`
- 初心者向け: `src/app/beginners/page.tsx`, `src/app/guide/page.tsx`
