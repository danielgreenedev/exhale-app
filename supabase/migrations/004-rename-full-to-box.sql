-- Run this once against your existing project at:
-- https://supabase.com/dashboard/project/hlipziitsogzzadkikfp/sql
--
-- Full was replaced by Box on 2026-06-04 after beta feedback showed the
-- Relax phase remained cognitively confusing. Box uses a clearer 4-4-4-4
-- pattern with a post-exhale hold. This preserves the saved preference for
-- beta testers whose row already holds the old 'full' value.

update user_settings set rhythm = 'box' where rhythm in ('full', 'slow');
