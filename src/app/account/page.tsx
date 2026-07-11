'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { OrbMark } from '@/components/OrbMark';
import { PolicyFooter } from '@/components/PolicyFooter';
import { SURFACE_GLOWS } from '@/lib/colors';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import {
  readEmailUpdatesPreference,
  setEmailUpdatesPreference,
  type EmailUpdatesProvider,
} from '@/lib/emailUpdates';

type SubscriptionStatus = 'free' | 'premium';

const SUPPORT_EMAIL = 'djgreene@gmail.com';

const premiumThemes = [
  {
    name: 'Garden',
    description: 'A warmer botanical skin for softer daylight practice.',
  },
  {
    name: 'Lantern',
    description: 'A dim evening skin for low-light breathing.',
  },
  {
    name: 'Linen',
    description: 'A quiet light skin for users who prefer less darkness.',
  },
];

function providerLabel(provider: string): string {
  if (provider === 'google') return 'Google';
  if (provider === 'apple') return 'Apple';
  if (provider === 'email') return 'Email';
  return provider;
}

function bestEmailProvider(providers: string[]): EmailUpdatesProvider {
  if (providers.includes('apple')) return 'apple';
  if (providers.includes('google')) return 'google';
  return 'email';
}

function getSubscriptionStatus(): SubscriptionStatus {
  return 'free';
}

export default function AccountPage() {
  const {
    userId,
    email,
    isAnonymous,
    ready,
    signOutToAnonymous,
  } = useAuth();
  const [connectedProviders, setConnectedProviders] = useState<string[]>([]);
  const [emailUpdatesOptIn, setEmailUpdatesOptIn] = useState(false);
  const [emailUpdatesReady, setEmailUpdatesReady] = useState(false);
  const [emailUpdatesSaving, setEmailUpdatesSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [busySignOut, setBusySignOut] = useState(false);

  const signedIn = ready && Boolean(userId && email && !isAnonymous);
  const subscriptionStatus = getSubscriptionStatus();
  const premiumActive = subscriptionStatus === 'premium';
  const primaryProvider = useMemo(() => bestEmailProvider(connectedProviders), [connectedProviders]);

  useEffect(() => {
    if (!ready || !userId || isAnonymous) {
      setConnectedProviders([]);
      return;
    }

    let active = true;

    void supabase.auth.getUserIdentities().then(({ data, error }) => {
      if (!active || error) return;
      setConnectedProviders(data.identities.map((identity) => identity.provider));
    });

    return () => {
      active = false;
    };
  }, [isAnonymous, ready, userId]);

  useEffect(() => {
    if (!ready || !userId || isAnonymous) {
      setEmailUpdatesOptIn(false);
      setEmailUpdatesReady(true);
      return;
    }

    let active = true;

    setEmailUpdatesReady(false);
    void readEmailUpdatesPreference(userId).then(({ optedIn, error }) => {
      if (!active) return;
      setEmailUpdatesOptIn(optedIn);
      setEmailUpdatesReady(true);
      if (error) {
        setMessage('Email Updates could not load. Try again in a moment.');
      }
    });

    return () => {
      active = false;
    };
  }, [isAnonymous, ready, userId]);

  const handleEmailUpdatesChange = async (checked: boolean) => {
    if (!userId || !email) return;

    setEmailUpdatesSaving(true);
    setMessage('');

    const { error } = await setEmailUpdatesPreference({
      userId,
      email,
      provider: primaryProvider,
      optedIn: checked,
    });

    setEmailUpdatesSaving(false);

    if (error) {
      setMessage('Email Updates could not be changed. Please try again.');
      return;
    }

    setEmailUpdatesOptIn(checked);
    setMessage(checked ? 'Email Updates enabled.' : 'Email Updates turned off.');
  };

  const handleSignOut = async () => {
    setBusySignOut(true);
    setMessage('');
    await signOutToAnonymous();
    setBusySignOut(false);
  };

  return (
    <main className="relative min-h-screen bg-forest-night flex justify-center px-4 py-10 text-still-white sm:px-6 sm:py-14">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: SURFACE_GLOWS.stats }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex w-full max-w-[34rem] flex-col gap-8">
        <header className="flex flex-col items-center gap-5 text-center">
          <OrbMark size="stats" ring breathe />
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-3xl font-extralight tracking-[0.3em] uppercase text-still-white/[0.88]">
              Account
            </h1>
            <p className="max-w-[26rem] text-sm font-light leading-relaxed tracking-[0.04em] text-still-white/[0.58]">
              Manage sign-in, optional updates, and future premium extras. The breathing tool stays fully useful for free.
            </p>
          </div>
        </header>

        {!ready ? (
          <AccountSection title="Checking Account">
            <p className="text-sm font-light leading-relaxed text-still-white/[0.62]">
              Checking the signed-in account on this device.
            </p>
          </AccountSection>
        ) : !signedIn ? (
          <SignedOutAccount />
        ) : (
          <>
            <AccountSection title="Welcome">
              <div className="flex flex-col gap-3">
                <p className="text-sm font-light leading-relaxed text-still-white/[0.70]">
                  Your account keeps practice history and preferences available across devices.
                  Premium features will add optional themes and an advanced breathing pattern creator, but the curated breathing sessions remain free.
                </p>
                <Link
                  href="/"
                  className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-emerald-pulse/[0.32] bg-emerald-pulse/[0.10] px-4 text-xs font-light uppercase tracking-[0.18em] text-still-white/[0.88] transition-all duration-300 hover:border-emerald-pulse/[0.55] hover:bg-emerald-pulse/[0.16] hover:text-still-white"
                >
                  Start Breathing
                </Link>
              </div>
            </AccountSection>

            <AccountSection title="Basic Contact Info">
              <InfoRows
                rows={[
                  ['Email', email ?? 'Not available'],
                  ['Connected sign-in', connectedProviders.length > 0 ? connectedProviders.map(providerLabel).join(', ') : 'Checking'],
                  ['Contact details', 'No phone, address, or profile photo stored'],
                ]}
              />
            </AccountSection>

            <AccountSection title="Subscription">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4 border-b border-still-white/[0.10] pb-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-light text-still-white/[0.78]">
                      {premiumActive ? 'Premium active' : 'Free'}
                    </span>
                    <span className="text-xs font-light leading-relaxed text-still-white/[0.55]">
                      {premiumActive
                        ? 'Premium options are available on this account.'
                        : 'The complete guided breathing tool remains free.'}
                    </span>
                  </div>
                  <span className="shrink-0 rounded-lg border border-still-white/[0.16] px-3 py-2 text-[10px] font-light uppercase tracking-[0.14em] text-still-white/[0.58]">
                    {premiumActive ? 'Premium' : 'Free'}
                  </span>
                </div>
                <button
                  type="button"
                  disabled
                  className="min-h-11 rounded-2xl border border-still-white/[0.12] px-4 text-xs font-light uppercase tracking-[0.18em] text-still-white/[0.36]"
                >
                  Manage Billing
                </button>
              </div>
            </AccountSection>

            <AccountSection title="Theme Selector">
              <div className="flex flex-col gap-3">
                <ThemeOption
                  name="Still Water"
                  description="The current calm dark theme."
                  status="Included"
                  active
                />
                {premiumThemes.map((theme) => (
                  <ThemeOption
                    key={theme.name}
                    name={theme.name}
                    description={theme.description}
                    status={premiumActive ? 'Available' : 'Premium'}
                    locked={!premiumActive}
                  />
                ))}
              </div>
            </AccountSection>

            <AccountSection title="Premium Tools">
              <label className="flex min-h-14 items-center justify-between gap-4 rounded-2xl border border-still-white/[0.12] px-4 py-3 text-still-white/[0.62]">
                <span className="flex flex-col gap-1">
                  <span className="text-sm font-light text-still-white/[0.78]">
                    Breathing Pattern Creator
                  </span>
                  <span className="text-xs font-light leading-relaxed text-still-white/[0.52]">
                    Build custom patterns after the curated free sessions.
                  </span>
                </span>
                <input
                  type="checkbox"
                  disabled={!premiumActive}
                  checked={false}
                  onChange={() => {}}
                  aria-label="Breathing Pattern Creator premium toggle"
                  className="h-4 w-4 shrink-0 rounded border-still-white/[0.30] bg-transparent accent-emerald-pulse disabled:opacity-40"
                />
              </label>
              {!premiumActive && (
                <p className="mt-3 text-xs font-light leading-relaxed text-still-white/[0.52]">
                  Premium gates only advanced personalization. Default rhythms, local history, sync, and guided sessions stay free.
                </p>
              )}
            </AccountSection>

            <AccountSection title="Contact Preferences">
              <label className="flex min-h-14 items-start gap-3 rounded-2xl border border-still-white/[0.12] px-4 py-3 text-still-white/[0.62] transition-colors duration-300 hover:border-still-white/[0.22]">
                <input
                  type="checkbox"
                  checked={emailUpdatesOptIn}
                  disabled={!emailUpdatesReady || emailUpdatesSaving}
                  onChange={(event) => void handleEmailUpdatesChange(event.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-still-white/[0.30] bg-transparent accent-emerald-pulse disabled:opacity-40"
                />
                <span className="flex flex-col gap-1">
                  <span className="text-xs font-light uppercase tracking-[0.14em] text-still-white/[0.70]">
                    Email Updates
                  </span>
                  <span className="text-xs font-light leading-relaxed text-still-white/[0.55]">
                    Optional notes about Exhale. Sign-in email is not marketing consent unless this is checked.
                  </span>
                </span>
              </label>
              {message && (
                <p className="mt-3 text-xs font-light leading-relaxed text-emerald-pulse/[0.78]" aria-live="polite">
                  {message}
                </p>
              )}
            </AccountSection>

            <AccountSection title="Data And Privacy">
              <div className="flex flex-col gap-3">
                <Link
                  href="/privacy"
                  className="text-sm font-light text-still-white/[0.68] underline decoration-still-white/[0.24] underline-offset-4 transition-colors duration-300 hover:text-still-white/[0.88]"
                >
                  Review privacy policy
                </Link>
                <a
                  href={`mailto:${SUPPORT_EMAIL}?subject=Exhale%20account%20data%20request`}
                  className="text-sm font-light text-still-white/[0.68] underline decoration-still-white/[0.24] underline-offset-4 transition-colors duration-300 hover:text-still-white/[0.88]"
                >
                  Request cloud data deletion
                </a>
                <p className="text-xs font-light leading-relaxed text-still-white/[0.52]">
                  Local practice history can also be cleared from this browser by clearing site data for exhale.guide.
                </p>
              </div>
            </AccountSection>

            <AccountSection title="Support">
              <div className="flex flex-col gap-3">
                <a
                  href={`mailto:${SUPPORT_EMAIL}?subject=Exhale%20support`}
                  className="text-sm font-light text-still-white/[0.68] underline decoration-still-white/[0.24] underline-offset-4 transition-colors duration-300 hover:text-still-white/[0.88]"
                >
                  Contact support
                </a>
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={busySignOut}
                  className="min-h-11 rounded-2xl border border-still-white/[0.18] px-4 text-xs font-light uppercase tracking-[0.18em] text-still-white/[0.58] transition-all duration-300 hover:border-still-white/[0.30] hover:bg-still-white/[0.05] hover:text-still-white/[0.75] disabled:opacity-40"
                >
                  {busySignOut ? 'Signing Out...' : 'Sign Out Here'}
                </button>
              </div>
            </AccountSection>
          </>
        )}

        <Link
          href="/stats"
          className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-still-white/[0.18] px-4 text-xs font-light uppercase tracking-[0.2em] text-still-white/[0.58] transition-all duration-300 hover:border-still-white/[0.30] hover:text-still-white/[0.75]"
        >
          &larr; Back To Practice
        </Link>

        <PolicyFooter />
      </div>
    </main>
  );
}

function SignedOutAccount() {
  return (
    <AccountSection title="Create Account">
      <div className="flex flex-col gap-4">
        <p className="text-sm font-light leading-relaxed text-still-white/[0.70]">
          You can breathe without an account. Sign in only if you want history across devices,
          contact preferences, and future premium personalization in one place.
        </p>
        <p className="text-sm font-light leading-relaxed text-still-white/[0.62]">
          Premium will add optional themes and a custom pattern creator. The fully functional free breathing tool stays available.
        </p>
        <Link
          href="/stats#sync"
          className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-emerald-pulse/[0.32] bg-emerald-pulse/[0.10] px-4 text-xs font-light uppercase tracking-[0.18em] text-still-white/[0.88] transition-all duration-300 hover:border-emerald-pulse/[0.55] hover:bg-emerald-pulse/[0.16] hover:text-still-white"
        >
          Sign In
        </Link>
      </div>
    </AccountSection>
  );
}

function AccountSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-still-white/[0.10] pt-5">
      <h2 className="mb-4 text-xs font-light uppercase tracking-[0.14em] text-still-white/[0.58]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function InfoRows({ rows }: { rows: Array<[string, string]> }) {
  return (
    <div className="flex flex-col">
      {rows.map(([label, value]) => (
        <div
          key={label}
          className="flex flex-col gap-1 border-b border-still-white/[0.08] py-3 last:border-b-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
        >
          <span className="text-xs font-light uppercase tracking-[0.14em] text-still-white/[0.48]">
            {label}
          </span>
          <span className="text-sm font-light leading-relaxed text-still-white/[0.74] sm:text-right">
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}

function ThemeOption({
  name,
  description,
  status,
  active = false,
  locked = false,
}: {
  name: string;
  description: string;
  status: string;
  active?: boolean;
  locked?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={locked}
      aria-pressed={active}
      className={`flex min-h-16 items-center justify-between gap-4 rounded-2xl border px-4 py-3 text-left transition-all duration-300 ${
        active
          ? 'border-emerald-pulse/[0.36] bg-emerald-pulse/[0.10]'
          : 'border-still-white/[0.12] bg-still-white/[0.015] hover:border-still-white/[0.24] hover:bg-still-white/[0.045]'
      } ${locked ? 'opacity-70' : ''}`}
    >
      <span className="flex min-w-0 flex-col gap-1">
        <span className="text-sm font-light text-still-white/[0.78]">{name}</span>
        <span className="text-xs font-light leading-relaxed text-still-white/[0.52]">{description}</span>
      </span>
      <span className="shrink-0 rounded-lg border border-still-white/[0.14] px-2.5 py-1.5 text-[10px] font-light uppercase tracking-[0.12em] text-still-white/[0.56]">
        {status}
      </span>
    </button>
  );
}
