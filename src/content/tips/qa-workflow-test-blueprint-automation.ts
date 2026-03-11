import type { Tip } from '@/lib/types'

export const tip: Tip = {
  slug: 'automating-qa-checks-with-functional-tests',
  title: 'Automating QA Checks with Functional Tests',
  category: 'qa-workflow',
  summary:
    "Unreal's Functional Testing framework lets you write repeatable, CI-friendly test maps that verify gameplay logic, performance budgets, and visual correctness automatically.",
  tags: ['functional-tests', 'automation', 'ci', 'gauntlet', 'qa'],
  publishedAt: '2024-02-01',
  content: [
    {
      type: 'paragraph',
      text: 'Manual regression sweeps are slow and error-prone. Unreal\'s Functional Testing framework (built on top of the Automation Test framework) gives you a way to encode QA acceptance criteria directly into test Blueprints or C++ actors that run headlessly in CI.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Setting Up a Functional Test',
    },
    {
      type: 'list',
      items: [
        'Create a new Level dedicated to testing — keep it minimal',
        'Add an AFunctionalTest (or Blueprint subclass) actor to the level',
        'Override the StartTest event and implement your assertions',
        'Call FinishTest(Success) or FinishTest(Failed, "reason") when done',
        'Add the level to your Gauntlet test suite for CI execution',
      ],
    },
    {
      type: 'heading',
      level: 2,
      text: 'Running via Commandline',
    },
    {
      type: 'code',
      language: 'bash',
      text: `# Run all functional tests headlessly
UnrealEditor-Cmd.exe MyProject.uproject \\
  -ExecCmds="Automation RunTests FunctionalTests" \\
  -NullRHI -nosplash -unattended -log`,
    },
    {
      type: 'callout',
      text: 'Tip: Use -NullRHI for pure logic tests — it skips GPU init and cuts run time significantly on CI agents.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'What to Test',
    },
    {
      type: 'list',
      items: [
        'Spawn/despawn actors and verify counts',
        'Trigger gameplay events and assert state transitions',
        'Screenshot comparisons for visual regression',
        'Performance: assert frame budget with UE\'s stat system',
        'Navigation mesh coverage and pathfinding validity',
      ],
    },
  ],
}
