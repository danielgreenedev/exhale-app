import { supabase } from './supabase';

export type EmailUpdatesProvider = 'google' | 'apple' | 'email';

export interface PendingEmailUpdatesOptIn {
  provider: EmailUpdatesProvider;
  requestedAt: string;
}

export const EMAIL_UPDATES_PENDING_KEY = 'exhale-email-updates-pending';

export function rememberEmailUpdatesOptIn(provider: EmailUpdatesProvider): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const pending: PendingEmailUpdatesOptIn = {
      provider,
      requestedAt: new Date().toISOString(),
    };
    localStorage.setItem(EMAIL_UPDATES_PENDING_KEY, JSON.stringify(pending));
    return true;
  } catch {
    return false;
  }
}

export function readPendingEmailUpdatesOptIn(): PendingEmailUpdatesOptIn | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(EMAIL_UPDATES_PENDING_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PendingEmailUpdatesOptIn>;
    if (parsed.provider !== 'google' && parsed.provider !== 'apple' && parsed.provider !== 'email') {
      return null;
    }
    if (!parsed.requestedAt || Number.isNaN(Date.parse(parsed.requestedAt))) {
      return null;
    }
    return {
      provider: parsed.provider,
      requestedAt: parsed.requestedAt,
    };
  } catch {
    return null;
  }
}

export function clearPendingEmailUpdatesOptIn(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(EMAIL_UPDATES_PENDING_KEY);
  } catch {
    // If storage is blocked, there is nothing useful to clear.
  }
}

export async function recordEmailUpdatesOptIn({
  userId,
  email,
  provider,
}: {
  userId: string;
  email: string;
  provider: EmailUpdatesProvider;
}): Promise<{ error?: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!userId || !normalizedEmail) {
    return { error: 'Email updates could not be enabled without a signed-in email.' };
  }

  const now = new Date().toISOString();
  const { error } = await supabase.from('email_update_subscriptions').upsert(
    {
      user_id: userId,
      email: normalizedEmail,
      provider,
      opted_in: true,
      opted_in_at: now,
      updated_at: now,
    },
    { onConflict: 'user_id' }
  );

  if (error) {
    return { error: error.message };
  }

  return {};
}

export async function consumePendingEmailUpdatesOptIn(
  userId: string | null,
  email: string | null
): Promise<{ recorded: boolean; error?: string }> {
  const pending = readPendingEmailUpdatesOptIn();
  if (!pending) return { recorded: false };
  if (!userId || !email) {
    return { recorded: false, error: 'Email updates will be enabled after sign-in finishes.' };
  }

  const result = await recordEmailUpdatesOptIn({
    userId,
    email,
    provider: pending.provider,
  });

  if (result.error) {
    return { recorded: false, error: result.error };
  }

  clearPendingEmailUpdatesOptIn();
  return { recorded: true };
}
