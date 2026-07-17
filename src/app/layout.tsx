import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PageTransition from '@/components/layout/PageTransition'
import PaletteToggle from '@/components/ui/PaletteToggle'

const denim = localFont({
  src: './fonts/DenimVF.ttf',
  variable: '--font-denim',
  display: 'swap',
})


export const metadata: Metadata = {
  metadataBase: new URL('https://tommylahitte.com'),
  title: {
    default: 'Tommy Lahitte | Technical Artist & Projection Supervisor',
    template: '%s | Tommy Lahitte',
  },
  description:
    'Tommy Lahitte, technical artist and projection supervisor for international live shows (Cirque du Soleil, Roger Waters, La Perle), now in Virtual Production at Epic Games.',
  openGraph: {
    siteName: 'Tommy Lahitte',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Tommy Lahitte, Technical Artist & Projection Supervisor' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
  },
}

const siteSchemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Tommy Lahitte',
    jobTitle: 'Technical Artist & Projection Supervisor',
    worksFor: { '@type': 'Organization', name: 'Epic Games' },
    knowsAbout: [
      'Unreal Engine',
      'Game QA',
      'Debugging',
      'Functional Testing',
      'Automation',
      'Electronics',
      'Film Photography',
      'Media Servers',
      'Live Show Technology',
      'Virtual Production',
    ],
    url: 'https://tommylahitte.com',
    image: 'https://tommylahitte.com/avatar/tommy-lahitte-480.webp',
    sameAs: [
      'https://github.com/tlahitte',
      'https://uk.linkedin.com/in/tlahitte',
      'https://www.instagram.com/1day.snap/',
      'https://www.artstation.com/tlahitte',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Tommy Lahitte',
    url: 'https://tommylahitte.com',
    description:
      'Tommy Lahitte, technical artist and projection supervisor for international live shows, now in Virtual Production at Epic Games.',
    author: { '@type': 'Person', name: 'Tommy Lahitte' },
  },
]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={denim.variable}>
      <head>
        <link rel="alternate" type="application/rss+xml" title="Tommy Lahitte" href="/feed.xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchemas) }}
        />
      </head>
      <body className="text-text-primary bg-surface">
        <div className="flex flex-col min-h-screen">
          <Header />
          <PageTransition>
            <main className="flex-1 mx-auto w-full max-w-4xl px-4 sm:px-8">
              {children}
            </main>
          </PageTransition>
          <Footer />
        </div>
        <PaletteToggle />
      </body>
    </html>
  )
}
