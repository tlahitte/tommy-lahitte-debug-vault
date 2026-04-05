import type { Metadata } from 'next'
import Hero from '@/components/home/Hero'
import DisciplinesSection from '@/components/home/DisciplinesSection'
import FreshFromTheVault from '@/components/home/LatestTipsSection'
import ExperienceTimeline from '@/components/about/ExperienceTimeline'
import RevealSection from '@/components/ui/RevealSection'
import { getAllPosts } from '@/lib/blog'
import { getAllTips } from '@/lib/tips'

export const metadata: Metadata = {
  title: 'Tommy Lahitte | Maker & Tinkerer',
  description:
    'Tommy Lahitte, maker who bridges art and technology. QA Engineer at Epic Games. Electronics, film photography, live events, and the things worth building.',
  alternates: {
    canonical: 'https://tommylahitte.com/',
  },
  openGraph: {
    title: 'Tommy Lahitte | Maker & Tinkerer',
    description:
      'Tommy Lahitte, maker who bridges art and technology. QA Engineer at Epic Games.',
    url: 'https://tommylahitte.com/',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Tommy Lahitte - Maker & Tinkerer' }],
  },
}

export default async function HomePage() {
  const [posts, tips] = await Promise.all([
    getAllPosts(),
    Promise.resolve(getAllTips()),
  ])

  return (
    <div className="flex flex-col gap-6 py-10 sm:py-14">

      {/* Hero */}
      <RevealSection>
        <div className="p-4 sm:p-8">
          <Hero />
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

      {/* Experience */}
      <RevealSection delay={0.1}>
        <div className="panel-card">
          <div className="rounded-2xl bg-surface-raised p-6 sm:p-8 overflow-hidden">
            <ExperienceTimeline />
          </div>
        </div>
      </RevealSection>

    </div>
  )
}
