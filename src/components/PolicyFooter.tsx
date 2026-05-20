import Link from 'next/link';

export function PolicyFooter() {
  return (
    <footer className="mt-6 flex items-center justify-center gap-4 text-[10px] tracking-[0.18em] uppercase font-light text-still-white/45">
      <Link
        href="/privacy"
        className="py-2 px-1 hover:text-still-white/75 transition-colors duration-300"
      >
        Privacy
      </Link>
      <span aria-hidden="true" className="text-still-white/30">·</span>
      <Link
        href="/terms"
        className="py-2 px-1 hover:text-still-white/75 transition-colors duration-300"
      >
        Terms
      </Link>
    </footer>
  );
}
