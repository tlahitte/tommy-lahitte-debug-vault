'use client'

import type { PortfolioVideo } from '@/lib/portfolio'
import { getThumbnailUrl } from '@/lib/portfolio'

interface Props {
  video: PortfolioVideo
  onOpen: (video: PortfolioVideo) => void
}

// A single thumbnail tile. The hover reveal is pure CSS (group-hover /
// group-focus-visible) so it renders in the SSR HTML and works without JS:
//  - the poster zooms slightly
//  - a gradient scrim fades in
//  - the title + meta slide up into view
//  - a play glyph scales in
// On touch / small screens (no hover) the title stays visible so the grid is
// usable there too.
export default function PortfolioCard({ video, onOpen }: Props) {
  return (
    <button
      type="button"
      onClick={() => onOpen(video)}
      aria-label={`Play video: ${video.title}`}
      className="group relative block aspect-video w-full overflow-hidden rounded-xl bg-surface-raised text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
    >
      {/* Poster */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={getThumbnailUrl(video)}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transform-none"
      />

      {/* Gradient scrim — subtle on mobile, reveals fully on hover/focus */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-70 transition-opacity duration-300 sm:opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
      />

      {/* Play glyph */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-white opacity-0 scale-75 backdrop-blur-md transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 group-focus-visible:opacity-100 group-focus-visible:scale-100 motion-reduce:transition-none">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="translate-x-0.5">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </div>

      {/* Title + meta — slides up and reveals on hover/focus */}
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <div className="translate-y-0 opacity-100 transition-all duration-300 ease-out sm:translate-y-3 sm:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:transform-none">
          <div className="mb-1 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-white/70">
            <span>{video.platform === 'youtube' ? 'YouTube' : 'Vimeo'}</span>
            {video.year && (
              <>
                <span aria-hidden="true">·</span>
                <span>{video.year}</span>
              </>
            )}
          </div>
          <h3 className="font-display text-base font-semibold leading-snug text-white sm:text-lg">
            {video.title}
          </h3>
          {video.subtitle && (
            <p className="mt-0.5 text-xs text-white/70">{video.subtitle}</p>
          )}
        </div>
      </div>
    </button>
  )
}
