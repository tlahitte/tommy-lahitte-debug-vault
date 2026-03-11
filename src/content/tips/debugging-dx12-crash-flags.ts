import type { Tip } from '@/lib/types'

export const tip: Tip = {
  slug: 'dx12-debug-launch-arguments',
  title: 'DX12 Launch Arguments for GPU Crash Debugging',
  category: 'debugging',
  summary:
    'When Unreal crashes on the GPU side with no useful callstack, two launch arguments (-d3ddebug and -gpucrashdebugging) enable the D3D validation layer and NVIDIA Aftermath/Breadcrumbs to capture the exact operation that caused the crash.',
  tags: ['dx12', 'gpu', 'crash', 'debugging', 'aftermath', 'launch-args'],
  publishedAt: '2024-01-20',
  content: [
    {
      type: 'paragraph',
      text: 'GPU crashes are notoriously hard to debug because the callstack you get is usually from the CPU side, not the actual GPU operation that failed. These two flags give you much better signal.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'The Arguments',
    },
    {
      type: 'code',
      language: 'bash',
      text: `UnrealEditor.exe MyProject.uproject -d3ddebug -gpucrashdebugging`,
    },
    {
      type: 'heading',
      level: 2,
      text: '-d3ddebug',
    },
    {
      type: 'list',
      items: [
        'Enables the D3D12 debug layer (DirectX validation)',
        'Reports invalid API usage, resource state mismatches, and barrier errors',
        'Output goes to the Visual Studio output window or DebugView',
        'Significant performance cost; use only when actively debugging',
      ],
    },
    {
      type: 'heading',
      level: 2,
      text: '-gpucrashdebugging',
    },
    {
      type: 'list',
      items: [
        'Enables GPU Breadcrumbs (all GPUs) and NVIDIA Aftermath (NVIDIA GPUs)',
        'Writes a crash dump file on TDR or GPU device removed events',
        'The dump includes the last GPU commands executed before the crash',
        'On NVIDIA hardware: generates an .nv-gpudmp file next to the crash report',
      ],
    },
    {
      type: 'callout',
      text: 'These flags can be combined freely. For a full investigation, use both together. Expect a 20–40% GPU performance hit with -d3ddebug active.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Reading the Aftermath Dump',
    },
    {
      type: 'paragraph',
      text: 'The .nv-gpudmp file can be opened with NVIDIA Nsight Graphics. It will show you the exact draw call or compute dispatch that triggered the crash, which is often a shader reading out-of-bounds or a missing resource barrier.',
    },
  ],
}
