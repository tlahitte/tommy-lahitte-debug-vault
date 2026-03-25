'use client'

import { motion } from 'motion/react'
import { useHydrated } from '@/hooks/useHydrated'

export default function Template({ children }: { children: React.ReactNode }) {
  const hydrated = useHydrated()

  return (
    <motion.div
      initial={hydrated ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
