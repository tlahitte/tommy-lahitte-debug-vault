'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

interface Props {
  children: React.ReactNode
  className?: string
  /** z-index for stacking order — higher panels slide over lower ones */
  index?: number
  /** Whether this is the last panel (no sticky, just flows normally) */
  isLast?: boolean
}

/**
 * SlidingPanel — wraps a section in a sticky card that stays pinned while
 * the next panel slides up and covers it, creating a stacking-cards effect.
 *
 * Inspired by thelinestudio.com's page-turning scroll animation:
 *  - Incoming panels start with a slight 3D rotation (rotateX) and flatten
 *    as they slide into place, like a page being turned onto the stack
 *  - Covered panels scale down, dim, and gain rounded corners (recede)
 *  - Dynamic shadow intensifies during the overlap to sell depth
 *  - On mobile (<640px), 3D rotation is disabled for performance
 */
export default function SlidingPanel({
  children,
  className = '',
  index = 0,
  isLast = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)

  // ---- Scroll tracking for the "being covered" effect ----
  // Measures how far *this* panel has scrolled past the viewport top
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // ---- Covered-panel transforms (panels being scrolled away) ----
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95])
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1, 0.6])
  const y = useTransform(scrollYProgress, [0, 1], [0, -30])
  const borderRadius = useTransform(scrollYProgress, [0, 1], [16, 24])

  // ---- Incoming-panel transforms (3D page-turn entrance) ----
  // Track when this panel enters from below the viewport
  const { scrollYProgress: enterProgress } = useScroll({
    target: ref,
    // "start end" = top of element reaches bottom of viewport
    // "start start" = top of element reaches top of viewport (fully in view)
    offset: ['start end', 'start start'],
  })

  // Rotation: starts tilted backward and flattens to 0 as it slides in
  const rotateX = useTransform(enterProgress, [0, 0.6, 1], [-6, -1.5, 0])
  // Vertical translate: drift upward as it settles into place
  const enterY = useTransform(enterProgress, [0, 1], [60, 0])


  // The first panel (index 0) shouldn't have an entrance rotation —
  // it's already visible when the page loads
  const isFirst = index === 0

  // The last panel doesn't need sticky or the parallax-out effect,
  // but still needs the ref attached for useScroll to work without errors
  if (isLast) {
    return (
      <div
        ref={ref}
        className={`relative panel-3d-wrapper ${className}`}
        style={{ zIndex: index + 1 }}
      >
        <motion.div
          className="panel-content"
          style={{
            rotateX,
            translateY: enterY,
          }}
        >
          {children}
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      className={`sticky top-0 panel-3d-wrapper ${className}`}
      style={{
        zIndex: index + 1,
        // Entrance animation: 3D page-turn as the panel slides into view
        // Applied on the sticky wrapper so it rotates while sliding up,
        // then flattens once pinned. Skip for the first panel.
        ...(isFirst ? {} : { rotateX, translateY: enterY }),
      }}
    >
      {/* Covered state: scale down + fade as the next panel slides over */}
      <motion.div
        className="panel-content origin-top"
        style={{
          scale,
          opacity,
          y,
          borderRadius,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
