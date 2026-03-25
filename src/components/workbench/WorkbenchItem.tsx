'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import type { WorkbenchItem as WorkbenchItemType } from '@/data/workbench-objects'

interface Props {
  item: WorkbenchItemType
}

export default function WorkbenchItem({ item }: Props) {
  const [expanded, setExpanded] = useState(false)
  const itemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!expanded) return
    const handler = (e: MouseEvent) => {
      if (itemRef.current && !itemRef.current.contains(e.target as Node)) {
        setExpanded(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [expanded])

  const cardSide = item.side === 'left' ? 'left-full ml-3' : 'right-full mr-3'

  return (
    <div
      ref={itemRef}
      className="fixed"
      style={{
        ...item.css,
        zIndex: item.zIndex ?? 30,
        pointerEvents: 'auto',
      }}
    >
      <div className="relative">
        <motion.button
          onClick={() => setExpanded((v) => !v)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          className="block cursor-pointer focus-visible:outline-none"
          style={{
            transform: `rotate(${item.rotation}deg)`,
            transformOrigin: 'center center',
            filter: 'drop-shadow(4px 8px 16px rgba(15, 8, 0, 0.6))',
            willChange: 'transform',
          }}
          aria-label={`${item.name}: click for details`}
        >
          <Image
            src={item.imageSrc}
            alt={item.name}
            width={600}
            height={600}
            sizes="32vw"
            className="block w-full h-auto"
          />
        </motion.button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className={`absolute top-4 w-52 rounded-xl border border-border bg-surface/95 backdrop-blur-sm shadow-xl p-3 ${cardSide}`}
              style={{ zIndex: 50 }}
            >
              <p className="text-xs font-semibold text-text-primary mb-1.5">{item.name}</p>
              <p className="text-xs text-text-muted leading-relaxed">{item.description}</p>
              <span className="mt-2 inline-block text-[10px] font-medium text-accent/80 bg-accent/10 border border-accent/25 px-1.5 py-0.5 rounded capitalize">
                {item.type}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
