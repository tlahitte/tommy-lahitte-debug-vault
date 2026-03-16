# Requirements: debug-vault

**Defined:** 2026-03-15
**Core Value:** Un visiteur doit repartir en ayant compris la démarche de Tommy — ce qu'il construit, comment il pense, et pourquoi le processus compte autant que le résultat.

## v1 Requirements

Requirements pour la première version. Chaque requirement mappe vers une phase de la roadmap.

### Design System

- [x] **DSGN-01**: Le design system extrait des tokens sémantiques Tailwind (`surface`, `text-primary`, `text-muted`, `accent`, `border`) avant toute modification de composant
- [x] **DSGN-02**: L'identité visuelle maker appliquée — palette kraft/beige, typographie précise, espacement généreux, allègement du style actuel "AI-générique"
- [x] **DSGN-03**: Les micro-animations sobres implémentées sur les interactions clés (hover cards, transitions de pages, états de focus)

### Page d'accueil

- [ ] **HOME-01**: La page d'accueil présente un hero fort communiquant la démarche maker (qui est Tommy, ce qu'il construit) avec impact visuel immédiat
- [ ] **HOME-02**: La page d'accueil met en vedette 2-3 projets récents avec aperçu visuel
- [ ] **HOME-03**: La page d'accueil affiche les derniers articles de blog en aperçu
- [ ] **HOME-04**: La page d'accueil intègre une section About courte (pas de page séparée nécessaire pour l'intro)

### Notion CMS — Fondation

- [x] **NOTI-01**: Le data layer Notion implémenté avec throttle (3 req/s), pagination complète, et download des images au build time (URLs Notion expirent en 1h)
- [x] **NOTI-02**: Le renderer de blocks Notion supporte : paragraph, heading (h1-h3), code, callout, bulleted_list, numbered_list, image, toggle, divider
- [x] **NOTI-03**: Les blocks non supportés sont rendus silencieusement (fallback invisible, jamais une erreur de build)
- [x] **NOTI-04**: Les types TypeScript sont définis et mappés depuis les propriétés des bases Notion (correspondance stricte entre propriétés Notion et types TS)
- [ ] **NOTI-05**: Le webhook Notion → Netlify Build Hook est configuré — publier un contenu dans Notion déclenche un rebuild automatique du site (~2 min de latence)

### Blog

- [ ] **BLOG-01**: Le contenu existant migré vers Notion (tous les articles actuels recréés dans la base Notion Blog)
- [x] **BLOG-02**: Les URLs des articles préservées (slugs identiques à aujourd'hui, aucun lien cassé, SEO protégé)

### Projets

- [ ] **PROJ-01**: Une page liste `/projects` affiche tous les projets publiés depuis Notion
- [ ] **PROJ-02**: Chaque projet a une page détail avec : titre, description, corps de contenu riche depuis Notion
- [ ] **PROJ-03**: Les pages projets affichent une galerie d'images (photos process + résultat final)
- [ ] **PROJ-04**: Chaque projet a un statut visible (En cours / Terminé / Archivé) géré depuis Notion
- [ ] **PROJ-05**: Les projets sont taggués par catégorie (hardware, software, art, mixte) filtrables sur la page liste

### About

- [ ] **ABOU-01**: Une page `/about` dédiée présente la bio complète et le parcours maker de Tommy

## v2 Requirements

Différé. Présent dans les specs mais pas dans la roadmap courante.

### Documentation de processus

- **PROC-01**: Section structurée "Process / Ce qui a foiré / Ce que j'ai appris" sur les pages projets
- **PROC-02**: Format "Build log" pour documenter les projets en temps réel (journal de construction)
- **PROC-03**: Photos de process avec légendes intégrées dans le corps des projets

### Enrichissement blog

- **BLOG-V2-01**: Tags/catégories sur les articles de blog
- **BLOG-V2-02**: Filtrage des articles par sujet sur la page liste

### Enrichissement projets

- **PROJ-V2-01**: Cross-linking bidirectionnel projets ↔ articles de blog liés
- **PROJ-V2-02**: RSS feed pour les projets et le blog

### Tips (section existante)

- **TIPS-V2-01**: Migration de la section Tips existante vers Notion (actuellement en TypeScript statique)

## Out of Scope

| Feature | Raison |
|---------|--------|
| Interface admin sur le site | Notion est l'interface d'édition — pas de /admin séparé |
| Authentification sur le site | Notion workspace suffit, pas d'espace privé côté site |
| Thème sombre | On va vers une palette claire industrielle, pas de dark mode |
| Comptes utilisateurs | Site personnel, un seul auteur |
| Système de commentaires | Pas dans la démarche maker, complexité sans valeur |
| E-commerce | Hors scope |
| ISR / on-demand revalidation | Incompatible avec `output: 'export'` sur Netlify — full rebuild uniquement |
| Analytics dashboard intégré | Netlify Analytics ou solution externe suffisent |
| Migration Tips vers Notion en v1 | Différé à v2 — les Tips existants restent en TypeScript statique |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DSGN-01 | Phase 1 | Complete |
| DSGN-02 | Phase 1 | Complete |
| DSGN-03 | Phase 1 | Complete |
| HOME-01 | Phase 4 | Pending |
| HOME-02 | Phase 4 | Pending |
| HOME-03 | Phase 4 | Pending |
| HOME-04 | Phase 4 | Pending |
| NOTI-01 | Phase 2 | Complete |
| NOTI-02 | Phase 2 | Complete |
| NOTI-03 | Phase 2 | Complete |
| NOTI-04 | Phase 2 | Complete |
| NOTI-05 | Phase 2 | Pending |
| BLOG-01 | Phase 2 | Pending |
| BLOG-02 | Phase 2 | Complete |
| PROJ-01 | Phase 3 | Pending |
| PROJ-02 | Phase 3 | Pending |
| PROJ-03 | Phase 3 | Pending |
| PROJ-04 | Phase 3 | Pending |
| PROJ-05 | Phase 3 | Pending |
| ABOU-01 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 20 total
- Mappés aux phases: 20
- Non mappés: 0

---
*Requirements définis: 2026-03-15*
*Last updated: 2026-03-15 — traceability complétée par le roadmapper*
