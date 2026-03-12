# Publish Checklist — Tommy Lahitte Debug Vault

You are running in an epic-ralph loop. You will be re-prompted after each iteration.
Output `<promise>DONE</promise>` only when ALL checks below pass with zero issues found or fixed.
Use parallel subagents for independent work. Commit only after all checks are clean.

---

## Phase 0 — Orientation

Before doing anything, study:
- `src/app/sitemap.ts` — how the sitemap is generated (auto from getAllTips + getAllPosts)
- `src/lib/types.ts` and `src/lib/blog-types.ts` — the Tip and BlogPost interfaces
- `src/content/tips/index.ts` and `src/content/blog/index.ts` — all registered content
- `src/app/tips/[slug]/page.tsx` and `src/app/blog/[slug]/page.tsx` — how metadata is generated per page
- `src/app/layout.tsx` — root metadata and schema

Do not assume anything is missing or broken — verify first.

---

## Phase 1 — Sitemap Verification

Goal: confirm every registered tip and blog post is reachable in the sitemap.

1. Read `src/content/tips/index.ts` and `src/content/blog/index.ts` to get the full list of slugs.
2. Read `src/app/sitemap.ts` — verify it calls `getAllTips()` and `getAllPosts()`.
3. Cross-check: every slug in the index files must produce a URL in the sitemap output.
4. Verify `publishedAt` / `date` fields are valid ISO dates (YYYY-MM-DD), not empty or placeholder values.
5. If anything is missing or wrong: fix it. If everything is correct: note "Sitemap: OK".

---

## Phase 2 — Em Dash Scan (Prose Text Only)

Goal: zero em dashes (—) in rendered prose. Em dashes are a strong AI-writing signal and must be
replaced with natural alternatives that match the surrounding sentence rhythm.

Rules:
- SCAN: `text` fields inside `type: 'paragraph'`, `type: 'heading'`, `type: 'callout'`, and `items` arrays inside `type: 'list'`; also top-level `summary` and `excerpt` fields
- SKIP: `type: 'code'` blocks entirely
- SKIP: `slug`, `tags`, `category`, `publishedAt`, `date` fields
- REPLACE every em dash (—) with a natural alternative based on context:
  - Parenthetical aside → use parentheses: "the browser — which has no access — cannot" → "the browser (which has no access) cannot"
  - Elaboration or consequence → use a colon or period: "one result — the GPU crashed" → "one result: the GPU crashed" or split into two sentences
  - List-item label separator (e.g. "cpu: ...")  → already using a colon, leave as-is
  - Abrupt break or dramatic pause → rewrite the sentence to eliminate the pause entirely; do not replace with a comma if that reads awkwardly
- Do NOT mechanically replace every em dash with a comma — that often produces worse prose
- En-dash ranges (20–40%) are NOT em dashes; leave them untouched

Scan ALL files in `src/content/tips/` and `src/content/blog/`.
List every violation found with: file path, field type, the full sentence containing the em dash, and the proposed replacement.
Fix all violations. If zero violations: note "Em dash scan: OK".

---

## Phase 3 — SEO Audit for New Content

Goal: every page has complete, high-quality SEO metadata. No gaps, no copy-paste placeholders.

For each tip in `src/content/tips/` and each blog post in `src/content/blog/`, check:

### 3a — Required fields present and non-empty
- `title`: descriptive, ≤60 characters, no filler words
- `summary` (tips) / `description` (posts): ≤155 characters, action-oriented, includes primary keyword
- `publishedAt` / `date`: valid and not in the future
- `tags` (tips): at least 3 relevant tags
- `category` (tips): valid category value

### 3b — Title quality
- Does the title clearly communicate the content's value?
- Is the primary Unreal Engine / QA keyword present in the title or first heading?
- Is it under 60 characters? (template adds " | Tommy Lahitte Debug Vault" — check combined length ≤70)

### 3c — Summary/description quality
- Does it accurately describe what the reader will learn?
- Does it include the most important keyword naturally?
- Is it distinct from the title (not just a rephrasing)?

### 3d — Content structure (tips only)
- Does the tip have at least one `type: 'heading'` to break up the content?
- Are there code examples (`type: 'code'`) where they would genuinely help?
- Is there a callout (`type: 'callout'`) for the most important takeaway?

### 3e — Internal linking opportunities
- Review all tip titles and blog post titles across the site.
- For each new page: identify 1–3 other pages on the site that are topically related.
- If the new content mentions a concept covered in depth by an existing tip/post, suggest adding
  a reference link in prose or a "Related tips" section.
  Format as a recommendation list — do NOT auto-edit content to add links unless it is obvious.

### 3f — Schema markup
- Tips use `TechArticle` schema in `src/app/tips/[slug]/page.tsx` — verify the new tip's fields
  (`headline`, `description`, `keywords`, `datePublished`) will populate correctly.
- Blog posts: check `src/app/blog/[slug]/page.tsx` for equivalent schema coverage.

Output a report with: file, field, issue, recommended fix. Apply fixes for 3a, 3b, 3c, 3d.
For 3e, output recommendations only — do not auto-edit.

---

## Phase 4 — Final Validation & Commit

1. Run `npm run build` to confirm no TypeScript errors and the sitemap generates cleanly.
2. If the build fails: fix the error, do not commit.
3. If everything passes: commit with message format:
   `chore: publish checklist -- sitemap, em dash scan, SEO audit [date]`
4. Output the final summary:
   - Sitemap: OK / FIXED (what changed)
   - Em dash scan: OK / FIXED (how many violations, which files, replacements used)
   - SEO audit: OK / FIXED (fields updated) + Recommendations (internal links)
5. Output `<promise>DONE</promise>`

---

## Guardrails

999: Never modify `type: 'code'` block content. Technical accuracy in code examples is non-negotiable.

9999: Never rewrite the meaning of a tip's prose. Only fix em dashes and SEO fields. Do not paraphrase, summarize differently, or change the technical substance. The replacement sentence must convey exactly the same information.

99999: Do not replace an em dash with another em dash or with a comma if it reads awkwardly. If no clean natural replacement exists, split the sentence into two.

999999: Do not change `slug` values — they are live URLs and changing them breaks inbound links.

9999999: Build must pass before committing. Never skip `npm run build`.
