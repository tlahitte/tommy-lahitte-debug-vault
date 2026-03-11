import type { Tip } from '@/lib/types'

export const tip: Tip = {
  slug: 'restart-graphics-driver-without-rebooting',
  title: 'Restart Your Graphics Driver Without Rebooting',
  category: 'debugging',
  summary:
    'When Unreal hangs your GPU or your display goes black, you can recover in seconds — no reboot needed. The Windows keyboard shortcut Win+Ctrl+Shift+B restarts the graphics driver on the fly.',
  tags: ['gpu', 'graphics-driver', 'windows', 'crash-recovery'],
  publishedAt: '2024-02-10',
  content: [
    {
      type: 'paragraph',
      text: 'Working with Unreal — especially in nDisplay or with heavy shader compilation — can occasionally lock up the GPU. Before reaching for the power button, try the built-in Windows recovery shortcut.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'The Shortcut',
    },
    {
      type: 'callout',
      text: 'Win + Ctrl + Shift + B — the screen briefly flickers and you hear a beep. Everything recovers immediately.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'What It Does',
    },
    {
      type: 'list',
      items: [
        'Signals Windows to reset the GPU driver stack (WDDM reset)',
        'The display goes black for ~1 second, then returns to normal',
        'Running applications are not killed — Unreal Editor stays open',
        'Safe to use repeatedly; no known side effects',
      ],
    },
    {
      type: 'heading',
      level: 2,
      text: 'When to Use It',
    },
    {
      type: 'list',
      items: [
        'Display goes black or freezes after a GPU crash in Unreal',
        'Artifacts appear on screen after a TDR (Timeout Detection and Recovery) event',
        'Driver gets into a bad state after a shader compile spike',
        'Any time the display is unresponsive but the machine is still running',
      ],
    },
    {
      type: 'paragraph',
      text: 'This trick has saved me from a full reboot more times than I can count during nDisplay testing sessions. It works on all Windows 10/11 machines regardless of GPU vendor.',
    },
  ],
}
