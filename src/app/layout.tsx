import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth';

const inter = Inter({ subsets: ['latin'], weight: ['100', '200', '300', '600'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://exhale.guide'),
  title: 'Exhale, a Quiet Guided Breathing Tool for Calmer Moments',
  description: 'A quiet, free breathing tool with gentle pacing, optional rhythms, and soft sound for stressful moments. No account required.',
  openGraph: {
    title: 'Exhale, a Quiet Guided Breathing Tool for Calmer Moments',
    description: 'A quiet, free breathing tool with gentle pacing, optional rhythms, and soft sound for stressful moments. No account required.',
    url: 'https://exhale.guide/',
    siteName: 'Exhale',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Exhale, a quiet guided breathing tool for calmer moments',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Exhale, a Quiet Guided Breathing Tool for Calmer Moments',
    description: 'A quiet, free breathing tool with gentle pacing, optional rhythms, and soft sound for stressful moments. No account required.',
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
