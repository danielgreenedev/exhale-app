export const SURFACE_GLOWS = {
  home:  'radial-gradient(ellipse 60% 50% at 50% 50%, hsla(145,40%,22%,0.20) 0%, transparent 70%)',
  stats: 'radial-gradient(ellipse 60% 50% at 50% 50%, hsla(145,40%,22%,0.14) 0%, transparent 70%)',
} as const;

export const APP_COLORS = {
  forestNight: '#0f1712',
  emeraldPulse: '#34d399',
  stillWhite: '#f5f5f2',
} as const;

export const PHASE_COLORS = {
  inhale: {
    color: 'hsl(198, 45%, 63%)',
    glowColor: 'hsla(198, 45%, 63%, 0.28)',
  },
  hold: {
    color: 'hsl(40, 55%, 61%)',
    glowColor: 'hsla(40, 55%, 61%, 0.28)',
  },
  exhale: {
    color: 'hsl(148, 35%, 53%)',
    glowColor: 'hsla(148, 35%, 53%, 0.28)',
  },
  rest: {
    color: 'hsl(348, 42%, 66%)',
    glowColor: 'hsla(348, 42%, 66%, 0.28)',
  },
} as const;

export const CANVAS_COLORS = {
  forestGlow: 'hsla(145, 40%, 22%, 0.18)',
  transparent: 'rgba(15,23,18,0)',
  edgeVignette: 'rgba(15,23,18,0.32)',
  guideRing: '245, 245, 242',
} as const;
