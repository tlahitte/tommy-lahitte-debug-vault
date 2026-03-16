import { describe, it } from 'vitest'

describe('NotionBlock renderer (NOTI-02)', () => {
  it.todo('renders paragraph block as <p> with text-text-primary leading-relaxed')
  it.todo('renders heading_1 as <h1> with text-3xl font-semibold mt-10 mb-3')
  it.todo('renders heading_2 as <h2> with text-lg font-semibold mt-8 mb-2')
  it.todo('renders heading_3 as <h3> with text-base font-semibold mt-6 mb-1')
  it.todo('renders code block using existing CodeBlock component with bg-zinc-900')
  it.todo('renders callout with bg-surface-raised border border-border rounded-lg px-4 py-3')
  it.todo('renders bulleted_list_item as <li> inside <ul class="list-disc list-outside ml-5 space-y-1">')
  it.todo('renders numbered_list_item as <li> inside <ol class="list-decimal list-outside ml-5 space-y-1">')
  it.todo('renders image block with w-full rounded-xl and optional caption in text-xs text-text-muted')
  it.todo('renders toggle as <details>/<summary> — summary has font-medium text-text-primary cursor-pointer')
  it.todo('renders divider as <hr class="border-t border-border my-8">')
})

describe('NotionBlock silent fallback (NOTI-03)', () => {
  it.todo('renders null for an unknown block type without throwing')
  it.todo('renders null for an undefined block without throwing')
})
