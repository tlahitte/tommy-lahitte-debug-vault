import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

// Raster images are re-encoded to WebP and capped at this width. Covers and
// inline images never render wider than the ~768px article column (2x for
// retina is covered), and Notion uploads are often multi-megabyte originals.
const MAX_WIDTH = 1600
const WEBP_QUALITY = 78

// Formats sharp re-encodes. GIFs (possibly animated) and SVGs are kept as-is.
const OPTIMIZABLE = ['jpg', 'jpeg', 'png', 'webp', 'avif']

function extractExtension(url: string): string {
  try {
    const pathname = new URL(url).pathname
    const ext = path.extname(pathname).slice(1).toLowerCase() || 'jpg'
    // Normalize common formats
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'svg'].includes(ext) ? ext : 'jpg'
  } catch {
    return 'jpg'
  }
}

export async function downloadNotionImage(notionUrl: string, blockId: string): Promise<string> {
  const sourceExt = extractExtension(notionUrl)
  const optimize = OPTIMIZABLE.includes(sourceExt)
  const filename = `${blockId}.${optimize ? 'webp' : sourceExt}`
  const destDir = path.join(process.cwd(), 'public', 'notion-images')
  const destPath = path.join(destDir, filename)
  const localUrl = `/notion-images/${filename}`

  if (fs.existsSync(destPath)) {
    return localUrl
  }

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true })
  }

  const response = await fetch(notionUrl)
  if (!response.ok) {
    throw new Error(`Failed to download Notion image: ${response.status} ${notionUrl}`)
  }
  const buffer = Buffer.from(await response.arrayBuffer())

  if (optimize) {
    // rotate() applies EXIF orientation before metadata is stripped.
    await sharp(buffer)
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY, effort: 6, smartSubsample: true })
      .toFile(destPath)
  } else {
    fs.writeFileSync(destPath, buffer)
  }

  return localUrl
}
