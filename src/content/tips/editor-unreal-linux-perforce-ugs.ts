import type { Tip } from '@/lib/types'

export const tip: Tip = {
  slug: 'unreal-linux-perforce-ugs',
  title: 'Setting Up Unreal Engine on Linux via Perforce and UGS CLI',
  category: 'editor',
  summary:
    'Full workflow for getting Unreal Engine running on a Linux machine from a Perforce stream: install the dev toolchain, init a UGS workspace, install Clang, build, and launch the editor.',
  tags: ['linux', 'perforce', 'ugs', 'ugs-cli', 'build', 'setup', 'clang'],
  publishedAt: '2026-03-11',
  content: [
    {
      type: 'heading',
      level: 2,
      text: 'Step 1 - Install UGS CLI',
    },
    {
      type: 'paragraph',
      text: 'UGS CLI (ugs) replaces the GUI UnrealGameSync client on Linux. Install it with a single command then verify it is on your PATH.',
    },
    {
      type: 'code',
      language: 'bash',
      text: `curl "https://your-horde-server.example.com/api/v1/tools/ugs-linux?action=download" \\
  -o ~/ugs.zip && \\
  unzip -eo ~/ugs.zip -d ~/ugs/ && \\
  ~/ugs/ugs install && \\
  source ~/.bashrc

# Verify - prints the current stream and CL
ugs version`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Step 2 - Log In to Perforce',
    },
    {
      type: 'code',
      language: 'bash',
      text: `p4 login

# Spot-check: sync a single file to confirm your workspace view is correct
p4 -c ${"`${client_name}`"} sync -q //${"`${client_name}`"}/YourProject/YourProject/*`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Step 3 - Initialise a UGS Workspace',
    },
    {
      type: 'paragraph',
      text: 'Run ugs init from the directory where you want the workspace root, passing the Perforce stream and the .uproject you want to target.',
    },
    {
      type: 'code',
      language: 'bash',
      text: `# Creates a new workspace and registers the project with UGS
ugs init //YourStream/Main \\
  -project=/YourProject/YourProject/YourProject.uproject

# Switch project if you already have an existing workspace
ugs switch YourProject/YourProject/YourProject.uproject

# Confirm workspace is wired up correctly
ugs status`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Step 4 - Install the Clang Toolchain',
    },
    {
      type: 'paragraph',
      text: 'Unreal ships a cross-platform toolchain script. Run it once after your initial sync - it downloads the exact Clang version required by the engine.',
    },
    {
      type: 'code',
      language: 'bash',
      text: `# From your workspace root
Engine/Build/BatchFiles/Linux/SetupToolchain.sh`,
    },
    {
      type: 'callout',
      text: 'If you are using AutoSDK / ushell, you can replace this step with:\n  .autosdks sync\n  .project YourProject\nThis fetches and activates the correct SDK automatically.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Step 5 - Build the Editor',
    },
    {
      type: 'paragraph',
      text: 'Use ugs build for the standard UGS-managed build, or drop down to make StandardSet for a direct Makefile build.',
    },
    {
      type: 'code',
      language: 'bash',
      text: `# Recommended: let UGS handle the build steps
ugs build

# List individual build steps if you only need a subset
ugs build -list

# Alternative: direct Makefile build from workspace root
make StandardSet`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Step 6 - Launch the Editor',
    },
    {
      type: 'code',
      language: 'bash',
      text: `# Via UGS
ugs run

# Direct binary (add -norelativemouse if the cursor behaves oddly)
./Binaries/Linux/UnrealEditor -norelativemouse`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Common UGS CLI Reference',
    },
    {
      type: 'list',
      items: [
        'ugs sync latest - sync to the latest CL',
        'ugs sync <CL> -clean - sync to a specific CL and clean the workspace',
        'ugs sync latest -build - sync then build in one command',
        'ugs filter exclude=<path> - exclude a path from future syncs',
        'ugs filter global include=<path> - apply a sync filter to all workspaces',
      ],
    },
    {
      type: 'callout',
      text: 'Permissions tip: if the build fails due to file permission errors, fix them with:\n  sudo chmod -R 777 /home/<user>/P4V/<workspace>/\nNote: .bashrc and sudo .bashrc are separate - aliases added to one are not visible to the other.',
    },
  ],
}
