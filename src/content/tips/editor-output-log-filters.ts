import type { Tip } from '@/lib/types'

export const tip: Tip = {
  slug: 'mastering-output-log-filters-in-unreal-editor',
  title: 'Mastering Output Log Filters in Unreal Editor',
  category: 'editor',
  summary:
    'The Output Log is noisy by default. Learn to use categories, verbosity levels, and custom log channels to cut through the noise and surface exactly the signal you need.',
  tags: ['output-log', 'logging', 'verbosity', 'log-categories', 'editor'],
  publishedAt: '2024-03-10',
  content: [
    {
      type: 'paragraph',
      text: 'During a busy session, the Unreal Output Log fills up at thousands of lines per second. Without a filtering strategy, important warnings disappear in the noise. Here\'s how to tame it.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Custom Log Categories',
    },
    {
      type: 'code',
      language: 'cpp',
      text: `// In your module header:
DECLARE_LOG_CATEGORY_EXTERN(LogMyFeature, Log, All);

// In your .cpp:
DEFINE_LOG_CATEGORY(LogMyFeature);

// Usage:
UE_LOG(LogMyFeature, Warning, TEXT("Unexpected state: %s"), *StateName);`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Runtime Verbosity Override',
    },
    {
      type: 'code',
      language: 'ini',
      text: `# In DefaultEngine.ini — suppress noisy categories:
[Core.Log]
LogNavigation=Error
LogAI=Warning
LogMyFeature=Verbose`,
    },
    {
      type: 'callout',
      text: 'You can also change verbosity at runtime in the Output Log filter bar — type a category name and select a verbosity level without restarting.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Output Log Filter Tips',
    },
    {
      type: 'list',
      items: [
        'Use the "Filters" dropdown to show only Warnings and Errors during test runs',
        'Right-click any line → "Copy" to grab a clean message for a Jira ticket',
        'Pin important log categories to the Quick Filter bar',
        'The "Search" box supports regex — use ^LogMyFeature to match a specific category',
        '"Clear on PIE" checkbox (Output Log settings) resets the log each test run',
      ],
    },
    {
      type: 'paragraph',
      text: 'For QA sessions, pre-configure your DefaultEngine.ini to Error-only for irrelevant systems so your custom feature log stays readable during exploratory testing.',
    },
  ],
}
