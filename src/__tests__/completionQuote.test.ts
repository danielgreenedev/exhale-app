const mockEq = jest.fn();
const mockSelect = jest.fn(() => ({ eq: mockEq }));
const mockFrom = jest.fn(() => ({ select: mockSelect }));

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: (table: string) => mockFrom(table),
  },
}));

import { FALLBACK_QUOTES, loadCompletionQuote } from '@/lib/completionQuote';

describe('loadCompletionQuote', () => {
  beforeEach(() => {
    jest.useRealTimers();
    jest.spyOn(Math, 'random').mockReturnValue(0);
    mockFrom.mockClear();
    mockSelect.mockClear();
    mockEq.mockReset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('uses an active remote quote when the quote list is available', async () => {
    mockEq.mockResolvedValue({
      data: [{ text: 'Remote stillness', attribution: 'Test Author' }],
      error: null,
    });

    await expect(loadCompletionQuote(1000)).resolves.toEqual({
      text: 'Remote stillness',
      attribution: 'Test Author',
    });
    expect(mockFrom).toHaveBeenCalledWith('quotes');
    expect(mockSelect).toHaveBeenCalledWith('text, attribution');
    expect(mockEq).toHaveBeenCalledWith('active', true);
  });

  it('falls back when no active remote quotes are available', async () => {
    mockEq.mockResolvedValue({ data: [], error: null });

    await expect(loadCompletionQuote(1000)).resolves.toEqual(FALLBACK_QUOTES[0]);
  });

  it('falls back quickly when the quote request is slow', async () => {
    jest.useFakeTimers();
    mockEq.mockReturnValue(new Promise(() => {}));

    const quote = loadCompletionQuote(25);
    jest.advanceTimersByTime(25);

    await expect(quote).resolves.toEqual(FALLBACK_QUOTES[0]);
  });
});
