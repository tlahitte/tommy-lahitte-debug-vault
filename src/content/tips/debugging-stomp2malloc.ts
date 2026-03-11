import type { Tip } from '@/lib/types'

export const tip: Tip = {
  slug: 'stomp2malloc-memory-corruption-debugging',
  title: 'Track Down Memory Corruption with Stomp2Malloc',
  category: 'debugging',
  summary:
    "Heap corruption bugs are some of the hardest to reproduce — they often crash far from the actual fault. Unreal's Stomp2Malloc allocator places every allocation on a guarded memory page, so use-after-free and buffer overruns crash immediately at the source.",
  tags: ['memory', 'corruption', 'stomp2malloc', 'debugging', 'heap'],
  publishedAt: '2024-03-01',
  content: [
    {
      type: 'paragraph',
      text: "If you're seeing intermittent crashes with no consistent callstack, or crashes that only happen in optimized builds, memory corruption is often the culprit. Stomp2Malloc makes those bugs deterministic.",
    },
    {
      type: 'heading',
      level: 2,
      text: 'Enabling Stomp2Malloc',
    },
    {
      type: 'code',
      language: 'bash',
      text: `UnrealEditor.exe YourProject.uproject -Stomp2Malloc`,
    },
    {
      type: 'callout',
      text: 'Use this only for targeted debugging sessions. Stomp2Malloc significantly increases memory usage and reduces performance.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'What It Catches',
    },
    {
      type: 'list',
      items: [
        'Buffer overruns — writing past the end of an allocation',
        'Buffer underruns — writing before the start of an allocation',
        'Use-after-free — accessing memory after it has been freed',
        'Double frees — calling free() on the same pointer twice',
        'Invalid memory access — reading/writing arbitrary addresses',
      ],
    },
    {
      type: 'heading',
      level: 2,
      text: 'How It Works',
    },
    {
      type: 'list',
      items: [
        'Each allocation is placed on its own virtual memory page',
        'Guard pages (inaccessible) are placed immediately before and after each allocation',
        'Any access outside the allocated region triggers an immediate access violation',
        'The crash happens at the exact offending instruction, not somewhere downstream',
      ],
    },
    {
      type: 'heading',
      level: 2,
      text: 'Practical Workflow',
    },
    {
      type: 'list',
      items: [
        'Reproduce the crash with -Stomp2Malloc to get a clean callstack',
        'The callstack will now point directly to the offending code',
        'Compare with the crash without -Stomp2Malloc to confirm it is the same bug',
        'Fix the underlying issue, then remove the flag for production runs',
      ],
    },
    {
      type: 'paragraph',
      text: 'Stomp2Malloc is particularly valuable during QA regression testing when a build starts showing flaky crashes that are hard to reproduce on demand.',
    },
  ],
}
