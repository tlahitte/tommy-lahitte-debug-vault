import type { Tip } from '@/lib/types'

export const tip: Tip = {
  slug: 'bypass-engine-package-compatibility-check',
  title: 'Bypass Engine Package Version Compatibility Checks',
  category: 'editor',
  summary:
    'Unreal refuses to open assets saved with a different engine version by default. Two console variables in DefaultEngine.ini disable these checks, letting you open and inspect assets across engine versions without a full migration.',
  tags: ['engine-version', 'package', 'compatibility', 'assets', 'ini'],
  publishedAt: '2024-02-05',
  content: [
    {
      type: 'paragraph',
      text: 'QA workflows often require opening assets from a different engine version: comparing behavior across versions, investigating a regression, or opening a saved level from a branch you just synced. The compatibility block gets in the way.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'The Fix',
    },
    {
      type: 'paragraph',
      text: 'Add these two lines to your project\'s DefaultEngine.ini under [ConsoleVariables]:',
    },
    {
      type: 'code',
      language: 'ini',
      text: `[ConsoleVariables]
s.EnforcePackageCompatibleVersionCheck=0
s.DisablePackageCompatibleCustomVersionCheck=1`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'What Each Variable Does',
    },
    {
      type: 'list',
      items: [
        's.EnforcePackageCompatibleVersionCheck=0: disables the top-level engine version gate',
        's.DisablePackageCompatibleCustomVersionCheck=1: disables the custom version tag check inside individual packages',
      ],
    },
    {
      type: 'callout',
      text: 'Warning: Opening cross version assets can corrupt them if you save. Use this for read only inspection only, and revert any accidental saves.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Alternative: Asset Downgrade Tool',
    },
    {
      type: 'paragraph',
      text: 'For a more targeted approach that does not require ini changes, the community tool at 1danielcoelho.github.io/downgrade-unreal-asset can strip the version metadata from individual .uasset files.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Typical Use Cases',
    },
    {
      type: 'list',
      items: [
        'Opening a level from a newer engine build to inspect a regression',
        'Reviewing asset content from a different branch without a full sync',
        'Quick compatibility check before committing to a version migration',
      ],
    },
  ],
}
