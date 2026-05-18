import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Exhale, guided breathing for a calmer mind';

const stillWhite = '#f5f5f2';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          background:
            'radial-gradient(circle at 29% 49%, rgba(34,79,52,0.62) 0%, rgba(34,79,52,0.28) 26%, rgba(9,12,10,0) 52%), ' +
            'radial-gradient(circle at 82% 17%, rgba(52,211,153,0.10) 0%, rgba(9,12,10,0) 30%), ' +
            '#090c0a',
          color: stillWhite,
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, rgba(9,12,10,0.10) 0%, rgba(9,12,10,0.38) 58%, rgba(9,12,10,0.18) 100%)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: 138,
            top: 132,
            width: 366,
            height: 366,
            borderRadius: '50%',
            border: '3px solid rgba(110,231,183,0.18)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 93,
            top: 87,
            width: 456,
            height: 456,
            borderRadius: '50%',
            border: '1px solid rgba(245,245,242,0.07)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 45,
            top: 39,
            width: 552,
            height: 552,
            borderRadius: '50%',
            border: '1px solid rgba(52,211,153,0.055)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: 202,
            top: 196,
            width: 238,
            height: 238,
            borderRadius: '50%',
            background:
              'linear-gradient(135deg, rgba(245,245,242,0.24) 0%, rgba(245,245,242,0.08) 26%, rgba(245,245,242,0) 58%), ' +
              'linear-gradient(135deg, rgba(110,231,183,0.92), rgba(52,211,153,0.70) 46%, rgba(6,95,70,0.68))',
            boxShadow:
              '0 0 92px rgba(52,211,153,0.26), 0 0 180px rgba(34,79,52,0.38)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 251,
            top: 226,
            width: 74,
            height: 74,
            borderRadius: '50%',
            background:
              'radial-gradient(circle at 40% 36%, rgba(245,245,242,0.28), rgba(245,245,242,0) 68%)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: 612,
            top: 156,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              color: 'rgba(245,245,242,0.90)',
              fontSize: 72,
              fontWeight: 200,
              letterSpacing: '0.28em',
              lineHeight: 1,
            }}
          >
            EXHALE
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 42,
              maxWidth: 430,
              color: 'rgba(245,245,242,0.62)',
              fontSize: 31,
              fontWeight: 300,
              letterSpacing: '0.065em',
              lineHeight: 1.45,
            }}
          >
            Guided breathing for a calmer mind.
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 17,
              marginTop: 52,
              color: 'rgba(245,245,242,0.38)',
              fontSize: 18,
              fontWeight: 300,
              letterSpacing: '0.18em',
              lineHeight: 1,
            }}
          >
            <span>4</span>
            <span style={{ color: 'rgba(52,211,153,0.48)' }}>4</span>
            <span>6</span>
            <span style={{ color: 'rgba(52,211,153,0.48)' }}>8</span>
            <span style={{ marginLeft: 8 }}>RHYTHM</span>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            right: 60,
            bottom: 44,
            color: 'rgba(245,245,242,0.30)',
            fontSize: 18,
            fontWeight: 300,
            letterSpacing: '0.14em',
          }}
        >
          exhale.guide
        </div>
      </div>
    ),
    { ...size }
  );
}
