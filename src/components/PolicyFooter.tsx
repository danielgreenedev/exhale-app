'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';

const linkClass =
  'inline-flex min-h-9 items-center justify-center whitespace-nowrap rounded-xl border border-still-white/12 bg-still-white/[0.025] px-3 text-still-white/62 hover:border-still-white/24 hover:bg-still-white/[0.055] hover:text-still-white/80 active:border-still-white/30 active:bg-still-white/[0.08] active:text-still-white/88 transition-[background-color,border-color,color] duration-200 ease-out';

export function PolicyFooter() {
  const { ready, isAnonymous } = useAuth();

  const signedIn = ready && !isAnonymous;
  const syncLabel = signedIn ? 'Signed In' : 'Sign In';
  const syncAria = signedIn
    ? 'Open practice page; you are signed in'
    : 'Open practice page to sign in';

  return (
    <footer className="mt-6 flex flex-wrap items-center justify-center gap-2 text-[10px] tracking-[0.14em] uppercase font-light">
      <span className="inline-flex items-center gap-2">
        <Link href="/privacy" className={linkClass}>
          Privacy
        </Link>
        <Link href="/terms" className={linkClass}>
          Terms
        </Link>
      </span>
      <Link
        href="/stats#sync"
        className={linkClass}
        aria-label={syncAria}
      >
        {syncLabel}
      </Link>
    </footer>
  );
}
