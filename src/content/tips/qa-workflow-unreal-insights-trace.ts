import type { Tip } from '@/lib/types'

export const tip: Tip = {
  slug: 'unreal-insights-trace-arguments',
  title: 'Capture Unreal Insights Traces with the Right Arguments',
  category: 'qa-workflow',
  summary:
    'Unreal Insights trace files give you a frame-by-frame breakdown of CPU, GPU, task graph, rendering commands, and more. The right combination of -trace= channels makes the difference between a useful trace and an overwhelming one.',
  tags: ['unreal-insights', 'trace', 'profiling', 'performance', 'switchboard'],
  publishedAt: '2024-02-25',
  content: [
    {
      type: 'paragraph',
      text: 'When reproducing a performance regression or investigating a frame hitch, capturing a good Unreal Insights trace is the first step. The -trace= channels you choose determine what data is captured.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Basic Trace Capture',
    },
    {
      type: 'code',
      language: 'bash',
      text: `-tracefile="C:\\Logs\\MySession.utrace" -trace="default,concert,messaging,tasks" -statnamedevents`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Extended Trace for Rendering Analysis',
    },
    {
      type: 'code',
      language: 'bash',
      text: `-statnamedevents -trace=cpu,gpu,frame,log,task -tracefile=D:\\logs\\session.utrace`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Full Rendering Pipeline Trace',
    },
    {
      type: 'code',
      language: 'bash',
      text: `-trace=log,cpu,gpu,frame,bookmark,concert,messaging,task,rendercommands,rhicommands,rdg`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Channels Reference',
    },
    {
      type: 'list',
      items: [
        'cpu: CPU thread activity and named scopes',
        'gpu: GPU timing per pass',
        'frame: frame boundaries and frame time',
        'log: log messages correlated to timeline',
        'task: Task Graph worker activity',
        'rendercommands: high level render command queue',
        'rhicommands: low-level RHI command timing',
        'rdg: Render Dependency Graph pass execution',
        'bookmark: named event markers you add in code',
        'concert: Multi-User session events (for nDisplay debugging)',
      ],
    },
    {
      type: 'heading',
      level: 2,
      text: 'Enabling Trace at Runtime',
    },
    {
      type: 'paragraph',
      text: 'You can also start/stop a trace from the console without a launch argument:',
    },
    {
      type: 'code',
      language: 'bash',
      text: `trace.Enable cpu,gpu,frame,log,task    // Start capturing
trace.Disable                           // Stop capturing`,
    },
    {
      type: 'callout',
      text: 'The -statnamedevents flag emits named stat scopes as bookmarks, which makes it much easier to correlate code paths with timeline spikes in Unreal Insights.',
    },
  ],
}
