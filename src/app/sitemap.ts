import type { MetadataRoute } from 'next';
import { canonicalUrl } from '@/lib/seo';

const LAST_MODIFIED = {
  home: new Date('2026-06-10'),
  privacy: new Date('2026-06-07'),
  terms: new Date('2026-06-07'),
};

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: canonicalUrl('/'),
      lastModified: LAST_MODIFIED.home,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: canonicalUrl('/privacy'),
      lastModified: LAST_MODIFIED.privacy,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: canonicalUrl('/terms'),
      lastModified: LAST_MODIFIED.terms,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
