'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';

const linkClass =
  'inline-flex min-h-11 items-center whitespace-nowrap px-2 hover:text-still-white/78 transition-colors duration-300';

export function PolicyFooter() {
  const { ready, isAnonymous } = useAuth();

  const signedIn = ready && !isAnonymous;
  const syncLabel = signedIn ? 'Signed In' : 'Sign In';
  const syncAria = signedIn
    ? 'Open practice page; you are signed in'
    : 'Open practice page to sign in';

  return (
    <footer className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] tracking-[0.14em] uppercase font-light text-still-white/55">
      <span className="inline-flex items-center gap-x-2">
        <Link href="/privacy" className={linkClass}>
          Privacy
        </Link>
        <span aria-hidden="true" className="text-still-white/35">·</span>
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
