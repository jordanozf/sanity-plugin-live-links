# sanity-plugin-live-links

Sanity Studio plugin that adds a **Live links** accordion to document forms (styled like Presentation locations). Editors get per-locale URLs plus **Open all** and **Copy all**.

Works with **Sanity Studio v5 and v6**.

## Install

In your Studio project:

```bash
npm install sanity-plugin-live-links
```

Also supported: `pnpm add sanity-plugin-live-links` · `yarn add sanity-plugin-live-links`

## Site URL (automatic per environment)

The plugin reads the public site origin from Sanity environment variables — no hardcoded production URL in config.

Set **`SANITY_STUDIO_SITE_URL`** in env files for each context (Sanity loads these when you run or deploy Studio):

```bash
# .env.development
SANITY_STUDIO_SITE_URL=http://localhost:3000

# .env.staging
SANITY_STUDIO_SITE_URL=https://staging.example.com

# .env.production
SANITY_STUDIO_SITE_URL=https://www.example.com
```

Build or deploy with the matching env (for example `sanity build` uses `.env.production`; `SANITY_ACTIVE_ENV=staging sanity build` uses `.env.staging`).

If `SANITY_STUDIO_SITE_URL` is not set, the plugin falls back to **`SANITY_STUDIO_PREVIEW_URL`** (the same variable often used for the Presentation tool).

Optional: pass **`baseUrl`** in plugin config to override env for all environments.

## Setup

Add the plugin to `sanity.config.ts` (or `.js`). Each document type is configured **once** under `documents` (use your own `_type` names — `home` / `page` below are just an example):

```typescript
import { defineConfig } from 'sanity';
import { liveLinksPlugin } from 'sanity-plugin-live-links';

const liveLinksOptions = {
  locales: [
    { id: 'en', localizePath: (path) => path },
    { id: 'fr', localizePath: (path) => (path === '/' ? '/fr' : `/fr${path}`) }
  ],
  documents: {
    home: {
      path: '/',
      title: 'Home'
    },
    page: {
      requiresSlug: true,
      path: ({ slug }) => (slug?.trim() ? `/${slug.trim()}` : null),
      title: 'Page',
      resolveTitle: ({ titleValue }) =>
        typeof titleValue === 'string' && titleValue.trim() ? titleValue.trim() : 'Page'
    }
  }
};

export default defineConfig({
  // ...
  plugins: [liveLinksPlugin(liveLinksOptions)]
});
```

Open a document whose `_type` is a key in `documents`. The panel appears when `path` resolves; types with `requiresSlug: true` show `—` until the slug is filled in.

## Embedded Studio

If you embed Studio in another app (for example SvelteKit) and the panel does not show, spread the form config on the workspace:

```typescript
import { liveLinksFormConfig, liveLinksPlugin } from 'sanity-plugin-live-links';

export default defineConfig({
  plugins: [liveLinksPlugin(liveLinksOptions)],
  ...liveLinksFormConfig(liveLinksOptions)
});
```

## Presentation tool

Use the same URL rules in Presentation (site origin still comes from env):

```typescript
import { createLiveSiteUrlHelpers } from 'sanity-plugin-live-links';

const { liveSiteUrl, liveSiteLinksForPath } = createLiveSiteUrlHelpers({
  locales: liveLinksOptions.locales
});

// liveSiteUrl('fr', '/about')
// liveSiteLinksForPath('/about')
```

## Options

| Option | Required | Description |
|--------|----------|-------------|
| `documents` | yes | Map of `_type` → settings (`path`, optional `requiresSlug`, `title`, paths, etc.) |
| `locales` | yes | One entry per language (`id` + `localizePath`). Example uses EN and FR — change to match your site |
| `baseUrl` | no | Override site origin; default is `SANITY_STUDIO_SITE_URL` then `SANITY_STUDIO_PREVIEW_URL` |
| `slugPath` | no | Default slug field path (default `['slug', 'current']`) |
| `titlePath` | no | Default title field path (default `['title']`) |
| `resolveTitle` | no | Default title resolver for all types (overridable per type) |
| `panelTitle` | no | Accordion title (default `Live links`) |

### Per document (`documents[type]`)

| Field | Description |
|-------|-------------|
| `path` | Fixed path string (e.g. `'/'`) or `(context) => string \| null` |
| `requiresSlug` | Show `—` until slug is present |
| `title` | Fallback label in the panel |
| `slugPath` / `titlePath` | Override defaults for this type only |
| `resolveTitle` | Override global `resolveTitle` for this type |

## License

MIT
