import { supabase } from '@/lib/supabase';

export type AppEventName =
  | 'timer_selected'
  | 'session_started'
  | 'session_exited'
  | 'session_complete';

export type AppEventProperties = Record<string, string | number | boolean | null>;

export function logAppEvent(
  userId: string | null | undefined,
  event: AppEventName,
  properties: AppEventProperties = {}
) {
  if (!userId) return;

  supabase.from('app_events').insert({
    user_id: userId,
    event,
    properties,
  }).then(({ error }) => {
    if (error) console.error(`[supabase] app_events ${event} insert failed:`, error);
  });
}
