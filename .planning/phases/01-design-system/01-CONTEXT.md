# Phase 1: Design System - Context

**Gathered:** 2026-03-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Établir la couche de tokens sémantiques Tailwind et refondre l'identité visuelle globale (palette, typographie, navigation, animations) avant qu'un seul composant de contenu soit écrit. Tout ce qui touche au contenu Notion, aux pages projets, ou aux nouvelles routes est hors scope.

</domain>

<decisions>
## Implementation Decisions

### Palette kraft/industrielle

- **Background principal** : `#FAFAF7` — blanc cassé chaud, très Teenage Engineering, le papier propre du labo
- **Surface secondaire** (cards, panels) : `#F0EBE0` — offset chaud subtil, s'intègre sans boites flottantes
- **Texte principal** : `#1A1816` — noir chaud légèrement brunâtre, harmonieux avec le fond chaud
- **Accent** : `#C85A3A` — rouille/terra cotta, chaud, organique, rappelle les outils et la patine
- **Texte secondaire/muted** : Claude's discretion — warm mid-gray cohérent avec la palette (ex. ~#7A6F68)
- **Border** : Claude's discretion — subtil, tirant sur le beige/sable (ex. ~#E2D9CE)

### Tokens sémantiques Tailwind (DSGN-01)

Tokens à extraire dans `tailwind.config.ts` **avant toute modification de composant** :

```
surface        → #FAFAF7   (fond principal)
surface-raised → #F0EBE0   (cards, panels)
text-primary   → #1A1816   (body, titres)
text-muted     → ~#7A6F68  (secondaire, captions, métadonnées)
accent         → #C85A3A   (liens actifs, tags, CTA)
accent-hover   → Claude's discretion (version plus sombre de l'accent)
border         → ~#E2D9CE  (séparateurs, borders de cards)
```

Les tokens doivent remplacer **toutes** les valeurs hardcodées zinc/violet dans les composants existants (Header, Footer, Tag, CodeBlock).

### Navigation

- **Ordre des liens** : Blog → Projects → About (gauche à droite après le nom)
- **Logo/identité** : "Tommy Lahitte" en texte à gauche — nom complet, pas de monogramme
- **Comportement scroll** : sticky transparent en haut → fond `surface` opaque au scroll (avec légère bordure bottom)
- **Mobile** : liens visibles et compressés directement — pas de hamburger (3 liens c'est gérable)
- **Liens phase 1** : Projects et About sont dans la nav dès maintenant même si les pages n'existent pas encore (404 ou placeholder)

### Micro-animations (DSGN-03)

- **Niveau général** : présence modérée — transitions 250-350ms, éasing naturel, les animations contribuent à la personnalité sans distraire
- **Librairie** : Framer Motion avec AnimatePresence pour les transitions de pages
- **Transitions de pages** : fade/slide via AnimatePresence — doux, 250-300ms
- **Hover cards** : `translateY(-2px)` + ombre légère — effet "objet physique" qui se soulève
- **Hover liens nav** : transition de couleur vers `accent` (déjà dans la bonne direction, juste adapter la couleur)
- **Focus states** : outline visible, cohérent avec l'accent rouille (accessibilité)

### Claude's Discretion

- Valeurs exactes de `text-muted` et `border` (dans la gamme indiquée)
- Valeur exacte de `accent-hover` (variante sombre de l'accent)
- Easing curve pour les animations (ease-out standard recommandé)
- Implémentation précise du header transparent → opaque (threshold de scroll)
- Espace et taille de typographie (Inter reste la police, Claude décide des tailles et poids)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements phase
- `.planning/REQUIREMENTS.md` §Design System — DSGN-01, DSGN-02, DSGN-03 avec critères d'acceptation
- `.planning/ROADMAP.md` §Phase 1 — Success Criteria précis (4 critères)

### Identité visuelle (référence externe)
- Teenage Engineering (https://teenage.engineering) — référence visuelle principale. Minimalisme industriel, fond clair, typographie précise, espacement généreux. Palette "garage clair et élégant" pas "Apple Store".

No external specs or ADRs — requirements fully captured in decisions above and in REQUIREMENTS.md.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/layout/Header.tsx` : nav existante — hardcode zinc-100/violet-300, à refondre complètement avec nouveaux tokens
- `src/components/layout/Footer.tsx` : footer existant — hardcode zinc-800/zinc-950/zinc-500/violet-400, à mettre à jour avec tokens
- `src/components/ui/Tag.tsx` : composant tag — couleurs à migrer vers tokens
- `src/components/ui/CodeBlock.tsx` : bloc de code — à vérifier si les couleurs sont hardcodées
- `tailwind.config.ts` : config existante avec 2 tokens (background, foreground) — à étendre avec la palette complète

### Established Patterns
- CSS custom properties (`var(--background)`, `var(--foreground)`) dans `globals.css` → pattern déjà en place, étendre avec les nouveaux tokens CSS vars si souhaité, ou aller full Tailwind config
- Inter via `next/font/google` avec `--font-inter` variable — garder Inter, pas de changement de police
- Tailwind classes directes dans les composants — les composants utilisent des classes Tailwind hardcodées (ex. `text-zinc-100`) → remplacer par les classes sémantiques

### Integration Points
- `src/app/globals.css` : point d'entrée CSS — tokens CSS vars définis ici
- `tailwind.config.ts` : colors étendues — où atterrissent les tokens sémantiques
- `src/app/layout.tsx` : racine de l'app — applique le fond et la couleur de base via body classes

</code_context>

<specifics>
## Specific Ideas

- Référence principale : Teenage Engineering — minimalisme industriel, fond clair/crème, typographie précise
- "Garage clair et élégant" — pas d'Apple Store, pas de dark mode, pas de néon. Un établi avec des outils bien rangés.
- La nav doit montrer "Tommy Lahitte" à gauche avec les liens à droite — structure classique nom/nav de portfolio
- Le header sticky doit avoir une transition douce vers l'opacité (pas un saut brusque)
- Tips et Blog seront fusionnés en une seule section "Blog" en Phase 2 (articles longs + recommandations courtes) — la nav reflète déjà "Blog" comme unique point d'entrée

</specifics>

<deferred>
## Deferred Ideas

- **Fusion Blog + Tips en une section unifiée** — Phase 2. Le contenu Notion devra distinguer les types d'articles (long form vs. recommandation courte). À décider lors du design de la base Notion. La nav dit "Blog" dès maintenant, la structure de contenu est Phase 2.
- **Page `/about` et `/projects`** — pages créées en Phase 3 et 4, la nav pointe dessus mais le contenu arrive plus tard.

</deferred>

---

*Phase: 01-design-system*
*Context gathered: 2026-03-15*
