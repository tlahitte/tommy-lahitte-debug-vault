import { portfolioVideos, getThumbnailUrl, getThumbnailSrcSet } from '@/lib/portfolio'

const ROWS = 6

// Decorative wall of portfolio stills behind the homepage hero. The wall is
// tilted in perspective and each row pans slowly (alternating direction), so
// it reads as a projection surface drifting past. It spans the viewport like
// the nav bar and is masked (see .hero-mosaic in globals.css) to sit on the
// portrait side on desktop and behind the portrait only on mobile, leaving the
// text on clean surface. Each row is the list rotated by a different offset
// and rendered twice so translating by -50% loops seamlessly.
export default function HeroMosaic() {
  const rows = Array.from({ length: ROWS }, (_, r) => {
    const offset = (r * 5) % portfolioVideos.length
    return [...portfolioVideos.slice(offset), ...portfolioVideos.slice(0, offset)]
  })

  return (
    <div
      aria-hidden="true"
      className="hero-mosaic absolute -top-14 h-[17rem] sm:h-auto sm:bottom-0 left-1/2 -translate-x-1/2 w-screen pointer-events-none select-none overflow-hidden"
    >
      <div className="absolute inset-0 [perspective:1400px]">
        <div
          className="absolute -inset-x-[15%] -inset-y-[20%] flex flex-col justify-center gap-4"
          style={{ transform: 'rotateY(-22deg) rotateZ(-9deg) rotateX(8deg)', transformOrigin: '70% 50%' }}
        >
          {rows.map((row, r) => (
            <div
              key={r}
              className="flex w-max motion-safe:animate-marquee"
              style={{
                animationDirection: r % 2 ? 'reverse' : 'normal',
                animationDuration: `${110 + r * 12}s`,
              }}
            >
              {[...row, ...row].map((video, i) => (
                <div key={`${video.id}-${i}`} className="pr-4 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getThumbnailUrl(video)}
                    srcSet={getThumbnailSrcSet(video)}
                    sizes="(min-width: 1024px) 320px, (min-width: 640px) 288px, 224px"
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="w-56 sm:w-72 lg:w-80 aspect-video rounded-xl object-cover shadow-lg shadow-black/10"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* Airy wash: lifts the stills toward the page colour without hiding them.
          A 30%-opaque surface layer renders the same as
          color-mix(var(--surface) 30%, transparent) but works everywhere. */}
      <div className="absolute inset-0 bg-surface opacity-30" />
    </div>
  )
}
