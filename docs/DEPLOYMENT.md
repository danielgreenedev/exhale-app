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
4. Test the Vercel preview URL on desktop and mobile if preview access is open.
5. For sync changes, test the full two-device Backup & Sync flow on the preview URL.
6. Merge or cherry-pick the tested commit to `master`.
7. Push `master` to deploy `https://exhale.guide`.
8. Confirm the GitHub/Vercel deployment status is successful.

## Pre-Production Checklist

- `npm.cmd test -- --runInBand`
- `npm.cmd run lint`
- `npm.cmd run build`
- Home page starts a session.
- Game page shows Settle In, the orb canvas, phase transitions, and sound behavior.
- Practice History shows stats and optional Backup & Sync.
- Email sync verifies with a 6-digit email code.
- Google sync opens the provider flow and returns to Practice History.
- A second device sees synced practice history, timer length, Circle Size, sound choice, and rhythm.

## Vercel Settings

In Vercel Project Settings, keep the Production environment branch tracking set to `master`. Non-production branches, including `preview`, should remain preview deployments.

The preview branch may be protected by Vercel authentication. For external beta testing, either use production at `https://exhale.guide` or explicitly share an accessible preview/bypass link.

The production custom domain is:

`https://exhale.guide`

## Supabase Notes

Supabase stores:

- `breathing_sessions`: practice history.
- `user_settings`: timer length, Circle Size, sound choice, and rhythm.
- `app_events`: timer selections, session starts, early exits, and completions for synced users.

## Google OAuth Setup

Google OAuth is an optional Backup & Sync provider inside Practice History. Exhale should still work anonymously without it.

In Supabase:

- Enable the Google provider in Auth Providers.
- Add the Google client ID and client secret from Google Cloud.
- Enable manual identity linking so `linkIdentity()` can convert an anonymous Exhale user into a Google-backed synced user without losing existing rows.
- Add redirect URLs for each environment that will test OAuth:
  - `https://exhale.guide/stats`
  - `http://localhost:3000/stats`
  - Vercel preview URLs or the approved preview wildcard pattern, if OAuth is tested on preview.

In Google Cloud:

- Create or use a Web OAuth client.
- Add authorized JavaScript origins:
  - `https://exhale.guide`
  - `http://localhost:3000` for local testing.
- Add the Supabase callback URL from the Supabase Google provider screen as an authorized redirect URI. It is usually `https://<project-ref>.supabase.co/auth/v1/callback`.
- Add the production privacy and terms URLs to the consent screen:
  - `https://exhale.guide/privacy`
  - `https://exhale.guide/terms`

For local OAuth testing, the app's local-only auth guard must be disabled in the browser:

```js
localStorage.setItem('exhale-enable-local-supabase', '1')
```

Then reload `http://localhost:3000`.

The Supabase email templates for sync should visibly include the 6-digit OTP token:

- Magic Link: include `{{ .Token }}` instead of a sign-in link.
- Change Email Address: include `{{ .Token }}` instead of a confirmation link.

## Do Not Commit

- `.env.local`
- local tool permissions, including `.claude/settings.local.json`
