'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'motion/react'
import type { PortfolioVideo, VideoCategory } from '@/lib/portfolio'
import { CATEGORY_LABELS } from '@/lib/portfolio'
import PortfolioCard from './PortfolioCard'
import VideoLightbox from './VideoLightbox'

interface Props {
  videos: PortfolioVideo[]
}

const CATEGORY_ORDER: VideoCategory[] = ['live', 'virtual-production', 'installation', 'film']

export default function PortfolioGrid({ videos }: Props) {
  const [activeVideo, setActiveVideo] = useState<PortfolioVideo | null>(null)
  const [category, setCategory] = useState<VideoCategory | 'all'>('all')

  // Categories actually present in the data, in a stable display order.
  const categories = useMemo(() => {
    const present = new Set(videos.map((v) => v.category))
    return CATEGORY_ORDER.filter((c) => present.has(c))
  }, [videos])

  const visible = useMemo(
    () => (category === 'all' ? videos : videos.filter((v) => v.category === category)),
    [videos, category],
  )

  if (videos.length === 0) {
    return <p className="text-sm text-text-muted">No videos yet. Check back soon.</p>
  }

  const filterOptions: (VideoCategory | 'all')[] = ['all', ...categories]

  return (
    <MotionConfig reducedMotion="user">
      {/* Category filter */}
      {categories.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter work by category">
          {filterOptions.map((c) => {
            const label = c === 'all' ? 'All' : CATEGORY_LABELS[c]
            const active = category === c
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                aria-pressed={active}
                className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                  active
                    ? 'border-accent/30 bg-accent/10 text-accent'
                    : 'border-border bg-transparent text-text-muted hover:border-accent/30 hover:bg-accent/10 hover:text-accent'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="text-sm text-text-muted">No videos in this category yet.</p>
      ) : (
        // Uniform grid: every card is the same aspect-video size so the hover
        // reveals behave consistently. Array order preserves the marquee-first
        // sequence without changing card size.
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {visible.map((video) => (
            <PortfolioCard key={video.id} video={video} onOpen={setActiveVideo} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {activeVideo && (
          <VideoLightbox video={activeVideo} onClose={() => setActiveVideo(null)} />
        )}
      </AnimatePresence>
    </MotionConfig>
  )
}
