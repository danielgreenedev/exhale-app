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
            'radial-gradient(circle at 50% 50%, rgba(34,79,52,0.35) 0%, #0f1712 65%)',
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
            border: '5px solid rgba(93,177,132,0.22)',
          }}
        >
          <div
            style={{
              width: 336,
              height: 336,
              borderRadius: '50%',
              background:
                'linear-gradient(135deg, rgba(245,245,242,0.22) 0%, rgba(245,245,242,0) 55%), ' +
                'radial-gradient(circle at 36% 30%, rgba(202,224,211,0.76) 0%, rgba(94,158,118,0.66) 48%, rgba(31,82,52,0.82) 100%)',
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
