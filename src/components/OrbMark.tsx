import { ORB_MARK_STYLES } from '@/lib/colors';

type OrbTone = keyof typeof ORB_MARK_STYLES;
type OrbSize = 'policy' | 'stats' | 'home' | 'complete';

const SIZE_CLASSES: Record<OrbSize, string> = {
  policy: 'h-10 w-10',
  stats: 'h-14 w-14',
  home: 'h-[4.5rem] w-[4.5rem] sm:h-20 sm:w-20',
  complete: 'h-24 w-24',
};

const RING_CLASSES: Record<OrbSize, string> = {
  policy: '',
  stats: 'inset-[-10px]',
  home: 'inset-[-12px] sm:inset-[-14px]',
  complete: 'inset-[-14px]',
};

interface OrbMarkProps {
  size: OrbSize;
  tone?: OrbTone;
  ring?: boolean;
  breathe?: boolean;
  scale?: number;
  className?: string;
}

export function OrbMark({
  size,
  tone = 'emerald',
  ring = false,
  breathe = false,
  scale,
  className = '',
}: OrbMarkProps) {
  const styles = ORB_MARK_STYLES[tone];

  return (
    <div
      className={`relative ${SIZE_CLASSES[size]} ${breathe ? 'orb-breathe' : ''} ${className}`}
      style={scale ? { transform: `scale(${scale})` } : undefined}
      aria-hidden="true"
    >
      <div
        className="h-full w-full rounded-full"
        style={{ background: styles.core }}
      />
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: styles.highlight }}
      />
      {ring && (
        <div
          className={`absolute rounded-full border ${RING_CLASSES[size]}`}
          style={{ borderColor: styles.ring }}
        />
      )}
    </div>
  );
}
