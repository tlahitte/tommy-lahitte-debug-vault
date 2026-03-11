// PHASE 2: DONE
// PHASE 7: DONE
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
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
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Tommy Lahitte',
  jobTitle: 'Senior QA Engineer',
  worksFor: {
    '@type': 'Organization',
    name: 'Epic Games',
  },
  knowsAbout: ['Unreal Engine', 'Game QA', 'Debugging', 'Functional Testing', 'Automation'],
  url: 'https://tommylahitte.com',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body className="bg-zinc-950 text-zinc-100 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 pt-14">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
