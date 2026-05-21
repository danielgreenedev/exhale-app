const mockInsert = jest.fn();
const mockFrom = jest.fn((_table: string) => ({ insert: mockInsert }));

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: (table: string) => mockFrom(table),
  },
}));

import { logAppEvent } from '@/lib/appEvents';

describe('logAppEvent', () => {
  beforeEach(() => {
    mockFrom.mockClear();
    mockInsert.mockReset();
    mockInsert.mockResolvedValue({ error: null });
  });

  it('does not write analytics events before sync is enabled', () => {
    logAppEvent(null, 'timer_selected', { length: 'quick' });

    expect(mockFrom).not.toHaveBeenCalled();
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it('writes an app event for a signed-in user', () => {
    logAppEvent('user-123', 'session_started', {
      length: 'short',
      rhythm: 'gentle',
      duration: 308,
      cycles: 14,
    });

    expect(mockFrom).toHaveBeenCalledWith('app_events');
    expect(mockInsert).toHaveBeenCalledWith({
      user_id: 'user-123',
      event: 'session_started',
      properties: {
        length: 'short',
        rhythm: 'gentle',
        duration: 308,
        cycles: 14,
      },
    });
  });

  it('keeps Supabase failures non-blocking', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockInsert.mockResolvedValue({ error: new Error('rate limited') });

    logAppEvent('user-123', 'session_complete', { length: 'quick' });
    await Promise.resolve();

    expect(consoleError).toHaveBeenCalledWith(
      '[supabase] app_events session_complete insert failed:',
      expect.any(Error)
    );

    consoleError.mockRestore();
  });
});
