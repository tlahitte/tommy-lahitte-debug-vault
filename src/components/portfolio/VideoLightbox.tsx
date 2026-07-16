'use client'

import { useEffect, useId, useRef } from 'react'
import { motion } from 'motion/react'
import type { PortfolioVideo } from '@/lib/portfolio'
import { getEmbedUrl } from '@/lib/portfolio'

interface Props {
  video: PortfolioVideo
  onClose: () => void
}

// Modal that plays the embed. Mounted only while open (parent wraps it in
// <AnimatePresence>), so the iframe — and its network cost — only exists when
// a video is actually being watched. Handles Escape, body-scroll lock, and
// focus management for accessibility.
export default function VideoLightbox({ video, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)

    // Lock background scroll without a layout shift when the scrollbar vanishes.
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    const { overflow, paddingRight } = document.body.style
    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`

    closeRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = overflow
      document.body.style.paddingRight = paddingRight
      previouslyFocused?.focus?.()
    }
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onMouseDown={(e) => {
        // Close only when the backdrop itself is pressed, not the dialog.
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <motion.div
        className="relative w-full max-w-4xl"
        initial={{ scale: 0.96, opacity: 0, y: 8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 8 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Header: title + close */}
        <div className="mb-3 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 id={titleId} className="truncate font-display text-lg font-semibold text-white">
              {video.title}
            </h2>
            {video.subtitle && (
              <p className="truncate text-sm text-white/60">{video.subtitle}</p>
            )}
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close video"
            className="shrink-0 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Player */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black shadow-2xl">
          <iframe
            src={getEmbedUrl(video)}
            title={video.title}
            className="absolute inset-0 h-full w-full"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
          />
        </div>
      </motion.div>
    </motion.div>
  )
}
