import type { Tip } from '@/lib/types'

export const tip: Tip = {
  slug: 'content-browser-metadata-search',
  title: 'Content Browser Metadata Search',
  category: 'editor',
  summary:
    'Query Unreal asset metadata directly from the Content Browser search bar to filter by triangle count, collection membership, texture group, and more.',
  tags: ['content-browser', 'metadata', 'search', 'optimization', 'collections', 'editor'],
  publishedAt: '2026-03-12',
  content: [
    {
      type: 'paragraph',
      text: 'Every asset in your Unreal project exposes a set of metadata properties that can be queried straight from the Content Browser search bar. Instead of browsing folders manually or relying on naming conventions alone, you can write targeted expressions to surface exactly what you need.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Basic Syntax',
    },
    {
      type: 'paragraph',
      text: 'The general format is AttributeName==Value. Matching is case-insensitive and values use substring matching, so you do not need to type the full value. Spaces around operators are ignored. The search bar also provides autocomplete suggestions as you type an attribute name.',
    },
    {
      type: 'callout',
      text: 'Tip: Hover over any asset in the Content Browser to reveal a tooltip that shows the available metadata attributes and their exact attribute names for that asset type.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Example 1: Finding Heavy Static Meshes',
    },
    {
      type: 'paragraph',
      text: 'When optimizing a level, you may want to quickly identify all static meshes that exceed a triangle threshold without opening each asset individually. Type the following directly into the Content Browser search bar:',
    },
    {
      type: 'code',
      language: 'bash',
      text: 'Triangles>=300',
    },
    {
      type: 'paragraph',
      text: 'This filters the view to only show static meshes whose triangle count is 300 or above. Adjust the threshold to match your optimization target. This is a good starting point for a performance pass to build a prioritized list of assets to simplify or replace with LODs.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Example 2: Finding Assets Outside of Collections',
    },
    {
      type: 'paragraph',
      text: 'If your project relies heavily on Content Browser Collections to organize assets, orphaned assets that belong to no collection can silently pile up. Use the Collection metadata key with the != operator to expose them:',
    },
    {
      type: 'code',
      language: 'bash',
      text: 'Collection!=LA_Stage_EXR && Collection!=Project_EXR',
    },
    {
      type: 'paragraph',
      text: 'This lists every asset that lives outside both the LA_Stage_EXR and Project_EXR collections. Chain as many && conditions as you have collections to get a complete picture of uncategorized content.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Supported Operators',
    },
    {
      type: 'list',
      items: [
        '==: equality / substring match (e.g. TextureGroup==World)',
        '!=: exclusion (e.g. Collection!=MyCollection)',
        '>= / <=: numeric range (e.g. Triangles>=1000)',
        '> / <: strict numeric comparison',
        '&&: combine multiple conditions (all must be true)',
      ],
    },
    {
      type: 'heading',
      level: 2,
      text: 'Other Useful Metadata Keys',
    },
    {
      type: 'list',
      items: [
        'TextureGroup: filter textures by group (World, UI, Character, etc.)',
        'CompressionSettings: find textures using a specific compression',
        'sRGB: filter by true/false to audit color space consistency',
        'NativeParentClass: find all Blueprints that extend a specific C++ class',
        'NativeClass: match a specific asset type',
        'IsDataOnly: identify data-only Blueprints with no custom logic',
        'RowStructure: filter Data Tables by their row struct type',
        'Dimensions: filter textures by their X or Y resolution',
      ],
    },
    {
      type: 'paragraph',
      text: 'Other numeric keys like NaniteTriangles and LODs are also queryable on supported asset types. Hover over any asset to inspect what attributes are exposed, and use the autocomplete in the search bar to discover what is available without leaving the editor.',
    },
  ],
}
