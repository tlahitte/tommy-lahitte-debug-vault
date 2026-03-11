import type { Tip } from '@/lib/types'

export const tip: Tip = {
  slug: 'control-log-verbosity-per-category',
  title: 'Control Log Verbosity Per Category at Launch',
  category: 'debugging',
  summary:
    'Drowning in log noise or missing critical messages? The -LogCmds launch argument lets you set verbosity per log category without recompiling — from silencing entire subsystems to enabling Verbose output for one specific category.',
  tags: ['logging', 'verbosity', 'launch-args', 'debugging', 'logcmds'],
  publishedAt: '2024-03-08',
  content: [
    {
      type: 'paragraph',
      text: "Unreal's log system has hundreds of categories, each with its own verbosity level. The -LogCmds argument overrides them at launch, which is much faster than editing DefaultEngine.ini or recompiling.",
    },
    {
      type: 'heading',
      level: 2,
      text: 'Syntax',
    },
    {
      type: 'code',
      language: 'bash',
      text: `-LogCmds="LogCategoryName Verbosity, AnotherCategory Verbosity"`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Practical Examples',
    },
    {
      type: 'code',
      language: 'bash',
      text: `# Enable verbose for Level Snapshots
-LogCmds="LogLevelSnapshots Verbose"

# Enable verbose for media playback debugging
-LogCmds="LogImgMedia Verbose, LogElectraPlayer Verbose, LogElectraPlayerPlugin Verbose"

# Silence a noisy category
-LogCmds="LogNetDormancy NoLogging"

# Multiple categories in one argument
-LogCmds="LogLevelSnapshots Verbose, LogImgMedia Verbose, LogNetDormancy NoLogging"`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Verbosity Levels (lowest to highest)',
    },
    {
      type: 'list',
      items: [
        'NoLogging — suppress all output from this category',
        'Fatal — only fatal errors',
        'Error — errors and fatals',
        'Warning — warnings, errors, and fatals',
        'Display — important info (default for most categories)',
        'Log — general log messages',
        'Verbose — detailed trace output',
        'VeryVerbose — maximum detail (very noisy)',
      ],
    },
    {
      type: 'heading',
      level: 2,
      text: 'Setting Verbosity at Runtime',
    },
    {
      type: 'paragraph',
      text: 'You can also change verbosity live from the Unreal console without restarting:',
    },
    {
      type: 'code',
      language: 'bash',
      text: `Log LogLevelSnapshots Verbose
Log LogImgMedia VeryVerbose`,
    },
    {
      type: 'callout',
      text: 'To find the correct category name, search the source code for DEFINE_LOG_CATEGORY or look at existing log output — the category name appears in brackets before each message.',
    },
  ],
}
