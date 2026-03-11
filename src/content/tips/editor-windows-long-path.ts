import type { Tip } from '@/lib/types'

export const tip: Tip = {
  slug: 'fix-windows-long-file-path-limitation',
  title: 'Fix Windows Long File Path Errors in Unreal Projects',
  category: 'editor',
  summary:
    'Windows enforces a 260-character path limit by default. Unreal projects, especially with nested content folders, frequently exceed this. A one-line registry change and an Editor Preferences toggle permanently resolve MAX_PATH errors.',
  tags: ['windows', 'path', 'registry', 'setup', 'editor'],
  publishedAt: '2024-01-25',
  content: [
    {
      type: 'paragraph',
      text: "If you're seeing errors like \"The system cannot find the path specified\" or file operations silently failing on deeply nested Unreal content, the Windows long path limit is almost certainly the cause.",
    },
    {
      type: 'heading',
      level: 2,
      text: 'Step 1: Enable Long Paths in Windows',
    },
    {
      type: 'paragraph',
      text: 'Run this command in PowerShell as Administrator:',
    },
    {
      type: 'code',
      language: 'powershell',
      text: `New-ItemProperty -Path "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\FileSystem" \`
  -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force`,
    },
    {
      type: 'callout',
      text: 'A reboot is required for this registry change to take effect system-wide.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Step 2: Enable Long Paths in Unreal Editor',
    },
    {
      type: 'list',
      items: [
        'Open Edit → Editor Preferences',
        'Search for "long paths" or navigate to General → Loading & Saving',
        'Enable "Enable Long Paths Support"',
      ],
    },
    {
      type: 'heading',
      level: 2,
      text: 'Why This Keeps Coming Up',
    },
    {
      type: 'list',
      items: [
        'Unreal content paths include the full OS path + /Content/ + nested folders',
        'Asset names that are descriptive tend to be long',
        'Plugin content adds extra depth to the path',
        'Working from a deep workspace path (e.g., D:\\P4V\\StreamName\\Project\\...) compounds the issue',
      ],
    },
    {
      type: 'paragraph',
      text: 'This is one of the first things to configure on a new Windows workstation used for Unreal development. It prevents a whole class of confusing build and cook errors.',
    },
  ],
}
