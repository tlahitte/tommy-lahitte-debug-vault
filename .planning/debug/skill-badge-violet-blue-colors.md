---
status: diagnosed
trigger: "Investigate a token migration regression in a Next.js site. The About Me section on the homepage has skill badges labeled Unreal Engine, Software Development, Technical Direction that still display violet and blue colors, not matching the kraft/terracotta palette."
created: 2026-03-15T00:00:00Z
updated: 2026-03-15T00:01:00Z
symptoms_prefilled: true
goal: find_root_cause_only
---

## Current Focus
<!-- OVERWRITE on each update - reflects NOW -->

hypothesis: CONFIRMED — badges array in AboutCard.tsx has hardcoded violet/blue rgba values for glow, border, and text on every badge entry
test: Read full source of AboutCard.tsx
expecting: Hardcoded rgba violet/blue color values in a JS data array, not Tailwind token classes
next_action: N/A — root cause confirmed, diagnosis complete

## Symptoms
<!-- Written during gathering, then IMMUTABLE -->

expected: Skill badges (Unreal Engine, Software Development, Technical Direction) should display kraft/terracotta palette — bg-surface-raised, text-text-muted, border-border, text-accent
actual: Badges display violet and blue colors after design system token migration
errors: Visual regression — no runtime error
reproduction: Load homepage, observe About Me / skills section
started: After token migration

## Eliminated
<!-- APPEND only - prevents re-investigating -->

- hypothesis: hardcoded Tailwind palette classes (bg-violet-*, text-blue-*) on the button element
  evidence: The button's static className uses only semantic tokens (text-text-muted, bg-zinc-800/60, border-zinc-700/50). The color leak comes from the JS data array and CSS custom properties, not from Tailwind class names on the element.
  timestamp: 2026-03-15T00:01:00Z

## Evidence
<!-- APPEND only - facts discovered -->

- timestamp: 2026-03-15T00:01:00Z
  checked: src/components/home/AboutCard.tsx — full file
  found: |
    Lines 5–54 define a `badges` array. Each entry carries three hardcoded color values:
      - `glow`:   raw rgba violet/blue string (e.g. "rgba(139,92,246,0.6)" for Unreal Engine)
      - `border`: raw rgba violet/blue string (e.g. "rgba(139,92,246,0.7)")
      - `text`:   raw rgb violet/blue string   (e.g. "rgb(196,181,253)")
    Lines 145–154: the badge <button> receives `style` prop that injects these as CSS custom properties:
      --badge-glow, --badge-border, --badge-text
    Lines 170–175: the description panel div uses `panel.border` and `panel.glow` directly in an inline `style` prop for borderColor and backgroundColor.
    globals.css lines 33–40: .badge-glow:hover rule reads --badge-glow / --badge-border / --badge-text to apply box-shadow, border-color, and text color on hover.
  implication: Every color in the badges (resting border via bg-zinc-800/60 + border-zinc-700/50, hover glow, hover text, panel border, panel background) originates from the raw rgba values in the badges array. These were never updated during the token migration.

- timestamp: 2026-03-15T00:01:00Z
  checked: tailwind.config.ts and src/app/globals.css
  found: |
    The kraft token system is fully defined in CSS custom properties:
      --accent: #C85A3A, --border: #E2D9CE, --surface-raised: #F0EBE0,
      --text-muted: #7A6F68, --text-primary: #1A1816
    All semantic token classes (text-accent, border-border, bg-surface-raised, etc.) correctly resolve to kraft values.
    The badges array in AboutCard.tsx bypasses this token system entirely with hardcoded rgba.
  implication: The fix lives entirely in the badges array — no CSS or Tailwind config changes needed.

## Resolution
<!-- OVERWRITE as understanding evolves -->

root_cause: |
  The `badges` constant in `src/components/home/AboutCard.tsx` (lines 5–54) stores per-badge
  color values as raw rgba/rgb strings for violet and blue hues. These strings are injected as
  CSS custom properties (--badge-glow, --badge-border, --badge-text) via inline `style` on each
  badge button (line 150), and also applied directly as inline `style` on the description panel
  (lines 171–174). The .badge-glow:hover CSS rule in globals.css consumes these custom properties
  to paint box-shadow, border, and text color. Because the token migration updated CSS variables
  and Tailwind config but did not touch this JS data array, all badge colors remain the original
  violet/blue values.

fix: N/A — diagnose only
verification: N/A — diagnose only
files_changed: []
