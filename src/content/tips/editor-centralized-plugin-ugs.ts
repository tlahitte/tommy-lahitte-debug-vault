import type { Tip } from '@/lib/types'

export const tip: Tip = {
  slug: 'centralized-plugin-unrealgamesync',
  title: 'Sharing a Plugin Across Projects with UnrealGameSync',
  category: 'editor',
  summary:
    'Host your shared assets in a standalone plugin project, then attach it to any number of Unreal projects via two config changes - one in UnrealGameSync.ini to sync the content, one in the .uproject to expose it.',
  tags: ['plugin', 'unrealgamesync', 'ugs', 'perforce', 'content-sharing', 'virtual-production'],
  publishedAt: '2026-03-11',
  content: [
    {
      type: 'paragraph',
      text: 'When the same assets (nDisplay configs, MediaProfiles, stage presets) need to live in multiple projects, duplicating them is a maintenance nightmare. The solution is to host the plugin in its own lightweight Unreal project (not in the engine, not inside each consuming project) and wire every project to it with two config changes.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Why a Project-Level Plugin, Not an Engine Plugin',
    },
    {
      type: 'paragraph',
      text: 'Engine plugins require touching the engine directory. Every content update can trigger a full engine recompilation and risks introducing instability unrelated to your assets. Keeping the plugin in its own project lets you version and sync it independently, with faster iteration and no unwanted engine rebuilds.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Step 1 - Tell UGS to Sync the Plugin Project',
    },
    {
      type: 'paragraph',
      text: 'Add an AdditionalPathsToSync entry in the consuming project\'s UnrealGameSync.ini. UGS will then pull the plugin project from Perforce alongside your project whenever anyone syncs.',
    },
    {
      type: 'code',
      language: 'ini',
      text: `; {YourProject}/Build/UnrealGameSync.ini
[Perforce]
+AdditionalPathsToSync=/YourSharedPlugin/YourSharedPlugin/...`,
    },
    {
      type: 'callout',
      text: 'Always sync the plugin project from the same Perforce branch as your consuming project. Cross-branch asset references will fail at load time.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Step 2 - Point the .uproject at the Plugin Directory',
    },
    {
      type: 'paragraph',
      text: 'Add an AdditionalPluginDirectories entry to the consuming project\'s .uproject. Unreal will discover and load all plugins found under that path, making their content available in the Content Browser.',
    },
    {
      type: 'code',
      language: 'json',
      text: `// {YourProject}/{YourProject}.uproject
{
  "AdditionalPluginDirectories": [
    "../StageEssentials"
  ]
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Accessing the Shared Content',
    },
    {
      type: 'list',
      items: [
        'Open your project and enable Show Plugin Content in the Content Browser settings',
        'Navigate to Plugins > [YourPlugin] Content',
        'Any plugin added to the shared project is automatically available to all consumers',
      ],
    },
    {
      type: 'heading',
      level: 2,
      text: 'Key Rules for Assets in the Shared Plugin',
    },
    {
      type: 'list',
      items: [
        'Assets must be self-contained - no references to assets in the consuming project',
        'Assets cannot be migrated from newer engine branches (version is baked in at creation time)',
        'Mark new assets for Add in source control from within the plugin project, not the consumer',
      ],
    },
    {
      type: 'callout',
      text: 'Switchboard pitfall: if a Perforce changelist only touches assets inside the plugin project, Switchboard will not recognize it as a changelist for the consuming project and will skip syncing. Workaround: always include at least one file from the main project in any CL that updates shared plugin assets.',
    },
  ],
}
