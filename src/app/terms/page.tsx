import Link from 'next/link';
import type { Metadata } from 'next';
import { SURFACE_GLOWS } from '@/lib/colors';
import { OrbMark } from '@/components/OrbMark';

export const metadata: Metadata = {
  title: 'Terms, Exhale',
  description: 'Terms of use for Exhale, a free guided breathing tool.',
};

export default function TermsPage() {
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
              Terms
            </h1>
            <p className="text-still-white/58 text-xs tracking-[0.05em] font-light">
              Last updated May 20, 2026
            </p>
          </div>
        </header>

        <Section title="What Exhale is">
          <p>
            Exhale is a free, guided breathing tool. It offers paced breathing rhythms
            and lets people practice without an account or any required setup.
            By using Exhale at exhale.guide, you agree to these terms.
          </p>
        </Section>

        <Section title="Not medical advice">
          <p>
            Exhale is not a medical device, mental health service, or substitute for
            professional care. Nothing in the app diagnoses, treats, cures, or prevents
            any condition. If you are experiencing a medical or mental health emergency,
            contact your local emergency services or a qualified provider.
          </p>
          <p className="mt-3">
            If you have a heart condition, a breathing condition, a history of fainting,
            or any other reason that paced breathing or brief breath holding may not be
            appropriate for you, please consult a qualified provider before using Exhale.
          </p>
        </Section>

        <Section title="Use at your own discretion">
          <p>
            You use Exhale at your own discretion. Stop any time anything feels
            uncomfortable. You are responsible for deciding whether the breathing rhythm
            is appropriate for you.
          </p>
        </Section>

        <Section title="Acceptable use">
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 mt-3 space-y-1.5 marker:text-still-white/35">
            <li>Use Exhale in a way that disrupts the service for other people.</li>
            <li>
              Attempt to break, probe for vulnerabilities in, or circumvent access
              controls on the service.
            </li>
            <li>Use the service to harm others or to violate any law.</li>
          </ul>
        </Section>

        <Section title="Optional Backup & Sync">
          <p>
            Exhale can be used anonymously. Backup & Sync is optional and exists only to
            help you keep practice history and settings across devices.
          </p>
          <p className="mt-3">
            If you choose email code sync or Google sign-in, Supabase and the selected
            provider are used to maintain your session and connect your practice data to
            the same identity on another device. You are responsible for access to any
            email or provider account you use for sync.
          </p>
          <p className="mt-3">
            Backup & Sync is provided on the same best-effort basis as the rest of
            Exhale. It is not required to start or complete a breathing session.
          </p>
        </Section>

        <Section title="Intellectual property">
          <p>
            The Exhale name, design, code, and content belong to the project author.
            Personal use of the app at exhale.guide is free. You may not redistribute,
            sell, or repackage Exhale as your own product.
          </p>
        </Section>

        <Section title="Service availability">
          <p>
            Exhale is offered on a best-effort basis with no uptime guarantee. The
            service can change, pause, or end without notice.
          </p>
        </Section>

        <Section title="No warranties">
          <p>
            Exhale is provided as is, without warranties of any kind, either express or
            implied. To the maximum extent permitted by law, the author disclaims any
            liability for indirect, incidental, special, consequential, or punitive
            damages arising out of or relating to your use of Exhale.
          </p>
        </Section>

        <Section title="Changes">
          <p>
            These terms may change as Exhale changes. The Last updated date above will
            reflect the most recent revision. Continued use of the app after changes
            means you accept the updated terms.
          </p>
        </Section>

        <Section title="Contact">
          <p>Questions about these terms: djgreene@gmail.com.</p>
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
