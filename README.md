# Tomáš Musil — portfolio

Personal site built with Vite, React 19, TypeScript and Motion. Czech lives at `/`, English at `/en/`;
both are prerendered to static HTML at build time.

## Develop

```sh
pnpm install
pnpm dev        # http://localhost:5173 (and /en/)
pnpm lint
```

## Build

```sh
pnpm build      # → dist/ (static files, deploy anywhere)
pnpm preview
```

`pnpm build` runs the type check, the client build, an SSR build of `src/entry-server.tsx`, and
`scripts/prerender.mjs`, which writes `dist/index.html`, `dist/en/index.html` and `robots.txt`.

Set the production origin in `.env` (`VITE_SITE_URL=https://…`) to also emit canonical/hreflang/Open Graph
image tags and `sitemap.xml` — they need absolute URLs, so they're skipped while it's empty.

## Content

All copy (both languages) is in `src/content.ts`; images are in `public/media/`.
