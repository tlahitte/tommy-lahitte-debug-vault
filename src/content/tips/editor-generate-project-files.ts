import type { Tip } from '@/lib/types'

export const tip: Tip = {
  slug: 'generate-visual-studio-project-files',
  title: 'Generate Visual Studio Project Files from the Command Line',
  category: 'editor',
  summary:
    'Right-clicking a .uproject in Explorer is the usual way to regenerate VS project files, but it can fail silently or use the wrong engine. The command-line approach is more reliable and works for both Launcher installs and source builds.',
  tags: ['visual-studio', 'project-files', 'build', 'command-line', 'source'],
  publishedAt: '2024-01-10',
  content: [
    {
      type: 'paragraph',
      text: 'After adding new source files, changing module dependencies, or switching engine versions, you need to regenerate project files. The command-line method gives you explicit control over which engine is used.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Source Build (Perforce / GitHub)',
    },
    {
      type: 'code',
      language: 'bash',
      text: `GenerateProjectFiles.bat -project="C:\\Path\\To\\Your\\Project.uproject" -game -engine`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Installed Build (Launcher)',
    },
    {
      type: 'paragraph',
      text: 'Windows:',
    },
    {
      type: 'code',
      language: 'bash',
      text: `Engine\\Build\\BatchFiles\\Build.bat -ProjectFiles -project="C:\\Path\\To\\Your\\Project.uproject" -game -engine`,
    },
    {
      type: 'paragraph',
      text: 'Mac:',
    },
    {
      type: 'code',
      language: 'bash',
      text: `Engine/Build/BatchFiles/Mac/Build.sh -ProjectFiles -project="/Path/To/Your/Project.uproject" -game -engine`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Flags Explained',
    },
    {
      type: 'list',
      items: [
        '-game — includes game module targets (Editor, Game, Client, Server)',
        '-engine — includes engine source in the solution (needed if you are modifying engine code)',
        '-project — absolute path to the .uproject file',
      ],
    },
    {
      type: 'callout',
      text: 'Tip: Create a batch file at the project root that calls this command. One double-click regenerates everything without needing to remember the syntax.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Associate .uproject with the Right Engine',
    },
    {
      type: 'paragraph',
      text: 'If the right-click option is broken, find UnrealVersionSelector-Win64-Shipping.exe inside Engine/Binaries/Win64 and run it. It re-registers the .uproject file association with the current engine build.',
    },
  ],
}
