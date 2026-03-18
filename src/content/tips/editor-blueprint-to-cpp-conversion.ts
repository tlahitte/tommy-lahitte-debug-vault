import type { Tip } from '@/lib/types'

export const tip: Tip = {
  slug: 'editor-blueprint-to-cpp-conversion',
  title: 'Add C++ to a Blueprint-Only Unreal Project Manually',
  category: 'editor',
  summary:
    'Blueprint-only projects have no Source folder, no module definition, and no build targets. This tip covers the complete manual setup for UE5, the same steps the editor wizard runs silently when you click "Add New C++ Class".',
  tags: ['c++', 'blueprint', 'visual-studio', 'build', 'module', 'setup', 'ue5'],
  publishedAt: '2026-03-18',
  content: [
    {
      type: 'callout',
      text: 'This guide targets Unreal Engine 5 (Launcher/installed build). Most failed manual conversions miss either the .Build.cs file or the .uproject module entry, both are required.',
    },
    {
      type: 'overview',
      items: [
        'Tell Unreal a C++ module exists by updating the .uproject file',
        'Create the Source folder with the module definition and build target files so the compiler knows how to build your code',
        'Write your first C++ class',
        'Generate the Visual Studio solution and compile',
        'The editor will pick up your new class automatically on the next launch',
      ],
      itemLinks: [
        '#step-1',
        '#step-2',
        '#step-2',
        '#step-3',
        null,
      ],
      itemLinkLabels: [
        'Step 1',
        'Step 2',
        'Step 2',
        'Step 3',
        null,
      ],
    },
    {
      type: 'heading',
      level: 2,
      text: 'Step 1: Update the .uproject File',
      id: 'step-1',
    },
    {
      type: 'paragraph',
      text: 'Open [ProjectName].uproject in a text editor and add a Modules array. Without it, UBT ignores your Source folder entirely.',
    },
    {
      type: 'code',
      language: 'json',
      text: `"Modules": [
  {
    "Name": "MyProject",
    "Type": "Runtime",
    "LoadingPhase": "Default"
  }
]`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Step 2: Create the Source Folder Structure',
      id: 'step-2',
    },
    {
      type: 'paragraph',
      text: 'Four files are required. Create them under your project root:',
    },
    {
      type: 'code',
      language: 'bash',
      text: `MyProject/
├── Source/
│   ├── MyProject.Target.cs
│   ├── MyProjectEditor.Target.cs
│   └── MyProject/
│       ├── MyProject.Build.cs
│       ├── MyFirstClass.h
│       └── MyFirstClass.cpp`,
    },
    {
      type: 'heading',
      level: 3,
      text: 'MyProject.Build.cs',
    },
    {
      type: 'code',
      language: 'csharp',
      text: `using UnrealBuildTool;

public class MyProject : ModuleRules
{
    public MyProject(ReadOnlyTargetRules Target) : base(Target)
    {
        // Use explicit or shared precompiled headers for faster compile times
        PCHUsage = PCHUsageMode.UseExplicitOrSharedPCHs;

        // Minimum required engine modules for any Unreal C++ project
        PublicDependencyModuleNames.AddRange(new string[]
        {
            "Core",        // Core Unreal types (FString, TArray, etc.)
            "CoreUObject", // UObject reflection system
            "Engine",      // AActor, UActorComponent, and the game framework
            "InputCore"    // Keyboard/mouse/gamepad input support
        });
    }
}`,
    },
    {
      type: 'heading',
      level: 3,
      text: 'MyProject.Target.cs',
    },
    {
      type: 'code',
      language: 'csharp',
      text: `using UnrealBuildTool;

// Defines the standalone game build target (packaged game, not the editor)
public class MyProjectTarget : TargetRules
{
    public MyProjectTarget(TargetInfo Target) : base(Target)
    {
        Type = TargetType.Game;                                    // Produces a runnable game executable
        DefaultBuildSettings = BuildSettingsVersion.V5;            // Use UE5 default build settings
        IncludeOrderVersion = EngineIncludeOrderVersion.Latest;    // Use the latest engine include ordering
        ExtraModuleNames.Add("MyProject");                         // Register our game module with UBT
    }
}`,
    },
    {
      type: 'heading',
      level: 3,
      text: 'MyProjectEditor.Target.cs',
    },
    {
      type: 'code',
      language: 'csharp',
      text: `using UnrealBuildTool;

// Defines the editor build target (what runs when you launch the Unreal Editor)
public class MyProjectEditorTarget : TargetRules
{
    public MyProjectEditorTarget(TargetInfo Target) : base(Target)
    {
        Type = TargetType.Editor;                                  // Produces the editor executable
        DefaultBuildSettings = BuildSettingsVersion.V5;            // Use UE5 default build settings
        IncludeOrderVersion = EngineIncludeOrderVersion.Latest;    // Use the latest engine include ordering
        ExtraModuleNames.Add("MyProject");                         // Register our game module with UBT
    }
}`,
    },
    {
      type: 'heading',
      level: 3,
      text: 'MyFirstClass.h',
    },
    {
      type: 'code',
      language: 'cpp',
      text: `#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "MyFirstClass.generated.h" // Required for Unreal's reflection system (UCLASS, UPROPERTY, etc.)

UCLASS() // Exposes this class to Unreal's reflection and Blueprint system
class MYPROJECT_API AMyFirstClass : public AActor // MYPROJECT_API handles DLL export/import on Windows
{
    GENERATED_BODY() // Inserts Unreal-generated boilerplate (required in every UCLASS)

public:
    AMyFirstClass(); // Constructor, used to set default values

protected:
    virtual void BeginPlay() override; // Called once when the actor enters the world

public:
    virtual void Tick(float DeltaTime) override; // Called every frame
};`,
    },
    {
      type: 'heading',
      level: 3,
      text: 'MyFirstClass.cpp',
    },
    {
      type: 'code',
      language: 'cpp',
      text: `#include "MyFirstClass.h"

AMyFirstClass::AMyFirstClass()
{
    // Allow Tick() to be called every frame; disable if not needed for better performance
    PrimaryActorTick.bCanEverTick = true;
}

void AMyFirstClass::BeginPlay()
{
    Super::BeginPlay(); // Always call Super to preserve parent class behavior
}

void AMyFirstClass::Tick(float DeltaTime)
{
    Super::Tick(DeltaTime); // Always call Super to preserve parent class behavior
}`,
    },
    {
      type: 'callout',
      text: 'The API macro in the header (MYPROJECT_API) must match your project name in FULL CAPS followed by _API. All filenames and class names used here are examples, replace "MyProject" with your actual project name throughout.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Step 3: Generate Project Files and Build',
      id: 'step-3',
    },
    {
      type: 'paragraph',
      text: 'Right-click the .uproject file in Explorer and select Generate Visual Studio project files. Then open the generated .sln, set the configuration to Development Editor / Win64, and run Build > Build Solution (Ctrl+Shift+B).',
    },
    {
      type: 'paragraph',
      text: 'Once the build succeeds, launch the editor. Your class will appear in the Content Browser under C++ Classes, and your existing Blueprints remain untouched.',
    },
  ],
}
