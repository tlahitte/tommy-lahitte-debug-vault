import type { Tip } from '@/lib/types'

export const tip: Tip = {
  slug: 'speed-up-builds-with-unreal-build-accelerator',
  title: 'Speed Up Builds with Unreal Build Accelerator (UBA)',
  category: 'editor',
  summary:
    'UBA distributes compilation tasks across a Horde cluster, dramatically reducing full rebuild times. Enabling it is a single XML config change, no code modifications required.',
  tags: ['build', 'uba', 'horde', 'compilation', 'performance', 'distributed'],
  publishedAt: '2024-03-05',
  content: [
    {
      type: 'paragraph',
      text: 'Unreal Build Accelerator (UBA) offloads C++ compilation to a Horde cluster. For large projects, it can cut full rebuild times from hours to minutes by parallelizing across many remote machines.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Enable UBA',
    },
    {
      type: 'paragraph',
      text: 'Create or edit the BuildConfiguration.xml file at this path:',
    },
    {
      type: 'code',
      language: 'bash',
      text: `%APPDATA%\\Unreal Engine\\UnrealBuildTool\\BuildConfiguration.xml`,
    },
    {
      type: 'code',
      language: 'xml',
      text: `<?xml version="1.0" encoding="utf-8" ?>
<Configuration xmlns="https://www.unrealengine.com/BuildConfiguration">
  <BuildConfiguration>
    <bAllowUBAExecutor>true</bAllowUBAExecutor>
  </BuildConfiguration>
  <Horde>
    <Server>https://your-horde-server.example.com</Server>
    <ConnectionMode>relay</ConnectionMode>
    <Cluster>_auto</Cluster>
  </Horde>
</Configuration>`,
    },
    {
      type: 'callout',
      text: 'You must have access to a Horde server and be on the correct network/VPN for the remote execution to work. Local compilation still works if the cluster is unreachable.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'How It Works',
    },
    {
      type: 'list',
      items: [
        'UBA intercepts UnrealBuildTool compile jobs and dispatches them to idle Horde agents',
        'The relay connection mode routes traffic through the Horde server (no direct agent access needed)',
        '_auto cluster selection picks the best available cluster automatically',
        'Falls back to local compilation transparently if the cluster is unavailable',
      ],
    },
    {
      type: 'heading',
      level: 2,
      text: 'Verifying It Is Working',
    },
    {
      type: 'paragraph',
      text: 'Start a build and watch the UnrealBuildTool output. You should see lines indicating remote compilation tasks being dispatched. The total compile time will be significantly lower than local-only.',
    },
  ],
}
