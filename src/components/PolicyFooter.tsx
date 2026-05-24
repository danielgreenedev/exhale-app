import Link from 'next/link';

export function PolicyFooter() {
  return (
    <footer className="mt-6 flex items-center justify-center gap-3 text-[10px] tracking-[0.18em] uppercase font-light text-still-white/55">
      <Link
        href="/privacy"
        className="inline-flex min-h-11 items-center px-2 hover:text-still-white/78 transition-colors duration-300"
      >
        Privacy
      </Link>
      <span aria-hidden="true" className="text-still-white/35">·</span>
      <Link
        href="/terms"
        className="inline-flex min-h-11 items-center px-2 hover:text-still-white/78 transition-colors duration-300"
      >
        Terms
      </Link>
    </footer>
  );
}
