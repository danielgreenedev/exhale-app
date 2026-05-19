-- Run this once against your existing project at:
-- https://supabase.com/dashboard/project/hlipziitsogzzadkikfp/sql
--
-- The third rhythm was briefly named 'slow' but was renamed to 'full' on
-- 2026-05-19 to read more clearly to the skeptical primary user. This update
-- preserves the choice for any beta tester whose row already holds 'slow';
-- without it, the client's isRhythmId guard would silently fall back to
-- 'standard' on next sync.

update user_settings set rhythm = 'full' where rhythm = 'slow';
