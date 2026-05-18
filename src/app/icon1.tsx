import { ImageResponse } from 'next/og';

export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default function IconLarge() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background:
            'radial-gradient(circle at 50% 50%, rgba(34,79,52,0.35) 0%, #090c0a 65%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 425,
            height: 425,
            borderRadius: '50%',
            border: '5px solid rgba(110,231,183,0.22)',
            boxShadow: '0 0 64px rgba(110,231,183,0.18)',
          }}
        >
          <div
            style={{
              width: 336,
              height: 336,
              borderRadius: '50%',
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.26) 0%, rgba(255,255,255,0) 55%), ' +
                'linear-gradient(135deg, rgba(110,231,183,0.88), rgba(6,95,70,0.70))',
              boxShadow: '0 0 100px rgba(52,211,153,0.32)',
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
