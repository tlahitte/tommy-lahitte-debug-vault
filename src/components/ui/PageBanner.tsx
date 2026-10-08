import type { ReactNode } from 'react'
import Link from 'next/link'
import { PAGE_BANNERS, getStillSrcSet, getStillUrl, portfolioVideos, type BannerPage } from '@/lib/portfolio'

interface Props {
  page: BannerPage
  title: string
  subtitle: ReactNode
}

// Cinematic page header shared by /portfolio, /about, /tips and /blog: a still
// from a real project, full strength, with a dark wash bottom-left for the
// title. It breaks out of <main> to span the viewport like the nav bar and
// slides up under the translucent sticky header (-mt-14 = header height), so
// the nav reads as part of the banner; only the bottom corners are rounded.
// The text column lines up with the header's max-w-4xl container.
export default function PageBanner({ page, title, subtitle }: Props) {
  const video = portfolioVideos.find((v) => v.id === PAGE_BANNERS[page])

  return (
    <section className="relative left-1/2 -translate-x-1/2 w-screen -mt-14 overflow-hidden rounded-b-2xl sm:rounded-b-3xl bg-black">
      {video && (
        // eslint-disable-next-line @next/next/no-img-element -- static export, images are unoptimized
        <img
          src={getStillUrl(video)}
          srcSet={getStillSrcSet(video)}
          sizes="100vw"
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.55) 0, transparent 9rem), linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.1) 100%), linear-gradient(90deg, rgba(0,0,0,0.55) 0%, transparent 65%)',
        }}
      />
      <div className="relative z-10 mx-auto flex min-h-[20rem] sm:min-h-[28rem] w-full max-w-4xl flex-col justify-end px-4 sm:px-8 pb-8 sm:pb-12 pt-28">
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white">{title}</h1>
        <p className="mt-3 max-w-xl text-sm sm:text-base text-white/80">{subtitle}</p>
      </div>
      {video && (
        <Link
          href="/portfolio/"
          className="absolute bottom-4 right-4 sm:bottom-5 sm:right-6 z-10 hidden md:inline-flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm hover:bg-black/60 transition-colors duration-200"
        >
          {video.title}
          {(video.client || video.year) && (
            <span className="text-white/60">
              · {[video.client, video.year].filter(Boolean).join(', ')}
            </span>
          )}
        </Link>
      )}
    </section>
  )
}
