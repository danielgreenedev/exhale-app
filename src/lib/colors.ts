export const SURFACE_GLOWS = {
  home:  'radial-gradient(ellipse 60% 50% at 50% 50%, hsla(145,40%,22%,0.20) 0%, transparent 70%)',
  stats: 'radial-gradient(ellipse 60% 50% at 50% 50%, hsla(145,40%,22%,0.14) 0%, transparent 70%)',
} as const;

export const ORB_MARK_STYLES = {
  emerald: {
    core: 'radial-gradient(circle at 36% 30%, rgba(202,224,211,0.68) 0%, rgba(94,158,118,0.60) 46%, rgba(31,82,52,0.64) 100%)',
    highlight: 'linear-gradient(135deg, rgba(245,245,242,0.14) 0%, rgba(245,245,242,0) 56%)',
    ring: 'rgba(93,177,132,0.20)',
  },
  amber: {
    core: 'radial-gradient(circle at 36% 30%, rgba(244,220,166,0.76) 0%, rgba(210,174,101,0.58) 50%, rgba(103,76,30,0.62) 100%)',
    highlight: 'linear-gradient(135deg, rgba(245,245,242,0.15) 0%, rgba(245,245,242,0) 56%)',
    ring: 'rgba(210,174,101,0.22)',
  },
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
} as const;

export const CANVAS_COLORS = {
  forestGlow: 'hsla(145, 40%, 22%, 0.18)',
  transparent: 'rgba(15,23,18,0)',
  edgeVignette: 'rgba(15,23,18,0.32)',
  guideRing: '245, 245, 242',
} as const;
