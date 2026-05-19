# Social Preview Troubleshooting

Last updated: May 18, 2026

This note documents the Facebook/Open Graph preview troubleshooting done for `https://exhale.guide`.

## Goal

Show a rich Facebook/social preview for Exhale with:

- Title: `Exhale, Guided Breathing`
- Description: `Guided breathing for a calmer mind.`
- Image: `https://exhale.guide/og-image.png`

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
<meta property="og:title" content="Exhale, Guided Breathing"/>
<meta property="og:description" content="Guided breathing for a calmer mind."/>
<meta property="og:image" content="https://exhale.guide/og-image.png"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:image" content="https://exhale.guide/og-image.png"/>
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

The image is a 1200x630 PNG using Exhale's Still Water design language.

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

User-agent: *
Allow: /
```

## Verified Good From Outside Meta

Local and live checks confirmed:

- `https://exhale.guide/` returns `200`.
- `https://exhale.guide/robots.txt` returns `200`.
- `https://exhale.guide/og-image.png` returns `200`.
- `https://exhale.guide/og-image.png` returns `Content-Type: image/png`.
- The homepage HTML includes the expected `og:image` tag.
- Requests using a spoofed `facebookexternalhit` user-agent returned `200` from outside Meta.

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
   /og-image.png
   ```

6. Confirm whether `Denied` increments.
7. If denied requests appear from `Facebook, Inc.`, add the exact IP as a system bypass `/32` or add its `/24` range if repeated.
8. If no denials appear but Facebook still reports old 403/no-data, test a cache-busted URL:

   ```text
   https://exhale.guide/?fbdebug=1
   ```

9. Test the image directly in Facebook Debugger:

   ```text
   https://exhale.guide/og-image.png
   ```

10. If Vercel sees no live request after "Scrape Again," assume Meta-side cache/stuck debugger state and wait before further changes.

## Useful Manual Checks

PowerShell:

```powershell
Invoke-WebRequest -Uri 'https://exhale.guide/' -UseBasicParsing
Invoke-WebRequest -Uri 'https://exhale.guide/robots.txt' -UseBasicParsing
Invoke-WebRequest -Uri 'https://exhale.guide/og-image.png' -UseBasicParsing
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

## References

- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- Vercel Firewall docs: https://vercel.com/docs/vercel-firewall
- Vercel System Bypass Rules: https://vercel.com/docs/vercel-firewall/vercel-waf/system-bypass-rules
