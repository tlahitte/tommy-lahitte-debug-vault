import type { Tip } from '@/lib/types'

export const tip: Tip = {
  slug: 'perforce-cli-essentials-for-unreal-qa',
  title: 'Perforce CLI Essentials for Unreal QA',
  category: 'qa-workflow',
  summary:
    'When the P4V GUI is slow or unavailable, the p4 command line gets the job done fast. These are the commands you reach for most often when managing workspaces, switching users, and troubleshooting sync issues.',
  tags: ['perforce', 'p4', 'source-control', 'command-line', 'workspace'],
  publishedAt: '2024-01-30',
  content: [
    {
      type: 'paragraph',
      text: 'QA workflows often involve switching between multiple workspaces and users. The p4 CLI is faster than P4V for these operations and works over SSH on headless machines.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Auth & Identity',
    },
    {
      type: 'code',
      language: 'bash',
      text: `p4 logout                          # Clear current credentials
p4 -u <username> login             # Log in as a specific user
p4 set P4USER=<username>           # Set default user for this session
p4 set P4CLIENT=<workspace_name>   # Set active workspace
p4 set P4PORT=ssl:perforce.example.com:1666  # Set server address
p4 info                            # Verify current connection and workspace`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Workspace Operations',
    },
    {
      type: 'code',
      language: 'bash',
      text: `p4 workspace                       # Open workspace spec in editor
p4 reload -c <workspaceName>       # Reload workspace metadata from server`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Cherry-picking with UShell',
    },
    {
      type: 'paragraph',
      text: 'UShell (enabled in UnrealGameSync) provides a p4 cherry-pick workflow:',
    },
    {
      type: 'list',
      items: [
        'Switch to the stream you want to cherry-pick into',
        'Enable UShell in UGS settings',
        'Type: .p4 cherrypick <CL#>',
        'Make sure no affected files are checked out before running',
        'Use r to reconcile in P4, then select all and Resolve',
        'Choose Source or Target depending on which version you want',
        'Unshelve the generated CL, review, then submit',
      ],
    },
    {
      type: 'callout',
      text: 'Always run p4 info first when debugging workspace issues — it confirms which server, user, and workspace are actually active.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Finding P4 Settings',
    },
    {
      type: 'code',
      language: 'bash',
      text: `p4 set                             # List all current p4 environment variables`,
    },
  ],
}
