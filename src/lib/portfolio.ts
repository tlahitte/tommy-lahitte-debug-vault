// Portfolio videos — hardcoded list showcased on /portfolio.
//
// To add a video: copy an entry below and edit the fields.
//  - platform + videoId: pull from the share URL.
//      YouTube  https://www.youtube.com/watch?v=dQw4w9WgXcQ   -> videoId: 'dQw4w9WgXcQ'
//      YouTube  https://youtu.be/dQw4w9WgXcQ                  -> videoId: 'dQw4w9WgXcQ'
//      Vimeo    https://vimeo.com/76979871                    -> videoId: '76979871'
//  - thumbnail (optional): a path under /public (e.g. '/images/portfolio/my-film.jpg').
//      YouTube videos auto-derive a thumbnail if you leave this out.
//      Vimeo videos SHOULD provide one (Vimeo has no predictable public thumbnail URL).
//  - Order in this array = display order in the grid.

export type VideoPlatform = 'youtube' | 'vimeo'

export interface PortfolioVideo {
  /** Stable unique id — used as React key and lightbox handle. */
  id: string
  /** Title revealed on hover and shown in the lightbox. */
  title: string
  /** Short context line (role, client, year…). Optional. */
  subtitle?: string
  platform: VideoPlatform
  /** Platform-specific video id (see header comment). */
  videoId: string
  /** Optional poster image path under /public. Auto-derived for YouTube if omitted. */
  thumbnail?: string
  /** Optional year, shown as a small meta tag. */
  year?: number
}

// Videos from https://www.youtube.com/@tlahitte (newest first).
export const portfolioVideos: PortfolioVideo[] = [
  {
    id: 'drawn-to-life',
    title: 'Drawn to Life',
    subtitle: 'Projection supervisor reel',
    platform: 'youtube',
    videoId: 'J4RfDfxqVe4',
  },
  {
    id: 'chimelong-circus',
    title: 'Chimelong Circus 2026',
    subtitle: 'Full live show',
    platform: 'youtube',
    videoId: '1CTwSDATwoA',
    year: 2026,
  },
  {
    id: 'roger-waters-us-them',
    title: 'Roger Waters — Us + Them',
    subtitle: 'Live tour, 2017',
    platform: 'youtube',
    videoId: 'bTCXh1jS4yE',
    year: 2017,
  },
  {
    id: 'la-perle',
    title: 'La Perle',
    subtitle: 'Al Habtoor City, Dubai',
    platform: 'youtube',
    videoId: 'F19mRb8D910',
  },
  {
    id: 'kirkorov-tour-2016',
    title: 'Philipp Kirkorov',
    subtitle: 'International tour, 2016',
    platform: 'youtube',
    videoId: '1XSLuelKNVI',
    year: 2016,
  },
  {
    id: 'suto',
    title: 'Suto',
    subtitle: 'Interactive installation',
    platform: 'youtube',
    videoId: 'e8IYQ45bCOs',
  },
  {
    id: 'marble-maze',
    title: 'Marble Maze',
    platform: 'youtube',
    videoId: 'eb9N4AuunGk',
  },
  {
    id: 'fatboy-space',
    title: 'Fatboy Space',
    subtitle: 'Interactive installation',
    platform: 'youtube',
    videoId: '45Bt1Gdl0bU',
  },
  {
    id: 'territoire-banq',
    title: 'Territoire',
    subtitle: 'Concours BAnQ, Montréal',
    platform: 'youtube',
    videoId: '4DuAIWu5srA',
  },
]

/**
 * Poster image for a video card.
 * YouTube: derive from the video id (hqdefault is always present, 480x360).
 * Vimeo (or any platform): use the supplied thumbnail, else a neutral placeholder.
 */
export function getThumbnailUrl(video: PortfolioVideo): string {
  if (video.thumbnail) return video.thumbnail
  if (video.platform === 'youtube') {
    return `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`
  }
  // No reliable public thumbnail for Vimeo without an API call — fall back.
  return '/images/portfolio/placeholder.svg'
}

/** Embeddable iframe URL for the lightbox. autoplay=1 since the user just clicked. */
export function getEmbedUrl(video: PortfolioVideo): string {
  if (video.platform === 'youtube') {
    const params = new URLSearchParams({
      autoplay: '1',
      rel: '0',
      modestbranding: '1',
    })
    return `https://www.youtube-nocookie.com/embed/${video.videoId}?${params}`
  }
  // vimeo
  const params = new URLSearchParams({ autoplay: '1', title: '0', byline: '0', portrait: '0' })
  return `https://player.vimeo.com/video/${video.videoId}?${params}`
}
