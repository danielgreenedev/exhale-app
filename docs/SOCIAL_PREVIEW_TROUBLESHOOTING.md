# Social Preview Troubleshooting

Last updated: June 18, 2026 (Pixel Messages/Messenger cache-bust)

This note documents social/Open Graph preview troubleshooting done for `https://exhale.guide`.

## Current Status

Resolved 2026-05-19 for Facebook feed posts. The Facebook preview now renders correctly for `exhale.guide` on shared posts. The Sharing Debugger 403 / parser issue cleared on its own once Meta's cache aged out; no further app-side or infrastructure change was needed beyond the work captured below. The earlier working conclusion (Meta-side parser/cache state, not an Exhale-side issue) held up.

Resolved 2026-05-20 for Discord and Telegram. Both platforms showed no link preview even though the OG metadata and image were valid. Vercel Firewall live view showed crawler traffic from `Discordbot` and `TelegramBot (like TwitterBot)` being challenged. After adding Telegram to `robots.txt` and allowing the Discord/Telegram crawler user agents through Vercel Firewall, previews worked on both platforms.

Observed 2026-06-15 for Facebook Messenger messages. The rich preview renders in a Facebook feed post and still renders in Discord and Telegram, but a Facebook Messenger message does not show the preview. Live checks from a local shell confirmed that known social crawler user agents (`facebookexternalhit`, `Facebot`, `meta-externalagent`, and `Discordbot`) receive `200 OK` for both `/` and `/og-image-v2.png`; generic `curl` still receives Vercel's `429` security challenge for both resources. Treat this as a Messenger-specific fetch path, cache state, or client rendering decision unless Vercel Firewall live traffic shows a denied/challenged Messenger request.

Observed 2026-06-08 for Google Messages on a Pixel 9 Pro XL running the latest full public Pixel Android release. The preview renders as a compact title/domain card with no image. Google's crawler documentation lists `GoogleMessages` as the user agent for Google Messages link previews. Spoofed `GoogleMessages` requests to both `/` and `/og-image.png` returned `429 Too Many Requests` with `X-Vercel-Mitigated: challenge`, so the likely cause is Vercel challenging the fetcher before it can parse the OG metadata or retrieve the image.

Updated 2026-06-09: after adding the Vercel bypass rule, spoofed `GoogleMessages` requests returned `200 OK` for both `/` and `/og-image.png`, and Google Messages showed preview text but still no image. Because the OG image URL was the same URL that previously returned a Vercel challenge, `src/app/layout.tsx` now points previews at `/og-image-v2.png` to force a fresh image fetch instead of reusing a failed image cache entry.

Updated 2026-06-18: Pixel 9 Google Messages and Facebook Messenger still showed no rich preview for the project owner. Live checks from this shell confirmed `GoogleMessages`, `facebookexternalhit`, and `meta-externalfetcher` receive `200 OK` for `/`, and `GoogleMessages`/`facebookexternalhit` receive `200 OK` for `/og-image-v2.png`. Generic `curl`, `MessengerForiOS`, `Orca-Android`, and a Facebook in-app-browser-shaped Android user agent still receive Vercel's `429` challenge. The app now points previews at `/og-image-v3.png`, adds `og:image:secure_url`/`twitter:image:secure_url`, and extends `robots.txt` with Messenger/Orca-style entries. The remaining required infrastructure check is a Vercel Firewall bypass for the exact Messenger/Orca traffic observed in Live mode.

Keep this document as a reference playbook in case a future domain change, OG image swap, or Garden-skin update triggers similar cache symptoms. The Vercel firewall bypass rules and `robots.txt` allowances should not be reverted; they cost nothing to keep and prevent regressions if social platforms change crawler IPs again.

## Goal

Show a rich Facebook/social preview for Exhale with:

- Title: `Exhale, a Quiet Guided Breathing Tool for Calmer Moments`
- Description: `A quiet, free breathing tool with gentle pacing, optional rhythms, and soft sound for stressful moments. No account required.`
- Image: `https://exhale.guide/og-image-v3.png`

## App-Side Changes Made

### Open Graph metadata

`src/app/layout.tsx` defines:

- `metadataBase: new URL('https://exhale.guide')`
- `openGraph.title`
- `openGraph.description`
- `openGraph.url`
- `openGraph.siteName`
- `openGraph.images`
- `twitter.card`
- `twitter.images`

The expected rendered tags are:

```html
<meta property="og:title" content="Exhale, a Quiet Guided Breathing Tool for Calmer Moments"/>
<meta property="og:description" content="A quiet, free breathing tool with gentle pacing, optional rhythms, and soft sound for stressful moments. No account required."/>
<meta property="og:image" content="https://exhale.guide/og-image-v3.png"/>
<meta property="og:image:secure_url" content="https://exhale.guide/og-image-v3.png"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:image" content="https://exhale.guide/og-image-v3.png"/>
<meta name="twitter:image:secure_url" content="https://exhale.guide/og-image-v3.png"/>
```

### Static preview image

The social image is stored at:

```text
public/og-image.png
```

Live URL:

```text
https://exhale.guide/og-image.png
```

The image is a 1200x630 PNG using Exhale's Still Water design language. It includes a subtle ghost-style `Begin` cue instead of a feature list or hard-selling call to action.

After the 2026-06-09 Google Messages cache-bust, Open Graph and Twitter metadata point at:

```text
https://exhale.guide/og-image-v2.png
```

After the 2026-06-18 Pixel Messages/Messenger cache-bust, Open Graph and Twitter metadata point at:

```text
https://exhale.guide/og-image-v3.png
```

The original `/og-image.png` remains in `public/` as a stable legacy asset.

The original `src/app/opengraph-image.tsx` route was removed because Next's file-based metadata route auto-injected `/opengraph-image?...` as `og:image`, overriding the manually configured static image URL.

### Robots allowlist

`public/robots.txt` explicitly allows common social crawlers:

```txt
User-agent: facebookexternalhit
Allow: /

User-agent: Facebot
Allow: /

User-agent: meta-externalagent
Allow: /

User-agent: meta-externalfetcher
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

User-agent: Slackbot
Allow: /

User-agent: Discordbot
Allow: /

User-agent: TelegramBot
Allow: /

User-agent: GoogleMessages
Allow: /

User-agent: GoogleOther-Image
Allow: /

User-agent: Messenger
Allow: /

User-agent: MessengerForiOS
Allow: /

User-agent: Orca
Allow: /

User-agent: FB_IAB
Allow: /

User-agent: *
Allow: /
```

### Google Messages Image Missing

Observed 2026-06-08:

- Google Messages generated a preview with title and domain, but no image.
- Google documents `GoogleMessages` as the user agent used to generate link previews for URLs sent in chat messages.
- Crawler-shaped requests returned `429 Too Many Requests` for `/` and `/og-image.png`.
- Response headers included `X-Vercel-Mitigated: challenge`.

Conclusion:

```text
When Google Messages shows only a title/domain card, valid OG metadata is not enough. If Vercel challenges GoogleMessages, the fetcher may fail to retrieve the static preview image and fall back to a minimal card.
```

Fix to apply in Vercel Firewall:

```text
IF User Agent contains GoogleMessages
THEN Bypass
```

Place this rule with the existing social-preview crawler bypasses. After publishing, send a cache-busted URL in a new message, for example:

```text
https://exhale.guide/?gm_preview=YYYYMMDD
```

If the custom bypass rule matches but Vercel system DDoS mitigation still challenges the request, inspect live Firewall traffic for the actual Google Messages request and add a System Bypass Rule for the exact observed IP or CIDR scoped to `exhale.guide`. Verify the request is actually from Google first; Google user agents can be spoofed, and Google publishes user-triggered fetcher IP ranges plus reverse-DNS guidance.

If `GoogleMessages` receives `200 OK` for both the page and the image but Messages still omits the image, rotate the OG image URL again, for example from `/og-image-v3.png` to `/og-image-v4.png`, then deploy and test with a brand-new page URL query. This avoids a stale failed-image cache tied to the image URL itself.

## Facebook Messenger Message No-Preview

Observed 2026-06-15:

- Facebook feed posts render the rich preview.
- Discord and Telegram render the rich preview.
- Facebook Messenger messages do not render the rich preview.
- Known Meta crawler user agents receive `200 OK` for both the page and the current OG image.
- Generic, non-crawler requests from this shell receive Vercel's `429` security challenge for both the page and image.

Conclusion:

```text
The app metadata and current OG image are valid. Messenger is the only failing surface, so do not reopen the whole Open Graph stack. Investigate Messenger-specific fetch/cache behavior first.
```

Troubleshooting path:

1. Send a cache-busted URL in a new Messenger thread:

   ```text
   https://exhale.guide/?messenger_preview=YYYYMMDD
   ```

2. Keep Vercel Firewall open with the time filter set to `Live` while sending the message.
3. Filter for requests to `/`, `/robots.txt`, and `/og-image-v3.png`.
4. Look for user agents containing `facebookexternalhit`, `Facebot`, `meta-externalagent`, `meta-externalfetcher`, `Messenger`, `Orca`, or other Meta/Messenger markers.
5. If a Messenger-related request is challenged or denied, confirm the request is from Meta infrastructure, then add either a custom user-agent bypass or a system bypass for the exact verified IP/CIDR scoped to `exhale.guide`.
6. If no Messenger-related request appears, assume Messenger is using cached state or a client-side no-preview decision. Re-test with a different device/account/thread and a cache-busted URL before changing the app.
7. If Messenger receives `200 OK` for both the page and image but still omits the preview, treat it as Messenger cache/product behavior. Only rotate from `/og-image-v3.png` to `/og-image-v4.png` if Messenger sharing becomes important enough to justify another deploy/cache-bust cycle.

## Discord and Telegram No-Preview Resolution

Observed 2026-05-20:

- Discord and Telegram did not render a preview.
- Vercel Firewall live view showed `Challenged` traffic, not `Denied` traffic.
- Top user agents included `Mozilla/5.0 (compatible; Discordbot/2.0; +http...)` and `TelegramBot (like TwitterBot)`.
- Top request paths included `/` and `/og-image.png`.
- Crawler-shaped PowerShell requests returned `429 Too Many Requests` for `/` and `/og-image.png`, which confirmed the crawlers were being challenged before they could parse metadata or fetch the preview image.

Conclusion:

```text
When Discord or Telegram shows no preview, valid OG metadata is not enough. If Vercel challenges the crawler, the platform cannot solve the challenge and will fail to generate a preview.
```

Fix applied:

1. Added `TelegramBot` to `public/robots.txt`. `Discordbot` was already present.
2. Added Vercel Firewall bypass rules for crawler user agents:

   ```text
   IF User Agent contains Discordbot
   THEN Bypass
   ```

   and:

   ```text
   IF User Agent contains TelegramBot
   THEN Bypass
   ```

3. Retested Discord and Telegram; previews rendered on both.

If this recurs:

1. Open Vercel Firewall with the time filter set to `Live`.
2. Post cache-busted test URLs:

   ```text
   https://exhale.guide/?discord_preview=YYYYMMDD
   https://exhale.guide/?tg_preview=YYYYMMDD
   ```

3. Search/filter live traffic for `Discordbot` and `TelegramBot`.
4. If the crawler requests are challenged, confirm the custom user-agent bypass rules are still active and published.
5. If user-agent bypass rules match but system DDoS mitigation still challenges the request, add system bypass rules for the exact observed crawler IPs as `/32` entries scoped to `exhale.guide`.
6. For Telegram, send the URL to `@WebpageBot` and refresh/update the preview after the firewall rule is active.

## Verified Good From Outside Meta

Local and live checks confirmed:

- `https://exhale.guide/` returns `200`.
- `https://exhale.guide/robots.txt` returns `200`.
- `https://exhale.guide/og-image-v2.png` returns `200` and `Content-Type: image/png`.
- Legacy `https://exhale.guide/og-image.png` still returns `200` and `Content-Type: image/png`.
- The homepage HTML includes the expected `og:image` tag.
- Requests using a spoofed `facebookexternalhit` user-agent returned `200` from outside Meta.

After deploying the 2026-06-18 cache-bust, verify:

- `https://exhale.guide/og-image-v3.png` returns `200`.
- `https://exhale.guide/og-image-v3.png` returns `Content-Type: image/png`.
- The homepage HTML includes `og:image` and `twitter:image` tags pointing at `https://exhale.guide/og-image-v3.png`.

## Facebook Debugger Failure

Facebook Sharing Debugger repeatedly reported:

```text
Bad Response Code
Response Code: 403
Response Code Reason: This response code could be due to a robots.txt block.
```

At times, "See exactly what our scraper sees" returned:

```text
The document returned no data.
```

This warning appears to be generic. In this case, `robots.txt` was present and explicitly allowed Facebook crawlers.

## Earlier Recommended Resolution

Earlier in troubleshooting, before the final Meta-side conclusion, the cleanest infrastructure fix appeared to be **Vercel's Verified Bots allowlist**, not a per-IP bypass list. Verified Bots uses reverse-DNS verification on each crawler request, so it keeps working as Facebook adds new IP ranges and avoids the whack-a-mole pattern that ended this round of troubleshooting.

This is no longer the active next step unless Vercel begins showing new Facebook/Meta denials again.

Steps:

1. Vercel project, Settings, Firewall, Bot Protection.
2. Look for "Verified Bots" and set Facebook/Meta crawlers to Allow, or set global mode to "Block all bots except verified".
3. Remove the existing `104.210.140.0/24` system bypass; that range is Microsoft Azure, not Meta. The IPs observed during earlier troubleshooting were either spoofed user agents from Azure-hosted scanners or unrelated traffic.

Use the per-prefix bypass list below only if Verified Bots is unavailable on your plan tier.

## Vercel Findings

In Vercel Firewall live/overview screens:

- Bot Protection was inactive.
- The custom rule `Allow Facebook crawler access` matched some Facebook traffic.
- DDoS Mitigation denied other Facebook crawler requests before the custom rule could apply.
- Denied/requesting AS name included `Facebook, Inc.`
- User agent included `facebookexternalhit/1.1`.
- Request paths included `/robots.txt`, `/`, and eventually app/static asset paths.

Important conclusion:

```text
The custom user-agent bypass can match crawler requests, but it does not necessarily bypass Vercel's system DDoS mitigation. System bypass rules are needed for IPs/ranges caught by DDoS mitigation.
```

## Vercel Rules Tried

### Custom firewall rule

Name:

```text
Allow Facebook crawler access
```

Logic:

```text
IF User Agent contains facebookexternalhit
OR User Agent contains Facebot
OR User Agent contains meta-externalagent
OR User Agent contains meta-externalfetcher
THEN Bypass
```

This rule matched some Meta crawler traffic, but did not stop all DDoS mitigation denials.

### System bypass rules

System bypass rules were added under Vercel's DDoS Mitigations and System Bypasses screen.

Host:

```text
exhale.guide
```

Known ranges/IPs observed during troubleshooting included:

```text
104.210.140.0/24
173.252.82.0/24
173.252.87.0/24
57.141.18.0/24
69.63.184.0/24
```

Some exact IPs observed at different points:

```text
104.210.140.128
104.210.140.132
104.210.140.133
104.210.140.135
104.210.140.138
173.252.87.12
173.252.87.37
173.252.82.112
57.141.18.54
57.141.18.65
69.63.184.13
```

Notes used:

```text
Meta/Facebook crawler link preview DDoS bypass
```

or:

```text
Allow Meta/Facebook Sharing Debugger crawler traffic blocked by DDoS mitigation.
```

## Current Pause Point

After adding system bypasses, Vercel showed:

- No fresh denials during some Facebook debugger scrapes.
- Hits on the custom Facebook crawler bypass rule.
- Live traffic from `facebookexternalhit/1.1`.
- Live request paths including `/robots.txt` and `/`.

However, Facebook Debugger still reported the same 403/no-data result at the time of troubleshooting.

Working theory:

```text
The app and Vercel configuration may now be correct enough for new requests, but Facebook may be holding a failed scrape/cache state for the root URL or image URL.
```

Decision:

```text
Pause and let Facebook's scrape cache settle before making more changes.
```

## If Resuming Later

1. Open Vercel Firewall with the time filter set to `Live`.
2. Open Facebook Sharing Debugger.
3. Scrape:

   ```text
   https://exhale.guide/
   ```

4. Watch Vercel live traffic.
5. Confirm whether these paths appear:

   ```text
   /robots.txt
   /
   /og-image-v3.png
   ```

6. Confirm whether `Denied` increments.
7. If denied requests appear from `Facebook, Inc.`, add the exact IP as a system bypass `/32` or add its `/24` range if repeated.
8. If no denials appear but Facebook still reports old 403/no-data, test a cache-busted URL:

   ```text
   https://exhale.guide/?fbdebug=1
   ```

9. Test the image directly in Facebook Debugger:

   ```text
   https://exhale.guide/og-image-v3.png
   ```

10. If Vercel sees no live request after "Scrape Again," assume Meta-side cache/stuck debugger state and wait before further changes.

## Useful Manual Checks

PowerShell:

```powershell
Invoke-WebRequest -Uri 'https://exhale.guide/' -UseBasicParsing
Invoke-WebRequest -Uri 'https://exhale.guide/robots.txt' -UseBasicParsing
Invoke-WebRequest -Uri 'https://exhale.guide/og-image-v3.png' -UseBasicParsing
```

Facebook user-agent:

```powershell
Invoke-WebRequest `
  -Uri 'https://exhale.guide/' `
  -UserAgent 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)' `
  -UseBasicParsing
```

Expected image response:

```text
Status: 200
Content-Type: image/png
```

## Canonical Meta Crawler Prefixes (AS32934)

Source: BGP routes announced by AS32934 (Meta Platforms) via Hurricane Electric's BGP toolkit. Last refreshed May 18, 2026.

These 44 aggregate IPv4 prefixes cover Meta's full announced footprint, including Facebook, Instagram, WhatsApp, Messenger, and Workplace infrastructure. They replace the smaller ad-hoc list captured in "Vercel Rules Tried" above.

```text
31.13.24.0/21
31.13.64.0/18
45.64.40.0/22
57.141.0.0/24
57.141.1.0/24
57.141.2.0/24
57.141.3.0/24
57.141.4.0/24
57.141.5.0/24
57.141.6.0/24
57.141.7.0/24
57.141.8.0/24
57.141.9.0/24
57.141.10.0/24
57.141.11.0/24
57.141.12.0/24
57.141.13.0/24
57.141.14.0/24
57.141.15.0/24
57.141.16.0/24
57.141.17.0/24
57.141.18.0/24
57.141.19.0/24
57.141.20.0/24
57.141.21.0/24
57.144.0.0/14
66.220.144.0/20
69.63.176.0/20
69.171.224.0/19
74.119.76.0/22
102.132.96.0/20
103.4.96.0/22
129.134.0.0/17
157.240.0.0/17
157.240.192.0/18
163.70.128.0/17
163.77.132.0/23
163.77.136.0/23
173.252.64.0/19
173.252.96.0/19
179.60.192.0/22
185.60.216.0/22
185.89.216.0/22
204.15.20.0/22
```

Not on the list (and therefore safe to remove from any existing bypass): `104.210.140.0/24` is Microsoft Azure, not Meta.

To refresh this list later, scrape the prefix table at `https://bgp.he.net/AS32934#_prefixes` and deduplicate the parent aggregates.

## 2026-05-19 Final Status

After exhausting fixable causes, the conclusion is that Meta's scraper has a parsing or cache problem specific to `exhale.guide` that is not fixable from our side.

What was tested:

- Force-scrape via Graph API (`POST ?id=https://exhale.guide/&scrape=true`), repeated several times.
- Read-back via Graph API (`GET ?id=...&fields=og_object`), repeated against `/` and `/privacy`.
- Both scrape and read with Bot Protection ON and with Bot Protection OFF, confirmed by user.
- Trailing-slash mismatch theory ruled out: Next.js metadata API canonicalizes `openGraph.url` and strips the root slash regardless of what we configure.

What Meta consistently returns for the canonical URL:

```json
{
  "og_object": {
    "title": "exhale.guide",
    "type": "website",
    "updated_time": "<fresh timestamp per scrape>"
  }
}
```

`title: "exhale.guide"` is the hostname fallback Facebook uses when its parser cannot extract `og:title`. The same response for `/privacy` (a separately scraped URL with its own fresh `og_object` id) rules out per-URL cache poisoning. There is also no description and no image returned, regardless of how many times we force-scrape.

What we verified from outside Meta:

- 14 well-formed `og:` and `twitter:` meta tags are present in the rendered HTML for `/` and `/privacy`, including correct title, description, and image URL.
- Meta tags sit between byte 1500 and byte 2800, well inside `<head>`, before `</head>` at byte 2855.
- OpenGraph.xyz independently scraped `https://exhale.guide` and rendered the full Exhale title, description, and og-image image correctly. Their only feedback was SEO suggestions, not parsing failures.

Conclusion: this is a Meta-side bug. Their scraper successfully fetches the document but fails to extract `og:*` and `twitter:*` tags that other crawlers parse without trouble.

Path forward:

- Do not invest more engineering on this; Facebook previews are not on the critical path for the beta audience.
- Optionally re-check in 48 to 72 hours; stuck `og_object` cache entries sometimes clear on their own.
- A Facebook bug report can be filed via the Sharing Debugger's "Report a Bug" link if Facebook sharing later becomes important.
- Direct sharing via iMessage, LinkedIn, Twitter, Discord, Telegram, Slack, and email now preview correctly after the platform-specific cache/firewall issues described above.

## References

- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- Vercel Firewall docs: https://vercel.com/docs/vercel-firewall
- Vercel System Bypass Rules: https://vercel.com/docs/vercel-firewall/vercel-waf/system-bypass-rules
- Hurricane Electric BGP toolkit (Meta AS): https://bgp.he.net/AS32934#_prefixes
- OpenGraph.xyz (independent OG validator): https://www.opengraph.xyz/
