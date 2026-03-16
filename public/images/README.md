# Project Images

Store project images here. Notion Gallery properties link to these files as external URLs.

## Directory Convention

```
public/images/
  projects/{slug}/          — project images + gallery
    cover.webp
    gallery-01.webp
    gallery-02.webp
  articles/{slug}/          — article images
    cover.webp
  recommendations/{slug}/   — recommendation images
    cover.webp
```

## URL Patterns

**On the site (preferred for Notion links):**
```
https://tommy-lahitte.netlify.app/images/{category}/{slug}/cover.webp
```

**GitHub raw (works before deploy):**
```
https://raw.githubusercontent.com/tlahitte/tommy-lahitte-debug-vault/main/public/images/{category}/{slug}/cover.webp
```

## Usage in Notion

1. Add images to `public/images/{category}/{slug}/`
2. Push to `main`
3. In Notion, use "Embed link" on Cover or Gallery properties with the site URL
4. Rebuild — external URLs pass through as-is, no expiration
