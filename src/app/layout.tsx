import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import LenisProvider from '@/components/providers/LenisProvider'
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
    default: 'Tommy Lahitte | Maker & Tinkerer',
    template: '%s | Tommy Lahitte',
  },
  description:
    'Tommy Lahitte -maker who bridges art and technology. Projects, field notes, and things worth building.',
  openGraph: {
    siteName: 'Tommy Lahitte',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Tommy Lahitte -Maker & Tinkerer' }],
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
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
}

const siteSchemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Tommy Lahitte',
    jobTitle: 'Senior QA Engineer',
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
    sameAs: ['https://github.com/tlahitte'],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Tommy Lahitte',
    url: 'https://tommylahitte.com',
    description:
      'Tommy Lahitte -maker who bridges art and technology. Projects, field notes, and things worth building.',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchemas) }}
        />
      </head>
      <body className="text-text-primary bg-surface">
        <LenisProvider>
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
        </LenisProvider>
      </body>
    </html>
  )
}
