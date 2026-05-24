import Link from 'next/link';
import type { Metadata } from 'next';
import { SURFACE_GLOWS } from '@/lib/colors';
import { OrbMark } from '@/components/OrbMark';

export const metadata: Metadata = {
  title: 'Privacy, Exhale',
  description: 'How Exhale handles your data, sessions, and optional Backup & Sync.',
};

export default function PrivacyPage() {
  return (
    <main className="relative min-h-screen bg-forest-night flex justify-center px-6 py-16 text-still-white">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: SURFACE_GLOWS.stats }}
        aria-hidden="true"
      />
      <article className="relative z-10 flex w-full max-w-[58ch] flex-col gap-8">
        <header className="flex flex-col items-start gap-4">
          <OrbMark size="policy" />
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-extralight tracking-[0.3em] uppercase text-still-white/88">
              Privacy
            </h1>
            <p className="text-still-white/58 text-xs tracking-[0.05em] font-light">
              Last updated May 20, 2026
            </p>
          </div>
        </header>

        <Section title="What Exhale is">
          <p>
            Exhale is a free guided breathing tool that runs in your browser. Most use does
            not require an account or any personal information.
          </p>
        </Section>

        <Section title="What is stored on this device">
          <p>
            On every visit, Exhale keeps a small amount of data in your browser&apos;s local
            storage so the app remembers your preferences and practice without an account:
          </p>
          <ul className="list-disc pl-5 mt-3 space-y-1.5 marker:text-still-white/35">
            <li>Your session history (date, duration, breath count, session length).</li>
            <li>Your settings (circle size, sound choice, rhythm, last session length).</li>
            <li>A first-visit flag so the app does not repeat its first-run hints.</li>
            <li>A short in-progress session, kept for 60 seconds after exiting so you can resume.</li>
          </ul>
          <p className="mt-3">
            You can clear all of this by clearing browser storage for exhale.guide.
          </p>
        </Section>

        <Section title="Anonymous identity">
          <p>
            When you load Exhale, the app creates an anonymous record on its backend so
            settings and practice history can sync across devices if you later choose to
            sync. This identity has no email, name, or other personal information. It is
            tied to your browser. You are never asked to sign up to breathe.
          </p>
        </Section>

        <Section title="Optional Backup & Sync">
          <p>
            If you choose Backup & Sync on the Practice screen, Exhale can link your
            practice to either an email code or Google sign-in. This is optional. You can
            keep using Exhale without any sign-in.
          </p>
          <ul className="list-disc pl-5 mt-3 space-y-1.5 marker:text-still-white/35">
            <li>
              With email code sync, your email is stored so Exhale can send 6-digit
              sign-in codes.
            </li>
            <li>
              With Google sync, Google and Supabase handle the sign-in flow. Exhale uses
              the resulting identity only to keep your practice available across devices.
            </li>
            <li>
              Your practice history, timer length, circle size, sound choice, and rhythm
              are saved to the Exhale backend and restored on other devices you sign into.
            </li>
            <li>
              No marketing email is sent. Email is only used for Backup & Sync and
              deletion requests.
            </li>
          </ul>
        </Section>

        <Section title="Lightweight usage counts">
          <p>
            For synced users only, Exhale logs simple event counts (timer selected,
            session started, session exited, session completed) to help understand whether
            the default timer, sound choice, and first-use flow are working. These counts
            are tied to your Exhale user id. They are not sold or shared with third
            parties.
          </p>
        </Section>

        <Section title="What Exhale does not collect">
          <p>
            Exhale does not use advertising, third-party analytics, social trackers,
            browser fingerprinting, push notifications, or location data. There are no
            third-party scripts on the breathing pages. Google is only involved if you
            choose Google for Backup & Sync.
          </p>
        </Section>

        <Section title="How data is stored">
          <p>
            Practice history, settings, and usage counts (when you have Backup & Sync
            turned on) are stored on Supabase, with access controls so that only your
            identity can read or write your records. Local-only data stays on your device.
          </p>
        </Section>

        <Section title="Deleting your data">
          <p>
            To delete data on this device, clear your browser storage for exhale.guide.
          </p>
          <p className="mt-3">
            To delete cloud data after Backup & Sync, email djgreene@gmail.com from the
            address you synced with, or include the Google email you used for sync, and
            request deletion. Your records will be removed from the Exhale backend.
          </p>
        </Section>

        <Section title="Children">
          <p>
            Exhale is intended for people who can choose to use a breathing tool. It does
            not knowingly collect information from children under 13.
          </p>
        </Section>

        <Section title="Changes">
          <p>
            This page may be updated as Exhale changes. The Last updated date above will
            reflect the most recent revision.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            For privacy questions or to request deletion: djgreene@gmail.com.
          </p>
        </Section>

        <Link
          href="/"
          className="mt-4 inline-flex min-h-11 items-center text-still-white/58 text-xs tracking-[0.08em] uppercase font-light hover:text-still-white/78 transition-colors duration-300"
        >
          &larr; Back to Exhale
        </Link>
      </article>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-still-white/58 text-xs tracking-[0.08em] uppercase font-light">
        {title}
      </h2>
      <div className="text-still-white/74 text-[15px] font-light leading-relaxed">
        {children}
      </div>
    </section>
  );
}
