import type { Metadata, Viewport } from 'next';
import { Inter, Outfit, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: 'TripMind AI — Your Intelligent Travel Copilot',
    template: '%s | TripMind AI',
  },
  description:
    'AI-powered travel planning with real-time recommendations, personalized itineraries, budget optimization, and conversational trip assistance. Built for the Google PromptWars Challenge.',
  keywords: ['AI travel planner', 'trip planning', 'Gemini AI', 'Google Maps', 'itinerary'],
  authors: [{ name: 'TripMind AI' }],
  openGraph: {
    type: 'website',
    title: 'TripMind AI — Intelligent Travel Copilot',
    description: 'Plan smarter trips with AI-powered recommendations and real-time insights.',
    siteName: 'TripMind AI',
  },
  twitter: { card: 'summary_large_image', title: 'TripMind AI' },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#00ff87',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body
        className={`${inter.variable} ${outfit.variable} ${jetbrains.variable} font-sans bg-dark-950 text-white antialiased`}
      >
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0a1628',
              color: '#fff',
              border: '1px solid rgba(0,255,135,0.2)',
              borderRadius: '12px',
            },
            success: { iconTheme: { primary: '#00ff87', secondary: '#020408' } },
            error: { iconTheme: { primary: '#ff006e', secondary: '#020408' } },
          }}
        />
      </body>
    </html>
  );
}
