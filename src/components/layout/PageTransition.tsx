'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { usePathname } from 'next/navigation'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Remember the route we first rendered at, and only start animating once the
  // user navigates away from it client-side. While `animatedPath` is null we
  // render static content — this matches the SSR HTML exactly (no hydration
  // mismatch) and avoids an opacity flash / LCP penalty on the first load.
  const [initialPath] = useState(pathname)
  const [animatedPath, setAnimatedPath] = useState<string | null>(null)

  useEffect(() => {
    if (pathname !== initialPath) setAnimatedPath(pathname)
  }, [pathname, initialPath])

  if (animatedPath === null) {
    return <div className="flex flex-col min-h-screen">{children}</div>
  }

  return (
    <motion.div
      key={animatedPath}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col min-h-screen"
    >
      {children}
    </motion.div>
  )
}
