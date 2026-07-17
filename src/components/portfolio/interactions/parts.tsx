'use client'

import { useEffect, useRef, useState } from 'react'
import type { PortfolioVideo } from '@/lib/portfolio'
import {
  getThumbnailUrl,
  getThumbnailFallbackUrl,
  CATEGORY_LABELS,
} from '@/lib/portfolio'

/** Shared easing — soft, no snap. Used by every interaction. */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/** Props every interaction variant receives. */
export interface VariantProps {
  video: PortfolioVideo
  onOpen: (video: PortfolioVideo) => void
}

/* ------------------------------------------------------------------ */
/*  Presentational pieces shared across all interactions               */
/* ------------------------------------------------------------------ */

/** The poster image. maxresdefault with an hqdefault fallback on error. */
export function Poster({
  video,
  className = '',
}: {
  video: PortfolioVideo
  className?: string
}) {
  const primary = getThumbnailUrl(video)
  const fallback = getThumbnailFallbackUrl(video)
  const [src, setSrc] = useState(primary)
  const ref = useRef<HTMLImageElement>(null)

  // Reset when the video changes.
  useEffect(() => {
    setSrc(primary)
  }, [primary])

  // maxresdefault is absent for many uploads (YouTube 404s it). A plain onError
  // misses failures that happen before hydration on the statically-exported
  // page, so also check on mount: an image that finished loading with zero
  // natural width has failed — fall back to hqdefault, which always exists.
  useEffect(() => {
    const img = ref.current
    if (img && img.complete && img.naturalWidth === 0 && fallback && src !== fallback) {
      setSrc(fallback)
    }
  }, [src, fallback])

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={src}
      alt=""
      loading="lazy"
      draggable={false}
      onError={() => {
        if (fallback && src !== fallback) setSrc(fallback)
      }}
      className={`h-full w-full object-cover ${className}`}
    />
  )
}

/** Category · year eyebrow. */
export function Eyebrow({
  video,
  className = '',
}: {
  video: PortfolioVideo
  className?: string
}) {
  return (
    <div
      className={`flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-white/70 ${className}`}
    >
      <span>{CATEGORY_LABELS[video.category]}</span>
      {video.year && (
        <>
          <span aria-hidden="true">·</span>
          <span>{video.year}</span>
        </>
      )}
    </div>
  )
}

/** Role · client · venue line. */
export function MetaLine({
  video,
  className = '',
}: {
  video: PortfolioVideo
  className?: string
}) {
  const roleText = video.role
    ? video.employer
      ? `${video.role} at ${video.employer}`
      : video.role
    : video.employer
  const bits = [roleText, video.client, video.venue].filter(Boolean)
  if (bits.length === 0) return null
  return <p className={`text-xs text-white/75 ${className}`}>{bits.join(' · ')}</p>
}

/** Title (display font). */
export function TitleText({
  video,
  className = '',
}: {
  video: PortfolioVideo
  className?: string
}) {
  return (
    <h3 className={`font-display font-semibold leading-snug text-white ${className}`}>
      {video.title}
    </h3>
  )
}

/** Description body. */
export function Body({
  video,
  className = '',
}: {
  video: PortfolioVideo
  className?: string
}) {
  if (!video.description) return null
  return (
    <p className={`text-sm leading-relaxed text-white/85 ${className}`}>
      {video.description}
    </p>
  )
}

/** Play glyph — a frosted circle with a triangle. */
export function PlayGlyph({ className = '' }: { className?: string }) {
  return (
    <span
      className={`flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md ${className}`}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="translate-x-0.5">
        <path d="M8 5v14l11-7z" />
      </svg>
    </span>
  )
}

/**
 * Static, non-animated card content for touch / small screens (< sm), where
 * there is no hover to drive the interaction. Poster + a readable stacked
 * block of eyebrow, title, meta and description. Shares the poster URL with
 * the desktop layer, so the browser fetches the image only once.
 */
export function MobileStatic({ video }: { video: PortfolioVideo }) {
  return (
    <div className="absolute inset-0 sm:hidden">
      <Poster video={video} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <Eyebrow video={video} className="mb-1" />
        <TitleText video={video} className="text-base" />
        <MetaLine video={video} className="mt-0.5" />
        <Body video={video} className="mt-1.5 text-white/80" />
      </div>
    </div>
  )
}
