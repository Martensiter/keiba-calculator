import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description: '競馬オッズ計算ツールのプライバシーポリシー。当サイトで収集する情報とその取り扱いについて説明します。',
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <article className="max-w-3xl mx-auto">
      <BreadcrumbJsonLd items={[
        { name: '競馬オッズ計算ツール', url: '/' },
        { name: 'プライバシーポリシー', url: '/privacy' },
      ]} />
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-(--color-text-primary)">
          プライバシーポリシー
        </h1>
        <p className="text-sm text-(--color-text-muted) mt-2">
          最終更新: {new Date().toLocaleDateString('ja-JP')}
        </p>
      </header>

      <div className="bg-white dark:bg-(--color-surface-card) rounded-xl shadow-sm border border-(--color-border) p-6 space-y-6 text-(--color-text-secondary) leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-(--color-text-primary) mb-3">1. はじめに</h2>
          <p>
            競馬オッズ計算ツール（以下「当サイト」）は、ユーザーのプライバシーを尊重し、個人情報の取り扱いについて透明性を保つことをお約束します。本プライバシーポリシーは、当サイトのご利用によって収集される情報と、その使用方法について説明するものです。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-(--color-text-primary) mb-3">2. 収集する情報</h2>
          <h3 className="text-base font-medium text-(--color-text-primary) mb-2">2.1 ブラウザのローカルストレージに保存するデータ</h3>
          <p>当サイトは、利便性向上のため、以下のデータをユーザーのブラウザ内（ローカルストレージ）に保存します。これらのデータはサーバーに送信されず、ユーザーのデバイス内のみで管理されます。</p>
          <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
            <li><strong>レース設定</strong>（会場、レース番号など）</li>
            <li><strong>購入リスト</strong>（馬券の買い目）</li>
            <li><strong>馬頭数</strong></li>
            <li><strong>テーマ設定</strong>（ライト/ダークモードの選択）</li>
          </ul>

          <h3 className="text-base font-medium text-(--color-text-primary) mt-4 mb-2">2.2 アクセス解析・広告配信で収集するデータ</h3>
          <p>
            当サイトでは、アクセス解析（Google Analytics 等）、広告配信（Google 広告、Meta 広告 等）、およびサイト上での広告表示（Google AdSense 等）のサービスを利用する場合があります。これらのサービスは、Cookie やその他の技術を使用して、アクセス数、ページビュー、利用環境（デバイス、ブラウザ）、興味・関心に基づく広告表示などの情報を収集することがあります。収集されるデータの詳細は、各サービスのプライバシーポリシーをご確認ください。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-(--color-text-primary) mb-3">3. 情報の利用目的</h2>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>サービス品質の向上と機能改善</li>
            <li>アクセス状況の把握と分析</li>
            <li>広告の表示・効果測定（該当する場合）</li>
            <li>不正利用の防止</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-(--color-text-primary) mb-3">4. Cookie について</h2>
          <p>
            当サイトでは、利用状況の分析や広告配信のために Cookie を使用することがあります。ブラウザの設定により Cookie を無効にすることもできますが、一部の機能が正常に動作しなくなる可能性があります。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-(--color-text-primary) mb-3">5. 第三者への提供</h2>
          <p>
            当サイトは、法令に基づく場合を除き、ユーザーの同意なく個人を特定できる情報を第三者に提供することはありません。アクセス解析・広告サービスにおいて収集されたデータは、各サービスの利用規約に従って取り扱われます。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-(--color-text-primary) mb-3">6. 外部リンク</h2>
          <p>
            当サイトには、JRA（日本中央競馬会）公式サイトなど外部サイトへのリンクが含まれる場合があります。外部サイトでのプライバシー取り扱いについては、当サイトは責任を負いかねます。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-(--color-text-primary) mb-3">7. 免責事項</h2>
          <p>
            当サイトは馬券の購入を推奨するものではありません。馬券購入は自己責任で、20歳以上の方に限られます。計算結果は参考情報としてご利用ください。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-(--color-text-primary) mb-3">8. ポリシーの変更</h2>
          <p>
            本プライバシーポリシーは、必要に応じて改定することがあります。重要な変更がある場合は、当サイト上でお知らせします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-(--color-text-primary) mb-3">9. お問い合わせ</h2>
          <p>
            本ポリシーに関するご質問・ご要望については、当サイトの GitHub リポジトリの Issues からお問い合わせいただくか、運営者にご連絡ください。
          </p>
        </section>
      </div>

      <p className="text-center mt-8">
        <a href="/" className="text-green-600 dark:text-green-400 hover:underline font-medium">
          ← トップへ戻る
        </a>
      </p>
    </article>
  );
}
