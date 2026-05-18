-- Run this in the Supabase SQL editor: https://supabase.com/dashboard/project/hlipziitsogzzadkikfp/sql

-- ─── User settings ──────────────────────────────────────────────────────────
create table if not exists user_settings (
  user_id        uuid primary key references auth.users(id) on delete cascade,
  orb_scale      float not null default 1.0,
  sound_palette  text not null default 'air',
  session_length text,
  updated_at     timestamptz not null default now()
);

alter table user_settings enable row level security;

create policy "Users manage own settings" on user_settings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─── Breathing sessions ──────────────────────────────────────────────────────
create table if not exists breathing_sessions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  date       date not null,
  duration   int not null,
  cycles     int not null,
  length     text not null,
  created_at timestamptz not null default now()
);

alter table breathing_sessions enable row level security;

create policy "Users manage own sessions" on breathing_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─── App events / metrics ────────────────────────────────────────────────────
create table if not exists app_events (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete set null,
  event      text not null,
  properties jsonb,
  created_at timestamptz not null default now()
);

alter table app_events enable row level security;

create policy "Users insert own events" on app_events
  for insert with check (auth.uid() = user_id);

-- ─── Quotes ──────────────────────────────────────────────────────────────────
create table if not exists quotes (
  id          uuid primary key default gen_random_uuid(),
  text        text not null,
  attribution text,
  active      boolean not null default true
);

alter table quotes enable row level security;

create policy "Anyone reads active quotes" on quotes
  for select using (active = true);

-- ─── Seed quotes ─────────────────────────────────────────────────────────────
insert into quotes (text, attribution) values
  ('The quieter you become, the more you can hear.', 'Ram Dass'),
  ('Breath is the bridge between the body and the mind.', 'Thich Nhat Hanh'),
  ('In stillness, everything that needs to come will come.', null),
  ('You cannot always control what happens, only how you breathe through it.', null),
  ('Rest is not the absence of effort. It is the presence of ease.', null),
  ('Almost everything will work again if you unplug it for a few minutes, including you.', 'Anne Lamott'),
  ('Within you, there is a stillness and a sanctuary to which you can retreat at any time.', 'Hermann Hesse'),
  ('Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor.', 'Thich Nhat Hanh'),
  ('The present moment is the only moment available to us, and it is the door to all moments.', 'Thich Nhat Hanh'),
  ('Peace is not something you wish for. It is something you make, something you do.', 'Robert Fulghum'),
  ('Nowhere to go. Nothing to do. No one to be.', null),
  ('You are the sky. Everything else is just the weather.', 'Pema Chödrön'),
  ('Nothing is so strong as gentleness, nothing so gentle as real strength.', 'Saint Francis de Sales'),
  ('The secret of health for both mind and body is not to mourn for the past, nor to worry about the future, but to live the present moment wisely and earnestly.', 'Buddha'),
  ('Your calm mind is the ultimate weapon against your challenges.', 'Bryant McGill'),
  ('Breathing in, I calm body and mind. Breathing out, I smile.', 'Thich Nhat Hanh'),
  ('If you want to conquer the anxiety of life, live in the moment.', 'Amit Ray'),
  ('The wound is the place where the light enters you.', 'Rumi'),
  ('This too shall pass.', null),
  ('Do not let the behavior of others destroy your inner peace.', 'Dalai Lama'),
  ('You yourself, as much as anybody in the entire universe, deserve your love and affection.', 'Buddha'),
  ('The thing about storms is, they end.', null),
  ('Be gentle with yourself. You are a child of the universe.', 'Max Ehrmann'),
  ('Every breath is a fresh beginning.', null),
  ('What you seek is seeking you.', 'Rumi'),
  ('Slow down and the thing you are chasing will come around and catch you.', 'Zen proverb'),
  ('Between stimulus and response there is a space. In that space is our power.', 'Viktor Frankl'),
  ('The present moment always will have been.', null),
  ('You are allowed to be both a masterpiece and a work in progress.', 'Sophia Bush'),
  ('In the middle of every difficulty lies opportunity.', 'Albert Einstein');
