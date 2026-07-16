'use client'

import { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import type { PortfolioVideo } from '@/lib/portfolio'
import PortfolioCard from './PortfolioCard'
import VideoLightbox from './VideoLightbox'

interface Props {
  videos: PortfolioVideo[]
}

export default function PortfolioGrid({ videos }: Props) {
  const [activeVideo, setActiveVideo] = useState<PortfolioVideo | null>(null)

  if (videos.length === 0) {
    return <p className="text-sm text-text-muted">No videos yet — check back soon.</p>
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6">
        {videos.map((video) => (
          <PortfolioCard key={video.id} video={video} onOpen={setActiveVideo} />
        ))}
      </div>

      <AnimatePresence>
        {activeVideo && (
          <VideoLightbox video={activeVideo} onClose={() => setActiveVideo(null)} />
        )}
      </AnimatePresence>
    </>
  )
}
