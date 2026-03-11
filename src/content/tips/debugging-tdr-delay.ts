import type { Tip } from '@/lib/types'

export const tip: Tip = {
  slug: 'increase-gpu-tdr-delay-for-unreal',
  title: 'Increase the GPU TDR Delay for Long Render Operations',
  category: 'debugging',
  summary:
    'Windows kills the GPU after 2 seconds of no response by default (TDR). Unreal operations like heavy shader compilation or DDC filling can easily exceed that. A quick registry edit raises the limit and prevents spurious GPU resets.',
  tags: ['gpu', 'tdr', 'windows', 'registry', 'shader', 'performance'],
  publishedAt: '2024-02-15',
  content: [
    {
      type: 'paragraph',
      text: 'TDR (Timeout Detection and Recovery) is a Windows watchdog that resets the GPU if it stops responding for too long. The default timeout is 2 seconds, which Unreal can blow past during heavy operations. The fix is a one-time registry edit.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Apply the Fix',
    },
    {
      type: 'paragraph',
      text: 'Open PowerShell as Administrator and run these two commands:',
    },
    {
      type: 'code',
      language: 'powershell',
      text: `reg add HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers /t REG_DWORD /v TdrDelay /d 60 /f`,
    },
    {
      type: 'code',
      language: 'powershell',
      text: `reg add HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers /t REG_DWORD /v TdrDdiDelay /d 60 /f`,
    },
    {
      type: 'callout',
      text: 'Reboot the machine after applying these changes for them to take effect.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'What Each Key Does',
    },
    {
      type: 'list',
      items: [
        'TdrDelay: seconds the OS waits before detecting a GPU hang (default: 2, set to 60)',
        'TdrDdiDelay: seconds for DDI calls specifically (default: 5, set to 60)',
      ],
    },
    {
      type: 'heading',
      level: 2,
      text: 'When This Helps',
    },
    {
      type: 'list',
      items: [
        'Shader compilation causing intermittent black screens',
        'DDC filling operations triggering GPU resets',
        'nDisplay launch sequences that stress the GPU on startup',
        '"Display driver stopped responding and has recovered" errors in Event Viewer',
      ],
    },
    {
      type: 'paragraph',
      text: 'Setting the value to 60 is a good balance that prevents false-positive TDR events while still catching genuine hangs. On dedicated render nodes, some teams set it even higher (120+).',
    },
  ],
}
