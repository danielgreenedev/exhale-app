import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], weight: ['100', '200', '300', '400'] });

export const metadata: Metadata = {
  title: 'Exhale — Guided Breathing',
  description: 'A calming rhythm and breathing game for all ages. Reduce anxiety through guided breath cycles.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-[#05060f] text-white`}>
        {children}
      </body>
    </html>
  );
}
