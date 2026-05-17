'use client';

import { useEffect, useRef } from 'react';
import { PhaseConfig, easeInOutCubic } from '@/lib/breathing';

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
  phaseProgress: number;
  sessionProgress: number;
}

const PARTICLE_COUNT = 60;
const ORB_MIN_RADIUS = 60;
const ORB_MAX_RADIUS = 140;

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

export default function BreathingOrb({ currentPhase, phaseProgress, sessionProgress }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  // Live state refs — updated each render, read inside the draw loop
  const phaseRef = useRef(currentPhase);
  const phaseProgressRef = useRef(phaseProgress);
  const sessionProgressRef = useRef(sessionProgress);

  // Color transition state
  const prevColorRef = useRef<[number, number, number]>(parseHSL(currentPhase.color));
  const targetColorRef = useRef<[number, number, number]>(parseHSL(currentPhase.color));
  const colorTRef = useRef(1); // 0→1 transition progress

  // Keep refs in sync with props each render
  useEffect(() => {
    const newTarget = parseHSL(currentPhase.color);
    if (
      newTarget[0] !== targetColorRef.current[0] ||
      newTarget[1] !== targetColorRef.current[1] ||
      newTarget[2] !== targetColorRef.current[2]
    ) {
      prevColorRef.current = lerpHSL(prevColorRef.current, targetColorRef.current, colorTRef.current);
      targetColorRef.current = newTarget;
      colorTRef.current = 0;
    }
    phaseRef.current = currentPhase;
    phaseProgressRef.current = phaseProgress;
    sessionProgressRef.current = sessionProgress;
  });

  // Init particles
  useEffect(() => {
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      angle: (i / PARTICLE_COUNT) * Math.PI * 2 + Math.random() * 0.3,
      radius: 160 + Math.random() * 120,
      baseRadius: 160 + Math.random() * 120,
      size: 1.5 + Math.random() * 2.5,
      speed: 0.0003 + Math.random() * 0.0004,
      opacity: 0.15 + Math.random() * 0.45,
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  // Canvas draw loop — runs once, reads from refs
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let frameTime = performance.now();

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = (now: number) => {
      const dt = Math.min(now - frameTime, 50); // cap at 50ms to avoid jumps
      frameTime = now;

      const phase = phaseRef.current;
      const pp = phaseProgressRef.current;
      const sp = sessionProgressRef.current;

      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Background
      ctx.fillStyle = '#05060f';
      ctx.fillRect(0, 0, w, h);

      // Vignette
      const vig = ctx.createRadialGradient(cx, cy, h * 0.15, cx, cy, h * 0.8);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(0,0,0,0.6)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);

      // Advance color transition
      if (colorTRef.current < 1) {
        colorTRef.current = Math.min(1, colorTRef.current + dt / 700);
      }
      const [bh, bs, bl] = lerpHSL(
        prevColorRef.current,
        targetColorRef.current,
        easeInOutCubic(colorTRef.current)
      );

      // Orb size — smoothly animated through phaseProgress
      // inhale: grow 0.45→1.0, exhale: shrink 1.0→0.45, hold/rest: maintain
      let animatedScale: number;
      if (phase.phase === 'inhale') {
        animatedScale = 0.45 + (1.0 - 0.45) * easeInOutCubic(pp);
      } else if (phase.phase === 'exhale') {
        animatedScale = 1.0 + (0.45 - 1.0) * easeInOutCubic(pp);
      } else {
        animatedScale = phase.targetOrbScale;
      }
      const orbRadius = ORB_MIN_RADIUS + (ORB_MAX_RADIUS - ORB_MIN_RADIUS) * animatedScale;

      // Glow
      [
        { r: orbRadius * 3.2, a: 0.035 },
        { r: orbRadius * 2.1, a: 0.065 },
        { r: orbRadius * 1.5, a: 0.12 },
        { r: orbRadius * 1.18, a: 0.22 },
      ].forEach(({ r, a }) => {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, `hsla(${bh}, ${bs}%, ${bl}%, ${a})`);
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
      core.addColorStop(0, `hsl(${bh}, ${Math.min(bs + 12, 100)}%, ${Math.min(bl + 22, 96)}%)`);
      core.addColorStop(0.6, `hsl(${bh}, ${bs}%, ${bl}%)`);
      core.addColorStop(1, `hsl(${bh}, ${Math.max(bs - 12, 0)}%, ${Math.max(bl - 18, 8)}%)`);
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, orbRadius, 0, Math.PI * 2);
      ctx.fill();

      // Rim highlight
      ctx.strokeStyle = `hsla(${bh}, ${Math.min(bs + 25, 100)}%, ${Math.min(bl + 30, 98)}%, 0.35)`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, orbRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Phase progress ring
      const ringR = ORB_MAX_RADIUS + 24;
      ctx.strokeStyle = `hsla(${bh}, ${bs}%, ${bl}%, 0.12)`;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = `hsla(${bh}, ${bs}%, ${bl}%, 0.8)`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, ringR, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pp);
      ctx.stroke();

      // Session progress ring
      const sessR = ringR + 14;
      ctx.strokeStyle = `hsla(${bh}, ${bs}%, ${bl}%, 0.07)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, sessR, 0, Math.PI * 2);
      ctx.stroke();

      if (sp > 0) {
        ctx.strokeStyle = `hsla(${bh}, ${bs}%, ${bl}%, 0.32)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, sessR, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * sp);
        ctx.stroke();
      }

      // Particles
      particlesRef.current.forEach((p) => {
        p.angle += p.speed * dt;
        const breathFactor = 0.82 + 0.18 * animatedScale;
        p.radius = p.baseRadius * breathFactor + Math.sin(now * 0.001 + p.phase) * 7;
        const px = cx + Math.cos(p.angle) * p.radius;
        const py = cy + Math.sin(p.angle) * p.radius;
        const alpha = p.opacity * (0.45 + 0.55 * Math.sin(now * 0.0009 + p.phase));
        ctx.fillStyle = `hsla(${bh}, ${Math.min(bs + 18, 100)}%, ${Math.min(bl + 18, 96)}%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
}
