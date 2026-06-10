export const SITE_URL = 'https://exhale.guide';
export const SITE_NAME = 'Exhale';
export const SOCIAL_IMAGE = '/og-image-v2.png';

export const HOME_TITLE = 'Exhale, a Quiet Guided Breathing Tool for Calmer Moments';
export const HOME_DESCRIPTION =
  'A quiet, free breathing tool with gentle pacing, optional rhythms, and soft sound for stressful moments. No account required.';

export function canonicalUrl(path = '/'): string {
  return new URL(path, SITE_URL).toString();
}

export const siteJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: HOME_DESCRIPTION,
    inLanguage: 'en-US',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${SITE_URL}/#webapp`,
    name: SITE_NAME,
    url: SITE_URL,
    description: HOME_DESCRIPTION,
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Web',
    isAccessibleForFree: true,
    inLanguage: 'en-US',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  },
] as const;
