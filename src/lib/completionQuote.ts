import { supabase } from '@/lib/supabase';

export interface Quote {
  text: string;
  attribution?: string | null;
}

export const FALLBACK_QUOTES: Quote[] = [
  { text: 'The quieter you become, the more you can hear.', attribution: 'Ram Dass' },
  { text: 'Breath is the bridge between the body and the mind.', attribution: 'Thich Nhat Hanh' },
  { text: 'In stillness, everything that needs to come will come.' },
  { text: 'You cannot always control what happens, only how you breathe through it.' },
  { text: 'Rest is not the absence of effort. It is the presence of ease.' },
];

const QUOTE_LOAD_TIMEOUT_MS = 500;
type QuoteRow = { text?: string | null; attribution?: string | null };

function chooseQuote(quotes: Quote[]) {
  return quotes[Math.floor(Math.random() * quotes.length)] ?? FALLBACK_QUOTES[0];
}

function normalizeQuotes(data: QuoteRow[] | null | undefined): Quote[] {
  return (data ?? []).flatMap((quote) => {
    if (typeof quote.text !== 'string') return [];

    const text = quote.text.trim();
    return text ? [{ text, attribution: quote.attribution ?? null }] : [];
  });
}

function fallbackQuote() {
  return chooseQuote(FALLBACK_QUOTES);
}

export async function loadCompletionQuote(timeoutMs = QUOTE_LOAD_TIMEOUT_MS): Promise<Quote> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  const timeoutQuote = new Promise<Quote>((resolve) => {
    timeoutId = setTimeout(() => resolve(fallbackQuote()), timeoutMs);
  });

  const remoteQuote = Promise.resolve(
    supabase
      .from('quotes')
      .select('text, attribution')
      .eq('active', true)
  )
    .then(({ data, error }) => {
      if (error) return fallbackQuote();

      const quotes = normalizeQuotes(data as QuoteRow[] | null);
      return quotes.length > 0 ? chooseQuote(quotes) : fallbackQuote();
    })
    .catch(() => fallbackQuote());

  const quote = await Promise.race([remoteQuote, timeoutQuote]);
  if (timeoutId !== null) clearTimeout(timeoutId);

  return quote;
}
