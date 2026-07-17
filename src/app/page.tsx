import type { Metadata } from 'next'
import Hero from '@/components/home/Hero'
import DisciplinesSection from '@/components/home/DisciplinesSection'
import FreshFromTheVault from '@/components/home/LatestTipsSection'
import CreditsWall from '@/components/home/CreditsWall'
import RevealSection from '@/components/ui/RevealSection'
import { getAllPosts } from '@/lib/blog'
import { getAllTips } from '@/lib/tips'

export const metadata: Metadata = {
  title: 'Tommy Lahitte | Technical Artist & Projection Supervisor',
  description:
    'Technical artist and projection supervisor behind international live shows for Cirque du Soleil, Roger Waters and La Perle, now pushing real-time craft into Virtual Production at Epic Games.',
  alternates: {
    canonical: 'https://tommylahitte.com/',
  },
  openGraph: {
    title: 'Tommy Lahitte | Technical Artist & Projection Supervisor',
    description:
      'Projection supervisor and technical artist for international live shows, now in Virtual Production at Epic Games.',
    url: 'https://tommylahitte.com/',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Tommy Lahitte, Technical Artist & Projection Supervisor' }],
  },
}

export default async function HomePage() {
  const [posts, tips] = await Promise.all([
    getAllPosts(),
    getAllTips(),
  ])

  return (
    <div className="flex flex-col gap-6 py-10 sm:py-14">

      {/* Hero */}
      <RevealSection>
        <div className="p-4 sm:p-8">
          <Hero />
        </div>
      </RevealSection>

      {/* Selected credits — career proof up front, links through to /about */}
      <RevealSection delay={0.1}>
        <div className="panel-card">
          <CreditsWall />
        </div>
      </RevealSection>

      {/* Disciplines */}
      <RevealSection delay={0.1}>
        <div className="panel-card">
          <DisciplinesSection />
        </div>
      </RevealSection>

      {/* Fresh from the Vault */}
      <RevealSection delay={0.1}>
        <div className="panel-card">
          <FreshFromTheVault posts={posts} tips={tips} />
        </div>
      </RevealSection>

      {/* Contact CTA */}
      <RevealSection delay={0.1}>
        <div className="panel-card">
          <div className="rounded-2xl bg-surface-raised p-8 sm:p-12 text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-text-primary">
              Let&apos;s make something unforgettable
            </h2>
            <p className="mt-3 text-text-muted max-w-lg mx-auto">
              Available for virtual production, live-event, and projection consulting.
            </p>
            <a
              href="https://uk.linkedin.com/in/tlahitte"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white hover:opacity-85 transition-opacity duration-200"
            >
              Get in touch
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </RevealSection>

    </div>
  )
}
