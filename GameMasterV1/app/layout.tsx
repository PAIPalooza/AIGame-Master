import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Game Master | Build Living Game Worlds',
  description: 'Create AI-powered game worlds with dynamic quests, NPC memory, and emergent storytelling using AI Game Master. AI-native narrative infrastructure for next-generation games.',
  keywords: ['AI Game Master', 'AI dungeon master', 'AI narrative engine', 'dynamic quest generator', 'emergent narrative game engine', 'AI storytelling for games', 'game development AI', 'NPC memory system', 'procedural quest generation'],
  authors: [{ name: 'AINative Studio' }],
  openGraph: {
    type: 'website',
    title: 'AI Game Master | Build Living Game Worlds',
    description: 'Create AI-powered game worlds with dynamic quests, NPC memory, and emergent storytelling using AI Game Master.',
    siteName: 'AI Game Master',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
        width: 1200,
        height: 630,
        alt: 'AI Game Master - AI-Native Narrative Game Engine',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Game Master | Build Living Game Worlds',
    description: 'Create AI-powered game worlds with dynamic quests, NPC memory, and emergent storytelling.',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
        alt: 'AI Game Master - AI-Native Narrative Game Engine',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
