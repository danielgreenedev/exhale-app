'use client';

import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { readStats } from '@/hooks/useSessionStats';

const linkClass =
  'inline-flex min-h-11 items-center whitespace-nowrap px-2 hover:text-still-white/78 transition-colors duration-300';

export function PolicyFooter() {
  const { ready, isAnonymous, startGoogleBackupSync } = useAuth();
  const router = useRouter();
  const [hasPracticeHistory, setHasPracticeHistory] = useState<boolean | null>(null);
  const [openingGoogle, setOpeningGoogle] = useState(false);

  useEffect(() => {
    setHasPracticeHistory(readStats().sessions.length > 0);
  }, []);

  const handleSignInClick = async (event: MouseEvent<HTMLAnchorElement>) => {
    if (!ready || !isAnonymous || hasPracticeHistory !== false) return;

    event.preventDefault();
    setOpeningGoogle(true);
    const { error } = await startGoogleBackupSync();
    if (error) {
      router.push(`/stats?error=${encodeURIComponent(error)}#sync`);
      setOpeningGoogle(false);
    }
  };

  const signedIn = ready && !isAnonymous;
  const syncLabel = signedIn ? 'Signed In' : openingGoogle ? 'Opening Google...' : 'Sign In';
  const syncAria = signedIn
    ? 'Open practice page; you are signed in'
    : hasPracticeHistory
      ? 'Open practice page to sign in with Google'
      : 'Sign in with Google';

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
        onClick={handleSignInClick}
      >
        {syncLabel}
      </Link>
    </footer>
  );
}
