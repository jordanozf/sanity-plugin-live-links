# sanity-plugin-live-links

Sanity Studio plugin that adds a **Live links** accordion to document forms — matching Presentation location styling — with per-locale URLs, **Open all**, and **Copy all**.

## Install

```bash
npm install sanity-plugin-live-links
# peer deps: sanity, @sanity/ui, @sanity/icons, react
```

## Usage

```typescript
import { defineConfig } from 'sanity';
import { liveLinksPlugin, createLiveSiteUrlHelpers } from 'sanity-plugin-live-links';

const siteUrl = 'https://www.example.com';

export default defineConfig({
  // ...
  plugins: [
    liveLinksPlugin({
      baseUrl: siteUrl,
      documentTypes: ['page', 'home'],
      requiresSlug: ['page'],
      locales: [
        { id: 'en', localizePath: (path) => path },
        { id: 'fr', localizePath: (path) => (path === '/' ? '/fr' : `/fr${path}`) },
        { id: 'it', localizePath: (path) => (path === '/' ? '/it' : `/it${path}`) }
      ],
      resolvePath: ({ documentType, slug }) => {
        if (documentType === 'home') return '/';
        if (documentType === 'page' && slug?.trim()) return `/${slug.trim()}`;
        return null;
      },
      resolveTitle: ({ titleValue, documentType }) => {
        // optional: parse intl arrays, plain strings, etc.
        if (typeof titleValue === 'string' && titleValue.trim()) return titleValue.trim();
        return documentType === 'home' ? 'Home' : 'Page';
      }
    })
  ]
});
```

**Embedded Studio** (e.g. `@sanity/sveltekit`): if the panel does not show when the plugin is only in `plugins`, spread the form config on the workspace instead:

```typescript
import { liveLinksFormConfig, liveLinksPlugin } from 'sanity-plugin-live-links';

const liveLinks = { /* same options as above */ };

export default defineConfig({
  plugins: [liveLinksPlugin(liveLinks)],
  ...liveLinksFormConfig(liveLinks)
});
```

### Presentation `defineLocations`

Reuse the same URL builder for Sanity Presentation:

```typescript
import { createLiveSiteUrlHelpers } from 'sanity-plugin-live-links';

const { liveSiteUrl } = createLiveSiteUrlHelpers({
  baseUrl: siteUrl,
  locales: [/* same as plugin */]
});

// href: liveSiteUrl('fr', '/about')
```

## Options

| Option | Description |
|--------|-------------|
| `baseUrl` | Public site URL (origin used for absolute links) |
| `documentTypes` | Schema types that show the panel |
| `locales` | `{ id, localizePath(path) }` for each language |
| `resolvePath` | Returns locale-neutral path (`/`, `/about`) or `null` |
| `resolveTitle` | Optional title from form values |
| `slugPath` | Form path to slug (default `['slug', 'current']`) |
| `titlePath` | Form path to title (default `['title']`) |
| `requiresSlug` | Types that show `—` when slug is empty |
| `panelTitle` | Accordion label (default `Live links`) |

## Development in this monorepo

CESDA links the package via pnpm workspace (`packages/sanity-plugin-live-links` → `sanity-plugin-live-links: workspace:*`).

## Own repository

To publish or develop the plugin separately:

1. Copy `packages/sanity-plugin-live-links/` to a new git repo (include `src/`, `package.json`, `tsconfig.json`, `README.md`, `LICENSE`).
2. Run `pnpm install` (or `npm install`) in that repo.
3. Publish with `npm publish --access public` when ready.

In consuming projects, install from npm instead of workspace:

```bash
pnpm add sanity-plugin-live-links
```

The plugin ships TypeScript source in `exports` (no build step required for Vite-based Sanity Studio). Add a `dist` build later if you need CommonJS or stricter npm packaging.

## License

MIT
