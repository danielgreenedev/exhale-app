-- Stores explicit opt-in consent for future Exhale email updates.
-- Auth provider email addresses alone are not marketing consent.

create table if not exists email_update_subscriptions (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  provider    text not null,
  opted_in    boolean not null default true,
  opted_in_at timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table email_update_subscriptions enable row level security;

create policy "Users read own email update consent" on email_update_subscriptions
  for select using (auth.uid() = user_id);

create policy "Users create own email update consent" on email_update_subscriptions
  for insert with check (auth.uid() = user_id and opted_in = true);

create policy "Users update own email update consent" on email_update_subscriptions
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
