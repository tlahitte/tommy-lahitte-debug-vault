import { portfolioVideos, getStillSrcSet, getStillUrl } from '@/lib/portfolio'

// Project still shown inside the portrait blob.
const BLOB_STILL = 'mother-of-the-nation'

// Organic blob; the outline ring reuses it with a slight rotation.
const BLOB_RADIUS = '63% 37% 54% 46% / 55% 48% 52% 45%'

// Portrait cutout breaking out of a blob that holds a project still. The
// cutout is drawn twice: once clipped inside the blob (so the shoulders end on
// its curved edge) and once unclipped but cut to its top half (so the head
// rises above the blob's top contour).
export default function HeroPortrait() {
  const still = portfolioVideos.find((v) => v.id === BLOB_STILL)

  const cutout = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/avatar/tommy-lahitte-480.webp"
      alt=""
      width={480}
      height={480}
      draggable={false}
      className="absolute bottom-0 left-1/2 w-full -translate-x-1/2 grayscale brightness-[1.12] contrast-[0.95]"
    />
  )

  return (
    <div className="relative aspect-[1/1.08] w-full">
      {/* Outline ring */}
      <div
        aria-hidden="true"
        className="absolute inset-x-[-4%] bottom-[-3%] top-[28%] border rotate-[-8deg]"
        style={{ borderRadius: BLOB_RADIUS }}
      />
      {/* Blob with the project still and the clipped cutout */}
      <div
        className="absolute inset-x-0 bottom-0 top-[34%] overflow-hidden shadow-2xl shadow-black/15"
        style={{ borderRadius: BLOB_RADIUS, isolation: 'isolate' }}
      >
        {still && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={getStillUrl(still)}
            srcSet={getStillSrcSet(still)}
            sizes="(min-width: 1024px) 352px, (min-width: 640px) 288px, 224px"
            alt=""
            aria-hidden="true"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, color-mix(in srgb, var(--surface) 45%, transparent), color-mix(in srgb, var(--surface) 10%, transparent) 70%), linear-gradient(to top, color-mix(in srgb, var(--accent) 18%, transparent), transparent 60%)',
          }}
        />
        <div className="absolute inset-x-0 bottom-0 top-[-51.515%]">{cutout}</div>
      </div>
      {/* Head breaking out above the blob (top half of the same cutout) */}
      <div aria-hidden="true" className="absolute inset-0 [clip-path:inset(0_0_50%_0)]">
        {cutout}
      </div>
      <span className="sr-only">Tommy Lahitte</span>
    </div>
  )
}
