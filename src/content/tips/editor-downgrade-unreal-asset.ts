import type { Tip } from '@/lib/types'

export const tip: Tip = {
  slug: 'downgrade-unreal-engine-asset',
  title: 'Downgrading a Unreal Engine Asset to an Older Version',
  category: 'editor',
  summary:
    'Accidentally re-saved assets in a newer engine version? You can hex-edit the custom version numbers stored in the .uasset header to trick an older engine into loading them — as a last resort.',
  tags: ['asset', 'downgrade', 'version', 'hex-editor', 'uasset', 'custom-version', 'migration'],
  publishedAt: '2026-03-11',
  content: [
    {
      type: 'callout',
      text: 'DISCLAIMER: Always back up your assets before attempting this. This is a last resort — it can permanently destroy assets if the serialized representation changed significantly between versions.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'The Problem',
    },
    {
      type: 'paragraph',
      text: 'You updated your project to a newer engine version, resaved some assets, then needed to roll back. Trying to open those assets in the older engine gives you errors like:',
    },
    {
      type: 'code',
      language: 'text',
      text: `LogAssetRegistry: Error: Package E:/Unreal projects/Test_426/Content/BlenderCube.uasset has newer custom version of Dev-Rendering`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Why It Happens',
    },
    {
      type: 'paragraph',
      text: 'Every .uasset stores a list of "custom version" entries in its header — each is a GUID identifying a subsystem (e.g. Dev-Rendering, FortniteMain) paired with an integer tracking how many serialization-breaking changes that subsystem has had. When the engine loads an asset, it compares those integers against its own. A higher value in the file means the asset was written by a newer engine that may have changed the on-disk format — so the load is aborted.',
    },
    {
      type: 'paragraph',
      text: 'These GUIDs and version integers are stored uncompressed in the file header (a serialized FPackageFileSummary), which means you can find and edit them directly.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Manual Fix: Hex Editor',
    },
    {
      type: 'paragraph',
      text: 'Open the .uasset in a hex editor and search for the GUID of the failing custom version. GUIDs are stored little-endian — each 4-byte group has its bytes reversed. For example, Dev-Rendering has GUID (0x12F88B9F, 0x88754AFC, 0xA67CD90C, 0x383ABD29), which appears on disk as:',
    },
    {
      type: 'code',
      language: 'text',
      text: `Source GUID group:  12 F8 8B 9F  88 75 4A FC  A6 7C D9 0C  38 3A BD 29
On disk (LE):       9F 8B F8 12  FC 4A 75 88  0C D9 7C A6  29 BD 3A 38`,
    },
    {
      type: 'paragraph',
      text: 'The 4-byte little-endian integer immediately following the GUID is the version value. Find your target engine\'s value by comparing the enum in both engine branches on GitHub (e.g. FRenderingObjectVersion in RenderingObjectVersion.h). Subtract 1 for each entry added in the newer version, then write the corrected value and save.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Faster Fix: Python Script (Daniel Coelho)',
    },
    {
      type: 'paragraph',
      text: 'Instead of doing this by hand for every custom version, iterate using the script. The workflow is:',
    },
    {
      type: 'list',
      items: [
        'Open the asset in the older engine — it will fail and print an error naming the offending custom version',
        'Run the script with that version set to -1 to probe its current value (e.g. "Read \'Dev-Rendering\' with value \'45\'")',
        'Run the script again with the target value (e.g. 44) — this overwrites the file',
        'Try opening the asset again; a new error may appear for a different custom version',
        'Repeat until the asset loads and appears in the Content Browser',
      ],
    },
    {
      type: 'code',
      language: 'python',
      text: `# Simplified sketch of the script's core loop
import struct

CUSTOM_VERSIONS = {
    # Name           GUID (as 4 uint32 values)
    'Dev-Rendering': (0x12F88B9F, 0x88754AFC, 0xA67CD90C, 0x383ABD29),
    # Add others from DevObjectVersion.cpp as needed
}

# Values to enforce: set to -1 to probe, or the target integer to downgrade
updated_values = {
    'Dev-Rendering': 44,   # was 45 in 4.27, 44 in 4.26
}

def guid_to_bytes(g):
    """Convert a GUID tuple to its little-endian on-disk representation."""
    return b''.join(struct.pack('<I', v) for v in g)

with open('BlenderCube.uasset', 'r+b') as f:
    data = bytearray(f.read())
    for name, guid in CUSTOM_VERSIONS.items():
        pattern = guid_to_bytes(guid)
        idx = data.find(pattern)
        if idx == -1:
            continue
        value_offset = idx + 16
        current = struct.unpack_from('<i', data, value_offset)[0]
        target = updated_values.get(name, -1)
        if target == -1:
            print(f"Read '{name}' with value '{current}'")
        elif current > target:
            struct.pack_into('<i', data, value_offset, target)
            print(f"Downgraded '{name}' from {current} to {target}")
    f.seek(0)
    f.write(data)`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Extra Step: Cross Major/Minor Version',
    },
    {
      type: 'paragraph',
      text: 'If you are moving assets between different major or minor versions (e.g. 4.27 → 4.26), the asset will show up in the Content Browser after the custom-version fix, but double-clicking it will produce another warning:',
    },
    {
      type: 'code',
      language: 'text',
      text: `LogLinker: Warning: Asset '...BlenderCube.uasset' has been saved with a newer engine and can't be loaded.
CurrentEngineVersion: 4.26.2-15973114+++UE4+Release-4.26
AssetEngineVersion:   4.27.0-16724560+++UE4+Release-4.27`,
    },
    {
      type: 'paragraph',
      text: 'The asset also stores its engine version metadata (major, minor, changelist, stream name). You need to patch those to match the target engine. Enable update_engine_version in the script and supply the major, minor, and changelist values you read from the error message above.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'When This Will Not Work',
    },
    {
      type: 'list',
      items: [
        'The further apart the engine versions are, the riskier — the on-disk format may have changed in ways that cannot be papered over',
        'If the asset crashes the editor on open after the version patch, the serialized layout genuinely changed; reimport the source asset instead',
        'Custom versions defined by plugins are not in DevObjectVersion.cpp — you will need to locate their GUIDs manually',
        'Once it loads, save the asset immediately so the engine re-serializes it cleanly to disk',
      ],
    },
  ],
}
