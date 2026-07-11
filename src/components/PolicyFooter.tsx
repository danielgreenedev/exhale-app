'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';

const linkClass =
  'inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-lg border border-still-white/[0.12] bg-still-white/[0.025] px-3 text-still-white/[0.62] hover:border-still-white/[0.24] hover:bg-still-white/[0.055] hover:text-still-white/[0.80] active:border-still-white/[0.30] active:bg-still-white/[0.08] active:text-still-white/[0.88] transition-[background-color,border-color,color] duration-200 ease-out';

export function PolicyFooter() {
  const { ready, isAnonymous } = useAuth();

  const signedIn = ready && !isAnonymous;
  const syncLabel = signedIn ? 'Signed In' : 'Sign In';
  const syncAria = signedIn
    ? 'Open account settings; you are signed in'
    : 'Open practice page to sign in';
  const syncHref = signedIn ? '/account' : '/stats#sync';

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
        href={syncHref}
        className={linkClass}
        aria-label={syncAria}
      >
        {syncLabel}
      </Link>
    </footer>
  );
}
