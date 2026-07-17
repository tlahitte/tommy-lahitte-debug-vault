import type { Metadata } from 'next'
import ExperienceTimeline from '@/components/about/ExperienceTimeline'
import RandomDoodle from '@/components/ui/RandomDoodle'

export const metadata: Metadata = {
  title: 'About',
  description:
    "Tommy Lahitte's experience: a decade of projection supervision on international live shows, now Virtual Production at Epic Games.",
  alternates: {
    canonical: 'https://tommylahitte.com/about/',
  },
  openGraph: {
    title: 'About | Tommy Lahitte',
    description:
      'A decade of projection supervision on international live shows, now Virtual Production at Epic Games.',
    url: 'https://tommylahitte.com/about/',
    type: 'profile',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Tommy Lahitte, Technical Artist & Projection Supervisor' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About | Tommy Lahitte',
    description:
      'A decade of projection supervision on international live shows, now Virtual Production at Epic Games.',
    images: ['/og-image.png'],
  },
}

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ProfilePage',
            name: 'About Tommy Lahitte',
            url: 'https://tommylahitte.com/about/',
            mainEntity: {
              '@type': 'Person',
              name: 'Tommy Lahitte',
              jobTitle: 'Technical Artist & Projection Supervisor',
              worksFor: { '@type': 'Organization', name: 'Epic Games' },
              url: 'https://tommylahitte.com',
              sameAs: [
                'https://github.com/tlahitte',
                'https://uk.linkedin.com/in/tlahitte',
                'https://www.instagram.com/1day.snap/',
                'https://www.artstation.com/tlahitte',
              ],
            },
          }),
        }}
      />

      {/* Page header — matches the visual identity of /portfolio and /tips */}
      <section className="relative overflow-hidden bg-surface-raised border-b border-border hero-texture">
        <div
          className="absolute top-0 inset-x-0 h-96 z-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, color-mix(in srgb, var(--accent) 7%, transparent) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 px-4 sm:px-6 pt-8 sm:pt-12 pb-16">
          <h1 className="text-3xl font-bold text-text-primary mb-2 font-display">About</h1>
          <p className="text-text-muted">
            A decade of live shows, now building the future of virtual production.
          </p>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 w-full px-4 sm:px-6 bottom-0 pointer-events-none select-none hidden sm:block">
          <div className="ml-auto opacity-100" style={{ width: 'clamp(10rem, 15vw, 16rem)', height: 'clamp(10rem, 15vw, 16rem)' }}>
            <RandomDoodle />
          </div>
        </div>
      </section>

      <div className="px-4 sm:px-6 pb-32 pt-8">
        <div className="rounded-2xl bg-surface-raised p-6 sm:p-8 overflow-hidden">
          <ExperienceTimeline />
        </div>
      </div>
    </>
  )
}
