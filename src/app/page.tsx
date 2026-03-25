import type { Metadata } from 'next'
import Hero from '@/components/home/Hero'
import DisciplinesSection from '@/components/home/DisciplinesSection'
import LatestPostsSection from '@/components/home/LatestPostsSection'
import LatestTipsSection from '@/components/home/LatestTipsSection'
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
  },
}

export default async function HomePage() {
  const [posts, tips] = await Promise.all([
    getAllPosts(),
    Promise.resolve(getAllTips()),
  ])

  return (
    <div className="py-10 sm:py-14 flex flex-col gap-8">

      {/* Hero — first card, no whileInView delay so it appears immediately */}
      <RevealSection>
        <div className="rounded-2xl border border-border bg-surface-raised p-8 sm:p-12 card-elevated">
          <Hero />
        </div>
      </RevealSection>

      {/* Disciplines — horizontal scroll, full bleed within the column */}
      <RevealSection>
        <DisciplinesSection />
      </RevealSection>

      {/* Latest posts */}
      <RevealSection>
        <LatestPostsSection posts={posts.slice(0, 3)} />
      </RevealSection>

      {/* Latest tips */}
      <RevealSection>
        <LatestTipsSection tips={tips.slice(0, 3)} />
      </RevealSection>

      {/* Experience timeline */}
      <RevealSection>
        <div className="rounded-2xl border border-border overflow-hidden">
          <ExperienceTimeline />
        </div>
      </RevealSection>

    </div>
  )
}
