'use client'

import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import type { PortfolioVideo } from '@/lib/portfolio'
import { MobileStatic } from './parts'

/**
 * Shared card shell for every interaction. Renders a single motion.button that
 * enters the `hover` variant on pointer-hover AND keyboard focus, so the reveal
 * is accessible. Child motion elements inherit that active variant label
 * ("rest" | "hover") via variant propagation.
 *
 * The interactive choreography lives in the desktop layer (sm+). Small / touch
 * screens get the static, always-readable MobileStatic layer instead.
 *
 * Reduced motion is handled globally by <MotionConfig reducedMotion="user">
 * in PortfolioGrid: transforms/clip collapse while opacity reveals remain.
 */
export default function Shell({
  video,
  onOpen,
  children,
}: {
  video: PortfolioVideo
  onOpen: (video: PortfolioVideo) => void
  children: ReactNode
}) {
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(video)}
      aria-label={`Play video: ${video.title}`}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileFocus="hover"
      className="group relative block aspect-video w-full overflow-hidden rounded-xl bg-surface-raised text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
    >
      {/* Desktop / hover-capable interactive layer */}
      <div className="absolute inset-0 hidden sm:block">{children}</div>

      {/* Touch / small-screen static layer */}
      <MobileStatic video={video} />
    </motion.button>
  )
}
