'use client';

import { useEffect, useRef, useState } from 'react';
import { AdSlotConfig, AD_SIZES, ADSENSE_CLIENT_ID, isAdsEnabled } from '@/lib/ads/config';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

interface AdBannerProps {
  slot: AdSlotConfig;
  className?: string;
}

/**
 * 広告バナーコンポーネント
 * 
 * - AdSense クライアント ID が設定されている場合: Google AdSense 広告を表示
 * - 未設定の場合（開発環境）: プレースホルダーを表示
 */
export default function AdBanner({ slot, className = '' }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const initialized = useRef(false);

  // レスポンシブ判定
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // AdSense 広告の初期化
  useEffect(() => {
    if (!isAdsEnabled() || !slot.adSlot || initialized.current) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      initialized.current = true;
    } catch (err) {
      console.error('AdSense initialization error:', err);
    }
  }, [slot.adSlot]);

  // モバイル/デスクトップでの表示制御
  if (isMobile && slot.showOnMobile === false) return null;
  if (!isMobile && slot.showOnDesktop === false) return null;

  const sizeConfig = AD_SIZES[slot.size];
  const isResponsive = sizeConfig.responsive || slot.size === 'in-article';

  // AdSense が有効な場合
  if (isAdsEnabled() && slot.adSlot) {
    return (
      <div
        className={`ad-container ad-container--${slot.size} ${className}`}
        data-ad-slot={slot.id}
      >
        {slot.label && (
          <p className="ad-label">{slot.label}</p>
        )}
        <div ref={adRef} className="ad-content">
          {slot.size === 'in-article' ? (
            <ins
              className="adsbygoogle"
              style={{ display: 'block', textAlign: 'center' }}
              data-ad-layout="in-article"
              data-ad-format="fluid"
              data-ad-client={ADSENSE_CLIENT_ID}
              data-ad-slot={slot.adSlot}
            />
          ) : isResponsive ? (
            <ins
              className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client={ADSENSE_CLIENT_ID}
              data-ad-slot={slot.adSlot}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          ) : (
            <ins
              className="adsbygoogle"
              style={{
                display: 'inline-block',
                width: `${sizeConfig.width}px`,
                height: `${sizeConfig.height}px`,
              }}
              data-ad-client={ADSENSE_CLIENT_ID}
              data-ad-slot={slot.adSlot}
            />
          )}
        </div>
      </div>
    );
  }

  // 開発環境用プレースホルダー
  return (
    <div
      className={`ad-container ad-container--${slot.size} ad-placeholder ${className}`}
      data-ad-slot={slot.id}
    >
      {slot.label && (
        <p className="ad-label">{slot.label}</p>
      )}
      <div className="ad-placeholder-inner">
        <div className="ad-placeholder-content">
          <svg
            className="ad-placeholder-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 10v4M10 12h4"
            />
          </svg>
          <span className="ad-placeholder-text">
            広告スペース ({slot.size})
          </span>
          <span className="ad-placeholder-hint">
            NEXT_PUBLIC_ADSENSE_CLIENT_ID を設定すると広告が表示されます
          </span>
        </div>
      </div>
    </div>
  );
}
