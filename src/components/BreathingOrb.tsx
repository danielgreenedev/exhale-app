'use client';

import { useEffect, useRef } from 'react';
import {
  DEFAULT_RHYTHM,
  getPhaseLookahead,
  PhaseConfig,
  RHYTHMS,
  Rhythm,
  easeInOutCubic,
  getPhaseAtTime,
  getNextPhase,
} from '@/lib/breathing';
import { APP_COLORS, CANVAS_COLORS } from '@/lib/colors';

interface Particle {
  angle: number;
  radius: number;
  baseRadius: number;
  size: number;
  speed: number;
  opacity: number;
  phase: number;
}

interface Props {
  currentPhase: PhaseConfig;
  elapsedRef: { current: number };
  sessionDuration: number;
  orbScale?: number;
  rhythm?: Rhythm;
}

const PARTICLE_COUNT = 38;
const PARTICLE_COUNT_SMALL = 22;
const SMALL_VIEWPORT_BREAKPOINT = 600;
const ORB_MIN_RADIUS = 60;
const ORB_MAX_RADIUS = 140;
// Meta Android webviews can crop the visible CSS viewport near the native chrome.
// Keep the outer guide ring comfortably away from the canvas edge.
const CANVAS_EDGE_PADDING = 40;
const GUIDE_RING_EXTRA = 56;
const MIN_GUIDE_RING_EXTRA = 36;
const COLOR_TRANSITION_MS = 1450;
const ARC_FADE_MS = 950;
const FLASH_MS = 350;
const INHALE_TURNAROUND_DELAY_SECONDS = 0.25;
const ORB_LIGHTNESS_OFFSET = -9;

function parseHSL(hsl: string): [number, number, number] {
  const m = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!m) return [210, 80, 65];
  return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])];
}

function lerpHSL(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

export default function BreathingOrb({
  currentPhase,
  elapsedRef,
  sessionDuration,
  orbScale = 1,
  rhythm = RHYTHMS[DEFAULT_RHYTHM],
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const canvasSizeRef = useRef({ width: 0, height: 0 });

  // orbScaleRef: updated each render, read inside the draw loop
  const orbScaleRef = useRef(orbScale);

  // Rhythm is captured at first render and never updated; cycleDuration and pattern
  // boundaries cannot change mid-session, and reading from a ref inside the draw loop
  // keeps the RAF closure stable across parent re-renders.
  const rhythmRef = useRef(rhythm);

  // Color transition state
  const prevColorRef = useRef<[number, number, number]>(parseHSL(currentPhase.color));
  const targetColorRef = useRef<[number, number, number]>(parseHSL(currentPhase.color));
  const colorTRef = useRef(1); // 0→1 transition progress
  const outgoingArcRef = useRef<{ color: [number, number, number]; progress: number } | null>(null);
  const outgoingArcTRef = useRef(1);
  const flashRef = useRef<{ t: number } | null>(null);

  // Detect phase color changes each render; canvas reads elapsedRef directly for smooth animation
  useEffect(() => {
    const newTarget = parseHSL(currentPhase.color);
    if (
      newTarget[0] !== targetColorRef.current[0] ||
      newTarget[1] !== targetColorRef.current[1] ||
      newTarget[2] !== targetColorRef.current[2]
    ) {
      prevColorRef.current = lerpHSL(prevColorRef.current, targetColorRef.current, colorTRef.current);
      // Phase transitions happen at exact phase boundaries — outgoing arc completed fully
      outgoingArcRef.current = { color: prevColorRef.current, progress: 0.96 };
      outgoingArcTRef.current = 0;
      targetColorRef.current = newTarget;
      colorTRef.current = 0;
      flashRef.current = { t: 0 };
    }
    orbScaleRef.current = orbScale;
  });

  // Init particles. Scale the count down on small viewports as a defensive perf
  // measure for older mobile GPUs; reduced-motion users skip particles entirely
  // in the draw loop so this only affects motion-enabled small screens.
  useEffect(() => {
    const count = typeof window !== 'undefined' && window.innerWidth < SMALL_VIEWPORT_BREAKPOINT
      ? PARTICLE_COUNT_SMALL
      : PARTICLE_COUNT;
    particlesRef.current = Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * Math.PI * 2 + Math.random() * 0.3,
      radius: 160 + Math.random() * 120,
      baseRadius: 160 + Math.random() * 120,
      size: 1.5 + Math.random() * 2.5,
      speed: 0.000005 + Math.random() * 0.000008,
      opacity: 0.05 + Math.random() * 0.18,
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  // Canvas draw loop — runs once, reads from refs
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let frameTime = performance.now();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const highContrastQuery = window.matchMedia('(prefers-contrast: more)');

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      canvasSizeRef.current = { width, height };
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = (now: number) => {
      const highContrast = highContrastQuery.matches;
      const dt = Math.min(now - frameTime, 50); // cap at 50ms to avoid jumps
      frameTime = now;

      // Compute phase data directly from the continuously-updated elapsed ref —
      // bypasses React re-renders so orb animation stays smooth at 60fps
      const elapsed = elapsedRef.current;
      const activeRhythm = rhythmRef.current;
      const { config: phase, timeInPhase, phaseIndex } = getPhaseAtTime(elapsed % activeRhythm.cycleDuration, activeRhythm);
      const nextPhase = getNextPhase(phaseIndex, activeRhythm);
      const timeUntilPhaseEnd = phase.duration - timeInPhase;
      const lookahead = getPhaseLookahead(phase);
      const phaseLeadProgress = lookahead > 0
        ? Math.max(0, Math.min(1, (lookahead - timeUntilPhaseEnd) / lookahead))
        : 0;
      const nextColor = parseHSL(nextPhase.color);
      const pp = timeInPhase / phase.duration;
      const sp = Math.min(1, elapsed / sessionDuration);

      const { width: w, height: h } = canvasSizeRef.current;
      if (w === 0 || h === 0) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Background
      ctx.fillStyle = APP_COLORS.forestNight;
      ctx.fillRect(0, 0, w, h);

      // Warm forest glow — matches home screen
      if (!highContrast) {
        const forestGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.65);
        forestGlow.addColorStop(0, CANVAS_COLORS.forestGlow);
        forestGlow.addColorStop(1, CANVAS_COLORS.transparent);
        ctx.fillStyle = forestGlow;
        ctx.fillRect(0, 0, w, h);
      }

      // Soft vignette — keeps edges comfortable without a dark tunnel
      if (!highContrast) {
        const vig = ctx.createRadialGradient(cx, cy, h * 0.2, cx, cy, h * 0.9);
        vig.addColorStop(0, CANVAS_COLORS.transparent);
        vig.addColorStop(1, CANVAS_COLORS.edgeVignette);
        ctx.fillStyle = vig;
        ctx.fillRect(0, 0, w, h);
      }

      // Advance color transition
      if (colorTRef.current < 1) {
        colorTRef.current = Math.min(1, colorTRef.current + dt / COLOR_TRANSITION_MS);
      }
      if (outgoingArcRef.current && outgoingArcTRef.current < 1) {
        outgoingArcTRef.current = Math.min(1, outgoingArcTRef.current + dt / ARC_FADE_MS);
      } else if (outgoingArcTRef.current >= 1) {
        outgoingArcRef.current = null;
      }
      const [bh, bs, bl] = lerpHSL(
        prevColorRef.current,
        targetColorRef.current,
        easeInOutCubic(colorTRef.current)
      );
      const orbLightness = Math.max(highContrast ? 16 : 10, bl + (highContrast ? -14 : ORB_LIGHTNESS_OFFSET));
      const leadEase = easeInOutCubic(phaseLeadProgress);

      // Subtle phase-reactive background wash — ties the space to the orb color
      if (!highContrast) {
        const phaseBg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.5);
        phaseBg.addColorStop(0, `hsla(${bh}, ${bs}%, ${Math.max(orbLightness - 14, 8)}%, 0.045)`);
        phaseBg.addColorStop(1, 'transparent');
        ctx.fillStyle = phaseBg;
        ctx.fillRect(0, 0, w, h);
      }

      // Orb size — smoothly animated through phaseProgress
      // inhale: grow 0.45→1.0, exhale: shrink 1.0→0.45, hold/rest: maintain
      let animatedScale: number;
      if (reducedMotion) {
        animatedScale = phase.targetOrbScale;
      } else if (phase.phase === 'inhale') {
        const delayProgress = INHALE_TURNAROUND_DELAY_SECONDS / phase.duration;
        const softenedProgress = Math.max(0, (pp - delayProgress) / (1 - delayProgress));
        animatedScale = 0.45 + (1.0 - 0.45) * easeInOutCubic(softenedProgress);
      } else if (phase.phase === 'exhale') {
        animatedScale = 1.0 + (0.45 - 1.0) * easeInOutCubic(pp);
      } else if (phase.phase === 'hold') {
        // Subtle held-breath swell: sine arc peaks at midpoint, ~2% scale
        animatedScale = phase.targetOrbScale + 0.022 * Math.sin(pp * Math.PI);
      } else {
        // rest: completely still
        animatedScale = phase.targetOrbScale;
      }
      const sc = orbScaleRef.current;
      const desiredMinR = ORB_MIN_RADIUS * sc;
      const desiredMaxR = ORB_MAX_RADIUS * sc;
      const availableGuideR = Math.max(
        desiredMinR + MIN_GUIDE_RING_EXTRA,
        Math.min(w, h) / 2 - CANVAS_EDGE_PADDING
      );
      const maxR = Math.min(desiredMaxR, availableGuideR - MIN_GUIDE_RING_EXTRA);
      const minR = Math.min(desiredMinR, maxR * 0.55);
      const orbRadius = minR + (maxR - minR) * animatedScale;

      // Glow
      const glowLayers = highContrast
        ? [
            { r: orbRadius * 1.55, a: 0.07 },
            { r: orbRadius * 1.15, a: 0.13 },
          ]
        : [
            { r: orbRadius * 3.2, a: 0.024 },
            { r: orbRadius * 2.1, a: 0.044 },
            { r: orbRadius * 1.5, a: 0.082 },
            { r: orbRadius * 1.18, a: 0.15 },
          ];
      glowLayers.forEach(({ r, a }) => {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, `hsla(${bh}, ${bs}%, ${orbLightness}%, ${a})`);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Core orb
      const core = ctx.createRadialGradient(
        cx - orbRadius * 0.28, cy - orbRadius * 0.28, 0,
        cx, cy, orbRadius
      );
      core.addColorStop(0, `hsl(${bh}, ${Math.min(bs + 8, 100)}%, ${Math.min(orbLightness + 12, 84)}%)`);
      core.addColorStop(0.6, `hsl(${bh}, ${Math.max(bs - 2, 0)}%, ${Math.max(orbLightness - 4, 8)}%)`);
      core.addColorStop(1, `hsl(${bh}, ${Math.max(bs - 16, 0)}%, ${Math.max(orbLightness - 22, 8)}%)`);
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, orbRadius, 0, Math.PI * 2);
      ctx.fill();

      // Rim highlight
      ctx.strokeStyle = `hsla(${bh}, ${Math.min(bs + 20, 100)}%, ${Math.min(orbLightness + 22, 92)}%, ${highContrast ? 0.56 : 0.36})`;
      ctx.lineWidth = highContrast ? 2.4 : 1.75;
      ctx.beginPath();
      ctx.arc(cx, cy, orbRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Phase-transition ring flash — expands outward from orb edge, fades in ~350ms
      if (flashRef.current !== null) {
        flashRef.current.t = Math.min(1, flashRef.current.t + dt / FLASH_MS);
        const ft = flashRef.current.t;

        if (!reducedMotion && !highContrast) {
          const easedT = 1 - Math.pow(1 - ft, 3);
          const [fh, fs, fl] = targetColorRef.current;
          const flashRingR = orbRadius * (1.05 + easedT * 1.6);
          const durationScale = Math.min(1, Math.max(0.35, phase.duration / 4));
          const flashOpacity = (1 - ft) * 0.16 * durationScale;
          ctx.strokeStyle = `hsla(${fh}, ${fs}%, ${Math.min(fl + 14, 88)}%, ${flashOpacity})`;
          ctx.lineWidth = Math.max(0.5, 2.2 * (1 - ft * 0.5));
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.arc(cx, cy, flashRingR, 0, Math.PI * 2);
          ctx.stroke();
        }

        if (flashRef.current.t >= 1) {
          flashRef.current = null;
        }
      }

      // Session progress ring — now the only session-level progress indicator after the HUD bar was removed
      const guideExtra = Math.min(
        GUIDE_RING_EXTRA,
        Math.max(MIN_GUIDE_RING_EXTRA, availableGuideR - maxR)
      );
      const sessExtra = guideExtra >= GUIDE_RING_EXTRA ? 38 : 30;
      const sessR = maxR + Math.min(sessExtra, guideExtra - 12);
      ctx.strokeStyle = `hsla(${bh}, ${bs}%, ${orbLightness}%, ${highContrast ? 0.18 : 0.09})`;
      ctx.lineWidth = highContrast ? 2.6 : 2;
      ctx.beginPath();
      ctx.arc(cx, cy, sessR, 0, Math.PI * 2);
      ctx.stroke();

      if (sp > 0) {
        ctx.strokeStyle = `hsla(${bh}, ${bs}%, ${orbLightness}%, ${highContrast ? 0.52 : 0.32})`;
        ctx.lineWidth = highContrast ? 2.9 : 2;
        ctx.beginPath();
        ctx.arc(cx, cy, sessR, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * sp);
        ctx.stroke();
      }

      // Outer guide ring: off-white breath rail with phase-colored progress.
      const guideR = maxR + guideExtra;
      const guidePulse = highContrast
        ? 0.32
        : reducedMotion ? 0.14 : 0.13 + 0.04 * Math.sin(now * 0.0024);
      ctx.strokeStyle = `rgba(${CANVAS_COLORS.guideRing}, ${guidePulse})`;
      ctx.lineWidth = highContrast ? 3.1 : 2.25;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(cx, cy, guideR, 0, Math.PI * 2);
      ctx.stroke();

      const guideIncomingOpacity = outgoingArcRef.current
        ? (highContrast ? 0.34 : 0.2) + (highContrast ? 0.22 : 0.18) * easeInOutCubic(outgoingArcTRef.current)
        : highContrast ? 0.58 : 0.38;
      const guideSaturation = Math.max(18, Math.round(bs * 0.68));
      ctx.strokeStyle = `hsla(${bh}, ${guideSaturation}%, ${Math.min(orbLightness + 2, 82)}%, ${guideIncomingOpacity})`;
      ctx.lineWidth = highContrast ? 3.5 : 2.75;
      ctx.beginPath();
      ctx.arc(cx, cy, guideR, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pp);
      ctx.stroke();

      if (outgoingArcRef.current) {
        const [oh, os, ol] = outgoingArcRef.current.color;
        const oldOpacity = (highContrast ? 0.34 : 0.24) * (1 - easeInOutCubic(outgoingArcTRef.current));
        ctx.strokeStyle = `hsla(${oh}, ${Math.max(18, Math.round(os * 0.68))}%, ${Math.min(ol - 4, 82)}%, ${oldOpacity})`;
        ctx.lineWidth = highContrast ? 2.8 : 2.25;
        ctx.beginPath();
        ctx.arc(cx, cy, guideR, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * outgoingArcRef.current.progress);
        ctx.stroke();
      }

      if (phaseLeadProgress > 0) {
        const [nh, ns, nl] = nextColor;
        const currentAngle = -Math.PI / 2 + Math.PI * 2 * pp;
        const nextOpacity = (highContrast ? 0.12 : 0.06) + (highContrast ? 0.26 : 0.2) * leadEase;
        ctx.strokeStyle = `hsla(${nh}, ${Math.max(18, Math.round(ns * 0.64))}%, ${Math.min(nl - 4, 82)}%, ${nextOpacity})`;
        ctx.lineWidth = highContrast ? 3.6 : 3.1;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(cx, cy, guideR, currentAngle, Math.PI * 1.5);
        ctx.stroke();

        if (!highContrast) {
          const guideHalo = ctx.createRadialGradient(cx, cy, guideR - 8, cx, cy, guideR + 22);
          guideHalo.addColorStop(0, 'transparent');
          guideHalo.addColorStop(0.58, `hsla(${nh}, ${Math.max(18, Math.round(ns * 0.64))}%, ${Math.max(nl - 6, 10)}%, ${0.014 * leadEase})`);
          guideHalo.addColorStop(1, 'transparent');
          ctx.fillStyle = guideHalo;
          ctx.beginPath();
          ctx.arc(cx, cy, guideR + 22, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Particles are skipped when motion is reduced or contrast is increased.
      if (reducedMotion || highContrast) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      particlesRef.current.forEach((p) => {
        p.angle += p.speed * dt;
        const breathFactor = 0.82 + 0.18 * animatedScale;
        p.radius = p.baseRadius * breathFactor;
        const px = cx + Math.cos(p.angle) * p.radius;
        const py = cy + Math.sin(p.angle) * p.radius;
        const alpha = p.opacity * 0.72 * (0.75 + 0.25 * Math.sin(now * 0.00028 + p.phase));
        const pulsedSize = p.size * (0.7 + 0.3 * Math.sin(now * 0.00019 + p.phase + 1.2));
        ctx.fillStyle = `hsla(${bh}, ${Math.min(bs + 12, 100)}%, ${Math.min(orbLightness + 12, 84)}%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, Math.max(0.5, pulsedSize), 0, Math.PI * 2);
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [elapsedRef, sessionDuration]);

  return <canvas ref={canvasRef} aria-hidden="true" className="w-full h-full block" />;
}
