-- Run this once against your existing project at:
-- https://supabase.com/dashboard/project/hlipziitsogzzadkikfp/sql
--
-- Adds the session_length preference to user_settings so the home screen's
-- last-picked duration syncs alongside orb_scale and sound_palette.

alter table user_settings add column if not exists session_length text;
