# Deployment Workflow

Exhale uses Vercel for hosting, Supabase for data, and GitHub as the deployment source.

## Branches

- `master`: production branch. Pushing or merging here deploys `https://exhale.guide`.
- `preview`: shared pre-production branch. Pushing here creates a Vercel preview deployment for real-device testing before production.
- Feature branches: optional short-lived branches for isolated work. They can also receive Vercel preview deployments.

## Recommended Flow

1. Build and test locally.
2. Commit the change on a working branch.
3. Push to `preview`.
4. Test the Vercel preview URL on desktop and mobile.
5. For sync changes, test the full two-device email-code flow on the preview URL.
6. Merge or cherry-pick the tested commit to `master`.
7. Push `master` to deploy `https://exhale.guide`.

## Pre-Production Checklist

- `npm.cmd test -- --runInBand`
- `npm.cmd run lint`
- `npm.cmd run build`
- Home page starts a session.
- Game page shows Settle In, the orb canvas, phase transitions, and sound behavior.
- Practice History shows stats and optional sync.
- Sync verifies with a 6-digit email code.
- A second device sees synced practice history, timer length, Circle Size, and sound choice.

## Vercel Settings

In Vercel Project Settings, keep the Production environment branch tracking set to `master`. Non-production branches, including `preview`, should remain preview deployments.

The production custom domain is:

`https://exhale.guide`

## Supabase Notes

Supabase stores:

- `breathing_sessions`: practice history.
- `user_settings`: timer length, Circle Size, and sound choice.

The Supabase email templates for sync should visibly include the 6-digit OTP token:

- Magic Link: include `{{ .Token }}` instead of a sign-in link.
- Change Email Address: include `{{ .Token }}` instead of a confirmation link.

## Do Not Commit

- `.env.local`
- local tool permissions, including `.claude/settings.local.json`
