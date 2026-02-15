import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = '競馬オッズ計算ツール | 買い目計算・馬券シミュレーション・回収率を無料で';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #15803d 0%, #166534 50%, #14532d 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* メインタイトル */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              fontSize: '64px',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              textAlign: 'center',
              lineHeight: 1.2,
            }}
          >
            競馬オッズ計算ツール
          </div>

          <div
            style={{
              fontSize: '28px',
              color: '#bbf7d0',
              textAlign: 'center',
              maxWidth: '900px',
              lineHeight: 1.5,
            }}
          >
            馬券点数・回収率・収支を簡単シミュレーション
          </div>
        </div>

        {/* 機能タグ */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginTop: '40px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {['全馬券種対応', 'BOX・ながし・フォーメーション', 'JRAオッズ転記', '初心者ガイド付き'].map(
            (tag) => (
              <div
                key={tag}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: '9999px',
                  padding: '8px 20px',
                  fontSize: '20px',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.25)',
                }}
              >
                {tag}
              </div>
            )
          )}
        </div>

        {/* フッター */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            fontSize: '16px',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          無料で使える馬券計算ツール
        </div>
      </div>
    ),
    { ...size }
  );
}
