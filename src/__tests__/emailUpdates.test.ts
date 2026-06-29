jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

import { supabase } from '@/lib/supabase';
import {
  EMAIL_UPDATES_PENDING_KEY,
  consumePendingEmailUpdatesOptIn,
  readPendingEmailUpdatesOptIn,
  recordEmailUpdatesOptIn,
  rememberEmailUpdatesOptIn,
} from '@/lib/emailUpdates';

const mockFrom = supabase.from as jest.Mock;

describe('email update opt-in helpers', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('has no pending opt-in until the user explicitly checks the box', () => {
    expect(readPendingEmailUpdatesOptIn()).toBeNull();
  });

  it('remembers the chosen provider while the auth redirect completes', () => {
    expect(rememberEmailUpdatesOptIn('apple')).toBe(true);

    expect(readPendingEmailUpdatesOptIn()).toMatchObject({
      provider: 'apple',
    });
  });

  it('records normalized consent for the signed-in user', async () => {
    const upsert = jest.fn().mockResolvedValue({ error: null });
    mockFrom.mockReturnValue({ upsert });

    await expect(
      recordEmailUpdatesOptIn({
        userId: 'user-1',
        email: '  PERSON@Example.COM ',
        provider: 'email',
      })
    ).resolves.toEqual({});

    expect(mockFrom).toHaveBeenCalledWith('email_update_subscriptions');
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user-1',
        email: 'person@example.com',
        provider: 'email',
        opted_in: true,
      }),
      { onConflict: 'user_id' }
    );
  });

  it('consumes and clears pending consent only after a successful insert', async () => {
    const upsert = jest.fn().mockResolvedValue({ error: null });
    mockFrom.mockReturnValue({ upsert });

    rememberEmailUpdatesOptIn('google');

    await expect(consumePendingEmailUpdatesOptIn('user-1', 'person@example.com')).resolves.toEqual({
      recorded: true,
    });

    expect(localStorage.getItem(EMAIL_UPDATES_PENDING_KEY)).toBeNull();
  });

  it('keeps pending consent if the database write fails', async () => {
    const upsert = jest.fn().mockResolvedValue({ error: { message: 'table unavailable' } });
    mockFrom.mockReturnValue({ upsert });

    rememberEmailUpdatesOptIn('google');

    await expect(consumePendingEmailUpdatesOptIn('user-1', 'person@example.com')).resolves.toEqual({
      recorded: false,
      error: 'table unavailable',
    });

    expect(readPendingEmailUpdatesOptIn()).toMatchObject({ provider: 'google' });
  });
});
