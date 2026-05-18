import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: '#090c0a',
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 55%), ' +
              'linear-gradient(135deg, rgba(110,231,183,0.95), rgba(6,95,70,0.85))',
            boxShadow: '0 0 10px rgba(52,211,153,0.55)',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
