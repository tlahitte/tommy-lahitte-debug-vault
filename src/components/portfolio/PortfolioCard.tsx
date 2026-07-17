'use client'

import type { PortfolioVideo } from '@/lib/portfolio'
import { INTERACTIONS } from './interactions'

interface Props {
  video: PortfolioVideo
  onOpen: (video: PortfolioVideo) => void
}

// Thin dispatcher: renders the hover-reveal interaction assigned to this video
// (see src/lib/portfolio.ts `interaction`). Each variant is a self-contained
// motion component built on the shared <Shell>. Falls back to depth-push.
export default function PortfolioCard({ video, onOpen }: Props) {
  const Interaction = INTERACTIONS[video.interaction] ?? INTERACTIONS['depth-push']
  return <Interaction video={video} onOpen={onOpen} />
}
