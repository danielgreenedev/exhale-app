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
          background: '#0f1712',
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            background:
              'linear-gradient(135deg, rgba(245,245,242,0.22) 0%, rgba(245,245,242,0) 55%), ' +
              'radial-gradient(circle at 36% 30%, rgba(202,224,211,0.78) 0%, rgba(94,158,118,0.68) 48%, rgba(31,82,52,0.84) 100%)',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
