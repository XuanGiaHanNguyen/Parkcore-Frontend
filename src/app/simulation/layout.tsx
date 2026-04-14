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
    default: 'Parking Allocation Simulator',
    template: '%s | Parking Allocation Simulator'
  },
  description: 'Simulate and optimize parking allocation strategies with our interactive tool.',
  keywords: ['parking', 'allocation', 'simulation', 'optimization', 'management'],
  authors: [{ name: 'HanNguyen' }],
  creator: 'HanNguyen',
  publisher: 'HanNguyen',
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
    title: 'Parking Allocation Simulator',
    description: 'Simulate and optimize parking allocation strategies with our interactive tool.',
    url: '/',
    siteName: 'Parking Allocation Simulator',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Parking Allocation Simulator',
    description: 'Simulate and optimize parking allocation strategies with our interactive tool.',
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
    name: 'Parking Allocation Simulator',
    description: 'Simulate and optimize parking allocation strategies with our interactive tool.',
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
