'use client';

import { useEffect, useRef } from 'react';

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-3594496442498529';
const ADSENSE_SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID || '1488341751';
const ADSENSE_ENABLED = !!ADSENSE_CLIENT;

type AdFormat = 'auto' | 'rectangle' | 'horizontal' | 'vertical' | 'fluid';

interface AdSlotProps {
  /** 広告スロットID（AdSenseで作成した広告ユニットのID） */
  slotId?: string;
  /** 表示形式。auto はレスポンシブ */
  format?: AdFormat;
  /** レイアウト用のクラス名 */
  className?: string;
  /** 広告が表示されるセクションのラベル（スクリーンリーダー用） */
  label?: string;
}

/**
 * 広告表示コンポーネント（Google AdSense対応）
 * NEXT_PUBLIC_ADSENSE_CLIENT_ID が設定されている場合に表示
 *
 * 競馬系サイトはAdSense審査で制限される場合があります。
 * 審査通過後、Googleがサイト内容に応じて競馬関連広告を配信する可能性があります。
 */
export function AdSlot({ slotId, format = 'auto', className = '', label = '広告' }: AdSlotProps) {
  const insRef = useRef<HTMLModElement>(null);
  const slot = slotId || ADSENSE_SLOT;

  useEffect(() => {
    if (!ADSENSE_ENABLED || !slot || !insRef.current) return;
    const pushAd = () => {
      try {
        ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle = (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle || []).push({});
      } catch (e) {
        console.warn('AdSense push error:', e);
      }
    };
    if (typeof (window as unknown as { adsbygoogle?: unknown }).adsbygoogle !== 'undefined') {
      pushAd();
    } else {
      const t = setTimeout(pushAd, 500);
      return () => clearTimeout(t);
    }
  }, [slot]);

  if (!ADSENSE_ENABLED) return null;

  return (
    <section
      className={`min-h-[90px] flex items-center justify-center ${className}`}
      aria-label={label}
    >
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </section>
  );
}
