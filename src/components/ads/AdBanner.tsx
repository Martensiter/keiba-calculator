'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  AdSlotConfig,
  AdCreative,
  getCreativesForPosition,
} from '@/lib/ads/config';

interface AdBannerProps {
  slot: AdSlotConfig;
  className?: string;
}

/**
 * 広告バナーコンポーネント
 *
 * 表示モード:
 * - type: 'html'  → アフィリエイトASPのHTMLコードをそのまま挿入（dangerouslySetInnerHTML）
 * - type: 'image' → バナー画像 + リンク
 * - type: 'text'  → CSS装飾テキスト広告
 *
 * 広告が未設定の場合は何も表示しない（開発中のプレースホルダーは不要）
 */
export default function AdBanner({ slot, className = '' }: AdBannerProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const creatives = useMemo(
    () => getCreativesForPosition(slot.position, slot.maxAds || 1),
    [slot.position, slot.maxAds]
  );

  // SSR中 or マウント前は表示しない
  if (!mounted) return null;

  // 広告が無い場合は何も表示しない
  if (creatives.length === 0) return null;

  // レスポンシブフィルタ
  const filtered = creatives.filter(c => {
    if (isMobile && c.showOnMobile === false) return false;
    if (!isMobile && c.showOnDesktop === false) return false;
    return true;
  });

  if (filtered.length === 0) return null;

  return (
    <div className={`ad-slot ${className}`} data-ad-position={slot.position}>
      {slot.label && <p className="ad-slot-label">{slot.label}</p>}
      <div className="ad-slot-inner">
        {filtered.map(creative => (
          <AdCreativeRenderer key={creative.id} creative={creative} isMobile={isMobile} />
        ))}
      </div>
    </div>
  );
}

// ── クリエイティブ描画 ──

function AdCreativeRenderer({ creative, isMobile }: { creative: AdCreative; isMobile: boolean }) {
  switch (creative.type) {
    case 'html':
      return <HtmlAd creative={creative} />;
    case 'image':
      return <ImageAd creative={creative} isMobile={isMobile} />;
    case 'text':
      return <TextAd creative={creative} />;
    default:
      return null;
  }
}

// ── HTML広告（アフィリエイトタグ貼り付け） ──

function HtmlAd({ creative }: { creative: AdCreative }) {
  if (!creative.htmlCode) return null;

  return (
    <div
      className="ad-creative ad-creative--html"
      dangerouslySetInnerHTML={{ __html: creative.htmlCode }}
    />
  );
}

// ── 画像広告（バナー画像 + リンク） ──

function ImageAd({ creative, isMobile }: { creative: AdCreative; isMobile: boolean }) {
  if (!creative.imageUrl) return null;

  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={creative.imageUrl}
      alt={creative.altText || '広告'}
      width={creative.width}
      height={creative.height}
      className="ad-creative ad-creative--image"
      style={{
        maxWidth: '100%',
        height: 'auto',
        ...(isMobile ? { maxWidth: Math.min(creative.width || 320, 320) } : {}),
      }}
    />
  );

  if (creative.linkUrl) {
    return (
      <a
        href={creative.linkUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="ad-creative-link"
      >
        {img}
      </a>
    );
  }

  return img;
}

// ── テキスト広告（CSSスタイル付き） ──

function TextAd({ creative }: { creative: AdCreative }) {
  const color = creative.themeColor || '#15803d';

  return (
    <a
      href={creative.ctaUrl || '#'}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="ad-creative ad-creative--text"
      style={{ '--ad-theme': color } as React.CSSProperties}
    >
      <div className="ad-text-body">
        {/* バッジ */}
        {creative.badge && (
          <span className="ad-text-badge" style={{ backgroundColor: color }}>
            {creative.badge}
          </span>
        )}

        {/* アイコン + タイトル */}
        <div className="ad-text-header">
          {creative.icon && <span className="ad-text-icon">{creative.icon}</span>}
          <span className="ad-text-title">{creative.title}</span>
        </div>

        {/* 説明文 */}
        {creative.description && (
          <p className="ad-text-desc">{creative.description}</p>
        )}

        {/* CTAボタン */}
        {creative.ctaText && (
          <span className="ad-text-cta" style={{ backgroundColor: color }}>
            {creative.ctaText}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        )}
      </div>
    </a>
  );
}
