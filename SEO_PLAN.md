# SEO改善計画書 - 競馬オッズ計算ツール

> Google検索で表示されない問題を改善するための総合計画。  
> ブランチ: `cursor/seo-cd0c`

---

## 1. 現状分析

### 1.1 既存のSEO実装（実装済み）
- メタデータ（title, description, keywords）
- OGP / Twitter Card（動的画像生成）
- sitemap.xml / robots.txt
- 構造化データ（WebApplication, FAQPage, HowTo, Article, Breadcrumb）
- canonical URL
- レスポンシブ / viewport 設定

### 1.2 想定される「検索に表示されない」要因

| 要因 | 可能性 | 対策 |
|------|--------|------|
| **Google Search Console 未登録** | 高 | サイト登録・sitemap送信 |
| **BASE_URL 誤設定** | 高 | `example.com` のまま → sitemap/ canonical が不正 |
| **インデックス申請していない** | 高 | URL検査でインデックスリクエスト |
| **Vercelドメインの権威性** | 中 | 独自ドメイン検討 |
| **サイト開設が浅い** | 中 | 時間経過待ち + コンテンツ強化 |
| **メインページがクライアントレンダリング** | 中 | サーバーコンポーネント化検討 |
| **被リンクゼロ** | 中 | 被リンク獲得施策 |

---

## 2. 即時対応（優先度高）

### 2.1 BASE_URL の修正【コード対応】
**問題**: `NEXT_PUBLIC_BASE_URL` 未設定時、`keiba-calculator.example.com` が使われ sitemap/OGP が不正になる。

**対応**:
1. Vercel 環境変数に `NEXT_PUBLIC_BASE_URL=https://keiba-calculator.vercel.app` を設定
2. 独自ドメイン導入後は `https://独自ドメイン` に変更
3. フォールバックを `vercel.app` に変更（本番以外で `example.com` を使わない）

### 2.2 Google Search Console 登録【手動作業】
1. [Google Search Console](https://search.google.com/search-console) にアクセス
2. プロパティ追加 → URL プレフィックスで `https://keiba-calculator.vercel.app` を登録
3. 所有権確認: HTMLタグ or DNS レコード
4. **sitemap送信**: `https://keiba-calculator.vercel.app/sitemap.xml`
5. 全ページの「URL検査」→「インデックス登録をリクエスト」

### 2.3 Bing Webmaster Tools 登録【手動作業】
- [Bing Webmaster Tools](https://www.bing.com/webmasters) で同様に登録
- sitemap 送信でクロール効率を上げる

---

## 3. ドメイン戦略

### 3.1 Vercel ドメイン（keiba-calculator.vercel.app）について

**事実**:
- `*.vercel.app` は Google にインデックスされる
- 新規サイト・被リンクが少ないと表示まで時間がかかる
- 「Vercel だから出ない」というより、**登録・設定不足**の可能性が高い

**推奨フロー**:
1. まず現状の `keiba-calculator.vercel.app` で Search Console 登録・sitemap 送信を実施
2. 1〜2ヶ月様子を見て、インデックス状況を確認
3. インデックスされても順位が伸びない場合は独自ドメインを検討

### 3.2 独自ドメイン導入（中〜長期）

| 項目 | 内容 |
|------|------|
| **メリット** | 信頼性向上、ブランディング、URLが覚えやすい |
| **コスト例** | 年間 1,000〜3,000円（.com / .jp / .net 等） |
| **推奨ドメイン例** | `keiba-calculator.com`, `keiba-odds.jp` など |
| **取得先** | お名前.com, ムームードメイン, Google Domains 等 |
| **Vercel 設定** | ダッシュボード → Domains でカスタムドメイン追加 |

**独自ドメインに移行する場合**:
- Vercel でカスタムドメインを設定
- `NEXT_PUBLIC_BASE_URL` を新ドメインに変更
- Search Console に新プロパティを追加し、変更の移行設定を行う

---

## 4. 技術SEOの強化

### 4.1 メインページのクロール効率
- `page.tsx` は `'use client'` のため、初期HTMLにメインコンテンツが少ない可能性あり
- **施策**: トップページにサーバーコンポーネントで「ツール概要」「キーワードを含む説明文」を追加し、初期HTMLにテキストを確保

### 4.2 構造化データの拡充
- Organization スキーマ（サイト全体の著作者・運営者）
- 各ページの `dateModified` を動的に設定
- SoftwareApplication の `featureList` を追加

### 4.3 内部リンク最適化
- フッター・ヘッダーからのリンクは現状問題なし
- 記事ページ間の関連リンク（例: ガイド ↔ 用語集）を追加

### 4.4 ページ速度
- Next.js のデフォルト最適化を活用
- 画像は OGP のみで、Next/Image は現状少ないため問題なし

---

## 5. コンテンツSEO

### 5.1 キーワード設計
**メインキーワード**:
- 競馬オッズ計算
- 馬券計算機
- 馬券 点数 計算
- 3連単 計算
- 即PAT オッズ

**ロングテール**:
- 馬券 点数 計算 ツール 無料
- 競馬 回収率 計算
- 馬連 BOX 点数

### 5.2 コンテンツ拡充案
- [ ] **ブログ/記事ページ**: 「馬券の買い方」「オッズの見方」などのコンテンツを追加
- [ ] **用語集の充実**: 各用語に説明を増やし、内部リンクを張る
- [ ] **よくある質問（FAQ）**: 計算ツールの使い方や競馬初心者向けFAQを強化

---

## 6. オフページSEO（被リンク）

### 6.1 獲得手段
- SNS（X/Twitter, 競馬関連コミュニティ）での紹介
- 競馬系ブログ・まとめサイトへの紹介依頼
- ギャンブル系ではなく「計算ツール」としての紹介が望ましい

### 6.2 禁止事項
- 被リンク購入
- リンクファームへの掲載
- 不自然な大量投稿

---

## 7. 実装タスク一覧

### フェーズ1: 即時（今週中）
- [ ] `NEXT_PUBLIC_BASE_URL` を Vercel に設定（`https://keiba-calculator.vercel.app`）
- [ ] フォールバックURLを `vercel.app` に変更
- [ ] Google Search Console 登録・sitemap 送信
- [ ] 主要ページのインデックスリクエスト

### フェーズ2: 短期（1〜2週間）
- [ ] Bing Webmaster Tools 登録
- [ ] トップページにサーバーコンポーネントでテキストコンテンツ追加
- [ ] Organization スキーマ追加

### フェーズ3: 中期（1〜2ヶ月）
- [ ] インデックス状況の確認・評価
- [ ] 独自ドメインの検討・導入判断
- [ ] コンテンツ追加（記事・FAQ拡充）

### フェーズ4: 長期
- [ ] 被リンク獲得施策
- [ ] 検索順位・クリック率のモニタリング
- [ ] キーワードに応じたコンテンツ最適化

---

## 8. チェックリスト（実装者向け）

### Vercel 環境変数
```
NEXT_PUBLIC_BASE_URL=https://keiba-calculator.vercel.app
```
※ 独自ドメイン導入後は `https://yourdomain.com` に変更

### 確認すべきURL
- https://keiba-calculator.vercel.app/ （正常表示）
- https://keiba-calculator.vercel.app/sitemap.xml （正しいURLが含まれる）
- https://keiba-calculator.vercel.app/robots.txt （sitemapURLが正しい）

### Search Console で確認する指標
- ページのインデックス状況
- カバレッジエラー
- モバイルユーザビリティ
- コアウェブバイタル

---

## 9. 参考リンク

- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [Next.js Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Vercel カスタムドメイン](https://vercel.com/docs/projects/domains)
