import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Game Master - Build Living Game Worlds | AINative Studio',
  description: 'Create dynamic game worlds with AI Game Master. Generate living narratives, persistent NPC memory, and emergent storylines. The AI-native game engine for next-generation RPGs and narrative games.',
  keywords: [
    'AI Game Master',
    'AI dungeon master',
    'AI narrative engine',
    'dynamic quest generator',
    'emergent narrative game engine',
    'AI storytelling for games',
    'game development AI',
    'procedural narrative',
    'AI RPG engine',
    'living game worlds'
  ],
  authors: [{ name: 'AINative Studio' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://aigamemaster.com',
    title: 'AI Game Master - Build Living Game Worlds',
    description: 'Create living game worlds where quests evolve, NPCs remember players, and stories emerge naturally. Join the waitlist for early access.',
    siteName: 'AI Game Master',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
        width: 1200,
        height: 630,
        alt: 'AI Game Master - Living Game Worlds'
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Game Master - Build Living Game Worlds',
    description: 'Create living game worlds where quests evolve, NPCs remember players, and stories emerge naturally.',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
