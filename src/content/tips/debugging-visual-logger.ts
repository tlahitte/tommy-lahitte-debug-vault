import type { Tip } from '@/lib/types'

export const tip: Tip = {
  slug: 'debugging-with-the-visual-logger',
  title: 'Debugging with the Visual Logger',
  category: 'debugging',
  summary:
    'The Unreal Engine Visual Logger (VLog) lets you record and replay structured runtime data (positions, AI states, sphere traces) frame by frame without a single breakpoint.',
  tags: ['visual-logger', 'vlog', 'runtime-debugging', 'ai', 'traces'],
  publishedAt: '2024-01-15',
  content: [
    {
      type: 'paragraph',
      text: 'The Visual Logger is one of the most underused tools in an Unreal developer\'s toolkit. Instead of littering your code with DrawDebugSpheres that disappear the moment you pause, VLog records structured data that you can scrub through long after the session ends.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Enabling the Visual Logger',
    },
    {
      type: 'code',
      language: 'cpp',
      text: `// Add to your Build.cs
PrivateDependencyModuleNames.Add("AIModule");

// In code, log anything:
UE_VLOG_LOCATION(this, LogAI, Verbose, GetActorLocation(), 20.f, FColor::Red, TEXT("Target spotted"));
UE_VLOG_SEGMENT(this, LogAI, Log, StartPos, EndPos, FColor::Green, TEXT("Path segment"));`,
    },
    {
      type: 'callout',
      text: 'Open the Visual Logger via: Window → Visual Logger (or run command: VisualLogger)',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Key Workflow',
    },
    {
      type: 'list',
      items: [
        'Press Record before your test scenario starts',
        'Reproduce the bug; the logger captures every VLog call with timestamps',
        'Stop recording, then scrub the timeline to the exact frame of interest',
        'All recorded actors are listed in the left panel with their logged events',
        'Use categories/verbosity filters to cut through noise',
      ],
    },
    {
      type: 'paragraph',
      text: 'For QA, this is invaluable: you can hand a .vlog file to a programmer as a perfect reproduction artifact with spatial context intact.',
    },
  ],
}
