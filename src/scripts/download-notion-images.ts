import fs from 'fs'
import path from 'path'

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
  const ext = extractExtension(notionUrl)
  const filename = `${blockId}.${ext}`
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
  fs.writeFileSync(destPath, buffer)

  return localUrl
}
