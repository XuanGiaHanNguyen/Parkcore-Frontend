import type { Metadata } from 'next'
import { Space_Grotesk, Space_Mono } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'

import '../globals.css'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['400', '500', '600', '700'],
})

const spaceMono = Space_Mono({ 
  subsets: ['latin'],
  variable: '--font-space-mono',
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'Color Palette Generator - Create Beautiful Color Schemes',
    template: '%s | Color Palette Generator'
  },
  description: 'Generate beautiful, accessible color palettes with color theory. Create complementary, analogous, triadic, and more color harmonies. Save and organize your favorite palettes.',
  keywords: ['color palette', 'color scheme', 'color generator', 'color harmony', 'complementary colors', 'analogous colors', 'triadic colors', 'color theory', 'design tools', 'color picker'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  publisher: 'Your Name',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Color Palette Generator - Create Beautiful Color Schemes',
    description: 'Generate beautiful, accessible color palettes with color theory. Create complementary, analogous, triadic, and more color harmonies.',
    url: '/',
    siteName: 'Color Palette Generator',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Color Palette Generator - Create Beautiful Color Schemes',
    description: 'Generate beautiful, accessible color palettes with color theory. Create complementary, analogous, triadic, and more color harmonies.',
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
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Color Palette Generator',
    description: 'Generate beautiful, accessible color palettes with color theory',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Generate color palettes using color theory',
      'Multiple harmony types (complementary, analogous, triadic, etc.)',
      'Save and organize favorite palettes',
      'Keyboard shortcuts for quick generation',
      'Accessible and responsive design',
    ],
  }

  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${spaceMono.variable} ${spaceGrotesk.className}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
     <body className="antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:border-3 focus:border-black focus:bg-accent focus:text-accent-foreground focus:px-4 focus:py-3 focus:font-bold focus:shadow-brutal"
        >
          Skip to main content
        </a>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} forcedTheme="light">
          <NuqsAdapter>
            <div id="main-content" tabIndex={-1}>{children}</div>
          </NuqsAdapter>
          <div aria-live="polite" aria-atomic="true">
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
