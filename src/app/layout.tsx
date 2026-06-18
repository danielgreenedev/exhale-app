import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth';
import {
  HOME_DESCRIPTION,
  HOME_TITLE,
  SITE_NAME,
  SITE_URL,
  SOCIAL_IMAGE,
  canonicalUrl,
  siteJsonLd,
} from '@/lib/seo';

const inter = Inter({ subsets: ['latin'], weight: ['100', '200', '300', '600'] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  alternates: {
    canonical: canonicalUrl('/'),
  },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: canonicalUrl('/'),
    siteName: SITE_NAME,
    images: [
      {
        url: SOCIAL_IMAGE,
        secureUrl: SOCIAL_IMAGE,
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: 'Exhale, a quiet guided breathing tool for calmer moments',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [
      {
        url: SOCIAL_IMAGE,
        secureUrl: SOCIAL_IMAGE,
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: 'Exhale, a quiet guided breathing tool for calmer moments',
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-forest-night text-still-white`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
