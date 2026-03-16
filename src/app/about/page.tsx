import type { Metadata } from 'next'
import Image from 'next/image'
import AboutCard from '@/components/home/AboutCard'
import ExperienceTimeline from '@/components/about/ExperienceTimeline'
import { AuroraBackground } from '@/components/ui/aurora-background'

export const metadata: Metadata = {
  title: 'About | Tommy Lahitte',
  description:
    'Maker and tinkerer who bridges art and technology. A decade of live shows, media-server engineering at VYV, and now Virtual Production with Unreal Engine at Epic Games.',
  alternates: {
    canonical: 'https://tommylahitte.com/about/',
  },
  openGraph: {
    title: 'About | Tommy Lahitte',
    description:
      'Maker and tinkerer who bridges art and technology. A decade of live shows, media-server engineering at VYV, and now Virtual Production with Unreal Engine at Epic Games.',
    url: 'https://tommylahitte.com/about/',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'About Tommy Lahitte' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About | Tommy Lahitte',
    description:
      'Maker and tinkerer who bridges art and technology. A decade of live shows, media-server engineering at VYV, and now Virtual Production with Unreal Engine at Epic Games.',
    images: ['/og-image.png'],
  },
}

export default function AboutPage() {
  return (
    <>
      <AuroraBackground className="border-b border-border overflow-hidden hero-texture">
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 w-full">
          <div className="flex flex-col items-center gap-4 pt-10 sm:pt-16 pb-8">
            {/* Avatar */}
            <div className="relative w-32 sm:w-40">
              <div
                className="absolute -inset-8 rounded-full animate-spin-slow"
                style={{
                  background:
                    'conic-gradient(from 0deg, transparent 0%, transparent 45%, rgba(200,90,58,0.35) 62%, rgba(168,67,42,0.45) 78%, rgba(200,90,58,0.4) 90%, transparent 100%)',
                  filter: 'blur(24px)',
                }}
              />
              {/* Frosted ring */}
              <div
                className="absolute -inset-3 rounded-full"
                style={{
                  background: 'radial-gradient(circle, transparent 72%, rgba(250,250,247,0.4) 80%, rgba(250,250,247,0.7) 88%, rgba(240,235,224,0.85) 100%)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
              />
              <Image
                src="/avatar/tommy-lahitte-480.webp"
                alt="Tommy Lahitte"
                width={480}
                height={480}
                sizes="(max-width: 640px) 128px, 160px"
                className="relative w-full rounded-full block aspect-square object-cover"
                priority
              />
            </div>
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary font-display">
                Tommy Lahitte
              </h1>
              <p className="mt-1 text-lg font-medium">
                <span className="text-accent">Maker &amp; Tinkerer</span>
                <span className="text-text-muted mx-2">·</span>
                <span className="text-text-muted">Art meets Technology</span>
              </p>
            </div>
          </div>
        </div>
      </AuroraBackground>

      <section className="py-10 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <AboutCard />
        </div>
      </section>

      <section className="border-t border-border">
        <ExperienceTimeline />
      </section>
    </>
  )
}
