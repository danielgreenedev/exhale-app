import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth';

const inter = Inter({ subsets: ['latin'], weight: ['100', '200', '300', '600'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://exhale.guide'),
  title: 'Exhale, Guided Breathing',
  description: 'Guided breathing for a calmer mind.',
  openGraph: {
    title: 'Exhale, Guided Breathing',
    description: 'Guided breathing for a calmer mind.',
    url: 'https://exhale.guide',
    siteName: 'Exhale',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Exhale, guided breathing for a calmer mind',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Exhale, Guided Breathing',
    description: 'Guided breathing for a calmer mind.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-forest-night text-still-white`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
