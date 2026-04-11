export interface RichTextItem {
  plain_text: string
  href?: string | null
  annotations: {
    bold: boolean
    italic: boolean
    code: boolean
    strikethrough: boolean
    underline: boolean
  }
}

export type BlogBlock =
  | { type: 'paragraph'; richText: RichTextItem[] }
  | { type: 'heading_1'; richText: RichTextItem[] }
  | { type: 'heading_2'; richText: RichTextItem[] }
  | { type: 'heading_3'; richText: RichTextItem[] }
  | { type: 'code'; richText: RichTextItem[]; language: string }
  | { type: 'callout'; richText: RichTextItem[]; icon?: string }
  | { type: 'bulleted_list_item'; richText: RichTextItem[] }
  | { type: 'numbered_list_item'; richText: RichTextItem[] }
  | { type: 'image'; url: string; caption: RichTextItem[] }
  | { type: 'toggle'; richText: RichTextItem[]; children: BlogBlock[] }
  | { type: 'divider' }

export type PostCategory = 'Project' | 'Article' | 'Recommendation'
export type ProjectStatus = 'In Progress' | 'Complete' | 'Archived'

export interface BlogPost {
  slug: string
  title: string
  date: string
  lastModified?: string
  excerpt: string
  image?: string
  imageAlt?: string
  content: BlogBlock[]
  link?: {
    label: string
    url: string
  }
  category?: PostCategory
  status?: ProjectStatus
  gallery?: string[]  // array of local /notion-images/ paths after build-time download
}
