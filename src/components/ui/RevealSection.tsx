'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useHydrated } from '@/hooks/useHydrated'
import { useSlowStart } from '@/hooks/useSlowStart'

interface Props {
  children: React.ReactNode
  className?: string
  delay?: number
}

// Wraps a section with a "card rotating into view" entrance animation.
// Each section feels like a physical page being placed on the table as you scroll.
// On SSR/first render, content is fully visible (no opacity:0) to avoid LCP penalty.
export default function RevealSection({ children, className, delay = 0 }: Props) {
  const hydrated = useHydrated()
  const reduceMotion = useReducedMotion()
  const slowStart = useSlowStart()

  // Before hydration: render visible content immediately (no animation penalty).
  // Same with reduced motion (motion doesn't honour it by default), and in
  // browsers without IntersectionObserver, where whileInView would never fire
  // and the content would stay at opacity 0. And on slow devices, where the
  // content has already been visible for a while by the time we hydrate.
  if (!hydrated || reduceMotion || slowStart || typeof IntersectionObserver === 'undefined') {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      style={{ transformOrigin: '50% 110%' }}
      initial={{ opacity: 0, y: 52, rotate: -1.8, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 0.85,
        ease: [0.44, 0.14, 0.28, 1],
        delay,
        opacity: { duration: 0.5 },
      }}
    >
      {children}
    </motion.div>
  )
}
