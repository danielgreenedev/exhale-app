-- Run this once against your existing project at:
-- https://supabase.com/dashboard/project/hlipziitsogzzadkikfp/sql
--
-- Adds the rhythm preference to user_settings so the home screen's
-- last-picked rhythm (standard / gentle / slow) syncs alongside
-- orb_scale, sound_palette, and session_length.

alter table user_settings add column if not exists rhythm text;
