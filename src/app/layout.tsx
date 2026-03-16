// PHASE 2: DONE
// PHASE 7: DONE
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const denim = localFont({
  src: './fonts/DenimVF.ttf',
  variable: '--font-denim',
  display: 'swap',
})


export const metadata: Metadata = {
  metadataBase: new URL('https://tommylahitte.com'),
  title: {
    default: 'Tommy Lahitte | QA Engineer & Unreal Debug Vault',
    template: '%s | Tommy Lahitte Debug Vault',
  },
  description:
    'QA and debugging field notes for Unreal Engine by Tommy Lahitte, QA Engineer at Epic Games.',
  openGraph: {
    siteName: 'Tommy Lahitte Debug Vault',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Tommy Lahitte — QA Engineer & Unreal Debug Vault' }],
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
}

const siteSchemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Tommy Lahitte',
    jobTitle: 'Senior QA Engineer',
    worksFor: { '@type': 'Organization', name: 'Epic Games' },
    knowsAbout: ['Unreal Engine', 'Game QA', 'Debugging', 'Functional Testing', 'Automation'],
    url: 'https://tommylahitte.com',
    image: 'https://tommylahitte.com/avatar/tommy-lahitte-480.webp',
    sameAs: ['https://github.com/tlahitte'],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Tommy Lahitte Debug Vault',
    url: 'https://tommylahitte.com',
    description: 'QA and debugging field notes for Unreal Engine by Tommy Lahitte, QA Engineer at Epic Games.',
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
      <body className="bg-surface text-text-primary flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 pt-14">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
