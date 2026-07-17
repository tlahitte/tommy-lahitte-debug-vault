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
//
// EDITABLE COPY: `description`, `role`, `client`, and `venue` are placeholder
// context derived from each video's subtitle — refine the wording to match how
// you'd describe your own work. `interaction` picks the hover-reveal style
// (see src/components/portfolio/interactions).

export type VideoPlatform = 'youtube' | 'vimeo'

export type VideoCategory = 'live' | 'virtual-production' | 'installation' | 'film'

/** Hover-reveal interaction style. One distinct treatment per card. */
export type InteractionVariant =
  | 'split-fold'
  | 'curtain-rise'
  | 'letterbox'
  | 'iris'
  | 'parallax-slide'
  | 'depth-push'
  | 'stagger-cascade'
  | 'corner-expand'
  | 'ken-burns-sheet'

export interface PortfolioVideo {
  /** Stable unique id — used as React key and lightbox handle. */
  id: string
  /** Title revealed on hover and shown in the lightbox. */
  title: string
  /** Short context line (role, client, year…). Optional. */
  subtitle?: string
  /** One- or two-sentence description of the work, revealed on hover. Editable. */
  description?: string
  /** Your role on the project (e.g. 'Projection Supervisor'). Editable. */
  role?: string
  /** Client or production company (e.g. 'Cirque du Soleil'). Editable. */
  client?: string
  /** Employer / studio the work was done through (e.g. 'VYV'). Editable. */
  employer?: string
  /** Venue / location (e.g. 'Al Habtoor City, Dubai'). Editable. */
  venue?: string
  /** Grouping used by the category filter. */
  category: VideoCategory
  /** Featured items render as full-width cards above the grid. */
  featured?: boolean
  /** Hover-reveal interaction style. */
  interaction: InteractionVariant
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
    description:
      "Cirque du Soleil's resident Orlando production, where hand-drawn animation meets live acrobatics. The projection ran in real time on Photon media servers, tracking 17 moving props and shape-shifting curtains cued live by the show's band.",
    role: 'Projection Supervisor',
    client: 'Cirque du Soleil',
    employer: 'VYV',
    venue: 'Disney Springs, Orlando',
    category: 'live',
    featured: true,
    interaction: 'iris',
    platform: 'youtube',
    videoId: 'J4RfDfxqVe4',
    year: 2021,
  },
  {
    id: 'roger-waters-us-them',
    title: 'Roger Waters: Us + Them',
    subtitle: 'Live tour, 2017',
    description:
      "Roger Waters' Us + Them world tour, with over 20 projection surfaces, rolling screens and a drone-flown pig. Fifty Copernic units handled per-venue calibration and live tracking, blending uncompressed HD with real-time camera effects across 32 megapixels.",
    role: 'Projection Supervisor',
    client: 'Roger Waters',
    employer: 'VYV',
    venue: 'Us + Them World Tour',
    category: 'live',
    featured: true,
    interaction: 'iris',
    platform: 'youtube',
    videoId: 'bTCXh1jS4yE',
    year: 2017,
  },
  {
    id: 'la-perle',
    title: 'La Perle',
    subtitle: 'Al Habtoor City, Dubai',
    description:
      "Franco Dragone's resident aqua theatre at Al Habtoor City, the first of its kind in the region. Fifteen Photon servers fed 24 moving-head projectors, with 40 infrared cameras handling motion tracking and live projector calibration over the water stage.",
    role: 'Projection Systems',
    client: 'Dragone',
    employer: 'VYV',
    venue: 'Al Habtoor City, Dubai',
    category: 'live',
    featured: true,
    interaction: 'iris',
    platform: 'youtube',
    videoId: 'F19mRb8D910',
    year: 2017,
  },
  {
    id: 'cctv-gala-2019',
    title: 'CCTV New Year Gala',
    subtitle: 'Chinese New Year, 2019',
    description:
      'The annual CCTV Spring Festival Gala, watched by hundreds of millions. Real-time tracking followed 36 ballerinas and 14 hoverboards across a 200-metre LED floor, triggering video on eight Photon servers.',
    role: 'Photon Specialist',
    client: 'CCTV',
    employer: 'VYV',
    venue: 'Shenzhen, China',
    category: 'live',
    interaction: 'iris',
    platform: 'youtube',
    videoId: 'cZz-ZPWNj4Y',
    year: 2019,
  },
  {
    id: '1001-nights',
    title: '1001 Nights: The Last Chapter',
    subtitle: 'Al Majaz Amphitheatre, Sharjah',
    description:
      'An open-air production by Les 7 Doigts at the Al Majaz Amphitheatre. Photon servers and a 24-camera tracking rig mapped a rotating multi-cube set and corrected performer shadows in real time.',
    client: 'Les 7 Doigts',
    employer: 'VYV',
    venue: 'Sharjah, UAE',
    category: 'live',
    interaction: 'iris',
    platform: 'youtube',
    videoId: 'MbGSBsv03X0',
    year: 2019,
  },
  {
    id: 'mother-of-the-nation',
    title: 'Mother of the Nation',
    subtitle: 'Abu Dhabi',
    description:
      'Opening night of the Mother of the Nation Festival in Abu Dhabi. Twelve Photon servers and 52 projectors mapped a 70-metre proscenium built from 38 petals.',
    client: 'Balich Worldwide Shows',
    employer: 'VYV',
    venue: 'Abu Dhabi',
    category: 'live',
    interaction: 'iris',
    platform: 'youtube',
    videoId: 'Q3YhDidhSms',
    year: 2016,
  },
  {
    id: 'chimelong-circus',
    title: 'Chimelong Circus',
    subtitle: 'Zhuhai, China',
    description:
      'Video programming for a full-length live circus spectacular staged in Zhuhai.',
    role: 'Video Programming',
    client: 'Chimelong',
    venue: 'Zhuhai, China',
    category: 'live',
    interaction: 'iris',
    platform: 'youtube',
    videoId: 'Q8XNgjWE4VA',
  },
  {
    id: 'kirkorov-tour-2016',
    title: 'Philipp Kirkorov',
    subtitle: 'International tour, 2016',
    description:
      'Video content and playback for a large-scale international concert tour.',
    role: 'Video & Playback',
    employer: 'VYV',
    venue: 'International Tour',
    category: 'live',
    interaction: 'iris',
    platform: 'youtube',
    videoId: '1XSLuelKNVI',
    year: 2016,
  },
  {
    id: 'cite-memoire',
    title: 'Cité Mémoire',
    subtitle: 'Montréal',
    description:
      'Large-scale outdoor projection mapping woven through the streets of Old Montréal.',
    venue: 'Montréal',
    category: 'installation',
    interaction: 'iris',
    platform: 'youtube',
    videoId: 'L4eMvEazLZc',
  },
  {
    id: 'uninterrupted-vancouver',
    title: 'Uninterrupted',
    subtitle: 'Cambie Bridge, Vancouver',
    description:
      "Nettie Wild's outdoor projection installation under Vancouver's Cambie Bridge, following migrating Pacific salmon. Two Photon media servers drove eight projectors across an 1,100-metre surface at 30 megapixels.",
    employer: 'VYV',
    venue: 'Vancouver',
    category: 'installation',
    interaction: 'iris',
    platform: 'youtube',
    videoId: 'eHn-1e65JJM',
    year: 2017,
  },
  {
    id: 'suto',
    title: 'Suto',
    subtitle: 'Interactive installation',
    description:
      'An interactive installation exploring playful, responsive projection.',
    role: 'Creative Technology',
    category: 'installation',
    interaction: 'iris',
    platform: 'youtube',
    videoId: 'e8IYQ45bCOs',
    year: 2018,
  },
  {
    id: 'marble-maze',
    title: 'Marble Maze',
    subtitle: 'Interactive installation',
    description:
      'A tactile interactive piece where the audience steers the action.',
    role: 'Creative Technology',
    category: 'installation',
    interaction: 'iris',
    platform: 'youtube',
    videoId: 'eb9N4AuunGk',
    year: 2018,
  },
  {
    id: 'fatboy-space',
    title: 'Fatboy Space',
    subtitle: 'Interactive installation',
    description:
      'A playful interactive installation built to invite touch and experiment.',
    role: 'Creative Technology',
    category: 'installation',
    interaction: 'iris',
    platform: 'youtube',
    videoId: '45Bt1Gdl0bU',
    year: 2017,
  },
  {
    id: 'territoire-banq',
    title: 'Territoire',
    subtitle: 'Concours BAnQ, Montréal',
    description:
      'Competition concept for the Bibliothèque et Archives nationales du Québec.',
    role: 'Concept',
    client: 'BAnQ',
    venue: 'Montréal',
    category: 'installation',
    interaction: 'iris',
    platform: 'youtube',
    videoId: '4DuAIWu5srA',
    year: 2015,
  },
]

/** Human label for a category (used by the filter and card eyebrow). */
export const CATEGORY_LABELS: Record<VideoCategory, string> = {
  live: 'Live Shows',
  'virtual-production': 'Virtual Production',
  installation: 'Installations',
  film: 'Film',
}

/**
 * Poster image for a video card.
 * YouTube: prefer maxresdefault (1280x720) for crisp full-bleed cards. It is
 * missing on some older uploads, so the <Poster> component falls back to
 * hqdefault on error.
 * Vimeo (or any platform): use the supplied thumbnail, else a neutral placeholder.
 */
export function getThumbnailUrl(video: PortfolioVideo): string {
  if (video.thumbnail) return video.thumbnail
  if (video.platform === 'youtube') {
    return `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`
  }
  // No reliable public thumbnail for Vimeo without an API call — fall back.
  return '/images/portfolio/placeholder.svg'
}

/** Fallback poster when maxresdefault is missing (always-present hqdefault). */
export function getThumbnailFallbackUrl(video: PortfolioVideo): string | null {
  if (video.platform === 'youtube') {
    return `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`
  }
  return null
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
