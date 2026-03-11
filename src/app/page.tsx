// PHASE 3: DONE
import type { Metadata } from 'next'
import Link from 'next/link'
import Hero from '@/components/home/Hero'
import AboutCard from '@/components/home/AboutCard'
import TipCard from '@/components/tips/TipCard'
import { getAllTips } from '@/lib/tips'

export const metadata: Metadata = {
  title: 'Tommy Lahitte | QA Engineer & Unreal Debug Vault',
  description:
    'QA and debugging field notes for Unreal Engine by Tommy Lahitte, QA Engineer at Epic Games. Tips on the Visual Logger, functional testing, log filtering, and more.',
  alternates: {
    canonical: 'https://tommylahitte.com/',
  },
  openGraph: {
    title: 'Tommy Lahitte | QA Engineer & Unreal Debug Vault',
    description:
      'QA and debugging field notes for Unreal Engine by Tommy Lahitte, QA Engineer at Epic Games.',
    url: 'https://tommylahitte.com/',
    type: 'website',
  },
}

export default function HomePage() {
  const latestTips = getAllTips().slice(0, 3)

  return (
    <>
      <Hero />
      <AboutCard />
      <section className="pb-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-100 mb-6">Latest Tips</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {latestTips.map((tip) => (
              <TipCard key={tip.slug} tip={tip} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/tips"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors"
            >
              View All Tips
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
