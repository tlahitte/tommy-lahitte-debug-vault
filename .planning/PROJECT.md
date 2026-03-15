# debug-vault — Tommy Lahitte

## What This Is

Portfolio personnel d'un maker/tinkerer qui mixe art et technologie. Le site présente deux types de contenus : des **fiches projets** (visuels + documentation du processus) et des **articles de journal** (réflexions, expérimentations, apprentissages). Le contenu est édité dans Notion et publié automatiquement via un pipeline GitHub → Netlify. L'identité visuelle reflète l'esthétique d'un garage technologique élégant — épuré, industriel, distinctif.

## Core Value

Un visiteur doit repartir en ayant compris la démarche de Tommy — ce qu'il construit, comment il pense, et pourquoi le processus compte autant que le résultat.

## Requirements

### Validated

<!-- Ce que le codebase actuel fait déjà. -->

- ✓ Site Next.js 15 avec App Router et React Server Components — existant
- ✓ Pages blog et tips avec routes dynamiques statiquement générées (SSG) — existant
- ✓ SEO : metadata, Schema.org, sitemap, Open Graph, canonical URLs — existant
- ✓ Filtrage par catégorie sur la page tips — existant
- ✓ Pipeline de déploiement GitHub → Netlify — existant
- ✓ Typographie responsive avec breakpoints — existant

### Active

<!-- Nouvelle portée — ce qu'on construit. -->

- [ ] Notion comme CMS : articles de blog synchronisés depuis des pages Notion
- [ ] Notion comme CMS : fiches projets synchronisées depuis des pages Notion (nouveau type de contenu)
- [ ] Rebuild Netlify déclenché automatiquement sur changement de contenu dans Notion (webhook)
- [ ] Refonte visuelle complète — identité maker/garage élégant (palette claire, kraft/beige, métal mat)
- [ ] Page d'accueil redessinée — projets en vedette avec impact visuel fort
- [ ] Pages projets avec galerie visuelle et documentation du processus (pas juste le résultat)
- [ ] Pages articles redessinées — lisibilité maximale, ton journal de bord
- [ ] Navigation épurée cohérente avec l'identité visuelle

### Out of Scope

- Interface admin sur le site — Notion gère l'édition, pas de /admin séparé
- Authentification sur le site — Notion workspace suffit pour le contrôle d'accès
- Thème sombre — on va vers une palette claire industrielle (kraft/beige)
- Comptes utilisateurs / multi-utilisateurs — site personnel, un seul auteur
- E-commerce, formulaires de contact complexes — pas dans la démarche maker
- Application mobile dédiée — web responsive suffit

## Context

**Codebase existante :** Next.js 15.2.3, React 19, TypeScript, Tailwind CSS 3. Contenu actuellement stocké en TypeScript statique dans `src/content/` (tips + blog posts). Architecture propre avec couche Data Access séparée (`src/lib/`).

**Problème actuel :** Le site ressemble à un site généré par IA — trop générique, ne reflète pas l'identité distinctive de Tommy. Aucun moyen d'éditer le contenu sans modifier le code.

**Direction design :** Teenage Engineering comme référence de minimalisme industriel. Mais version "garage clair et élégant" — fond beige/kraft, accents métal mat, espace blanc généreux, typographie précise. L'ambiance d'un établi avec des outils rangés, pas d'un Apple Store.

**Contenu :** Deux types distincts :
1. **Projets** — visuels forts (photos), documentation du processus (étapes, échecs, apprentissages), résultat final
2. **Articles** — réflexions narratives, expérimentations, journal de bord technique/créatif

**Édition :** Notion comme source de vérité. Tommy écrit dans son workspace Notion. Le build Netlify tire le contenu via l'API Notion. Un webhook Notion → Netlify déclenche les rebuilds à la publication.

## Constraints

- **Stack** : Next.js + TypeScript + Tailwind — ne pas changer le framework
- **Déploiement** : GitHub + Netlify — garder absolument ce pipeline
- **Versioning** : Git comme filet de sécurité — toutes les modifications passent par GitHub
- **CMS** : Notion — pas de nouveau service à gérer, pas de nouveau login
- **Accessibilité** : Site public, pas d'auth, SEO important (déjà bien en place)
- **Performance** : Garder l'approche SSG — pages statiques générées au build, rapides

## Key Decisions

| Décision | Rationale | Outcome |
|----------|-----------|---------|
| Notion comme CMS | Zéro nouveau login, interface familière, API solide | — Pending |
| Garder SSG (pas de SSR ou API routes pour le contenu) | Performance, coûts Netlify nuls, pas de DB à gérer | — Pending |
| Refonte complète plutôt que patch du design existant | L'identité est trop ancrée dans le style "IA générique" actuel | — Pending |
| Palette claire industrielle (pas sombre) | Cohérent avec l'esthétique Teenage Engineering + kraft | — Pending |

---
*Last updated: 2026-03-15 after initialization*
