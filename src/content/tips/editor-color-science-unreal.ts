import type { Tip } from '@/lib/types'

export const tip: Tip = {
  slug: 'color-science-unreal-engine',
  title: 'Color Science Fundamentals in Unreal Engine',
  category: 'editor',
  summary:
    'Understanding color spaces, tone mapping, and test patterns is essential for validating visual fidelity in Unreal Engine. Use calibrated test patterns and the colour-science library to catch rendering regressions early.',
  tags: ['color-science', 'color-space', 'tone-mapping', 'hdr', 'test-patterns', 'visual-validation'],
  publishedAt: '2026-03-11',
  content: [
    {
      type: 'paragraph',
      text: 'Color correctness is one of the easiest things to break and one of the hardest to catch without the right tools. Unreal Engine gives you a lot of rope with its post-processing stack (linear workflow, ACES tone mapping, LUTs, exposure), but each knob is an opportunity for a regression to slip through.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Know Your Color Pipeline',
    },
    {
      type: 'paragraph',
      text: 'UE renders internally in linear sRGB (scene-linear). The final image goes through a tone mapper (ACES by default since UE4.15) before hitting the display. Any LUT or post-process volume stacked on top further transforms those values. Confusing scene-linear with display-encoded values is the #1 source of unexpected color shifts.',
    },
    {
      type: 'list',
      items: [
        'Scene-linear: what shaders, lighting, and materials operate in',
        'Tone mapper output: perceptual, display-referred (typically sRGB/Rec.709)',
        'LUT input/output: applied after the tone mapper; operates in display space',
        'HDR output: bypasses the standard tone mapper path — validate separately',
      ],
    },
    {
      type: 'heading',
      level: 2,
      text: 'Test Patterns for Visual Validation',
    },
    {
      type: 'paragraph',
      text: 'Before trusting your eyes on final frames, load a standardised test pattern. The Murideo pattern library is a solid free resource — download charts for grayscale linearity, color gamut, contrast ratio, and sharpness.',
    },
    {
      type: 'callout',
      text: 'Download free test patterns: https://www.murideo.com/test-pattern-library.html\nImport them into UE as a Texture2D, set compression to "VectorDisplacementmap" (no lossy compression), and display via a full-screen UI or a post-process material.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Automate Color Checks with colour-science (Python)',
    },
    {
      type: 'paragraph',
      text: 'The open-source colour-science Python library gives you programmatic access to color space conversions, delta-E comparisons, chromatic adaptation, and spectral data. Pair it with screenshot diffing in your CI pipeline to catch color regressions without human review on every build.',
    },
    {
      type: 'code',
      language: 'python',
      text: `import colour
import numpy as np

# Convert a captured sRGB pixel to CIE Lab for perceptual comparison
srgb = np.array([0.91, 0.42, 0.18])
xyz  = colour.sRGB_to_XYZ(srgb)
lab  = colour.XYZ_to_Lab(xyz)

# Delta-E 2000: values < 1.0 are imperceptible to most viewers
reference_lab = np.array([58.2, 32.1, 41.7])
delta_e = colour.delta_E(lab, reference_lab, method='CIE 2000')
assert delta_e < 2.0, f"Color drift detected: dE={delta_e:.2f}"`,
    },
    {
      type: 'callout',
      text: 'Resources:\n• colour-science library — https://www.colour-science.org/\n• colour-science précis (concise reference) — https://colour-science.github.io/colour-science-precis/',
    },
    {
      type: 'heading',
      level: 2,
      text: 'QA Checklist for Color Validation',
    },
    {
      type: 'list',
      items: [
        'Verify tone mapper is set to ACES (not "None" or a custom override) unless intentional',
        'Check that no post-process volumes have accidental Gamma/Gain values > 0',
        'Confirm LUT intensity is 0 in gameplay unless the feature is explicitly enabled',
        'Run a grayscale ramp test: neutral grays should have no color cast (R=G=B)',
        'Compare HDR and SDR screenshots on the same frame — tone mapping should differ but not clip highlights differently than spec',
        'Use delta-E < 2.0 as your pass threshold for automated color regression tests',
      ],
    },
  ],
}
