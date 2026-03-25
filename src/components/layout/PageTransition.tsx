'use client'

import { useRef } from 'react'
import { motion } from 'motion/react'
import { usePathname } from 'next/navigation'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isFirstRender = useRef(true)

  // Skip animation on initial SSR render to avoid LCP penalty (content starts visible).
  // Only animate on subsequent client-side navigations.
  if (isFirstRender.current) {
    isFirstRender.current = false
    return (
      <div className="flex flex-col min-h-screen">
        {children}
      </div>
    )
  }

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col min-h-screen"
    >
      {children}
    </motion.div>
  )
}
