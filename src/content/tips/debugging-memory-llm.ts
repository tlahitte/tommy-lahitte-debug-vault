import type { Tip } from '@/lib/types'

export const tip: Tip = {
  slug: 'profiling-memory-with-llm',
  title: 'Profile Memory Usage by Category with LLM',
  category: 'debugging',
  summary:
    "Unreal's Low Level Memory Tracker (LLM) breaks down live memory consumption by stat group: textures, meshes, audio, RHI, and more. Two commands and a launch flag give you a live memory readout in the viewport.",
  tags: ['memory', 'llm', 'profiling', 'performance', 'stat'],
  publishedAt: '2024-02-20',
  content: [
    {
      type: 'paragraph',
      text: 'When a build is consuming too much memory and you need to know where it is going, stat LLMFULL gives you the breakdown by category live in the viewport.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Setup',
    },
    {
      type: 'paragraph',
      text: 'Add -LLM to your launch arguments to enable the tracker:',
    },
    {
      type: 'code',
      language: 'bash',
      text: `UnrealEditor.exe YourProject.uproject -LLM`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Console Commands',
    },
    {
      type: 'code',
      language: 'bash',
      text: `stat LLM        // High-level categories (textures, meshes, audio…)
stat LLMFULL    // Full breakdown with sub-categories`,
    },
    {
      type: 'callout',
      text: 'Run stat LLMFULL in the Unreal console (backtick key) while the game is running to get the live on-screen overlay.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Key Categories to Watch',
    },
    {
      type: 'list',
      items: [
        'Textures: often the biggest consumer; check streaming settings if high',
        'RHI: GPU resource allocations mirrored on CPU',
        'Meshes: static and skeletal mesh vertex/index data',
        'Audio: decoded audio buffers kept in memory',
        'UObject: Blueprint and asset object overhead',
        'EngineMisc: catch-all; worth drilling into if unexpectedly large',
      ],
    },
    {
      type: 'heading',
      level: 2,
      text: 'Additional Stat Commands',
    },
    {
      type: 'code',
      language: 'bash',
      text: `stat unitgraph    // Frame timing graph
stat memory       // Simpler memory overview without LLM`,
    },
    {
      type: 'paragraph',
      text: 'LLM has a small performance overhead but is the most precise way to understand memory usage across platforms. It works in editor, PIE, and standalone game modes.',
    },
  ],
}
