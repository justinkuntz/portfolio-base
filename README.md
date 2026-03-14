# Portfolio Base

`Portfolio Base` is an Astro starter for personal portfolios, studio sites, and small creative practices. It includes sample case studies, writing, search, RSS, legal pages, and a contact form wired to an API route.

The sample copy currently follows Grogu as he grows from foundling to Mandalorian. It keeps the demo light-hearted without sacrificing the structure you would expect from a production-ready starter.

## Features

- Astro 6 with MDX and Solid components
- Filterable projects and blog collections
- Full-text search with Fuse.js
- Sitemap and RSS generation
- Light and dark theme toggle
- Contact form endpoint with honeypot, timing check, and rate limiting
- Sample legal pages for privacy, cookies, and terms

## Quick Start

```bash
nvm use
npm install
npm run dev
```

Open `http://localhost:4321`.

The project is currently pinned to Node `22.22.1` in both `.nvmrc` and `.tool-versions`.

If you use `asdf`/`mise`, the project also includes `.tool-versions`.

If you switch between `asdf` and `nvm`, make sure only one is controlling Node for the project. A stale npm `prefix` from `asdf` can break `nvm use`.

The starter is standardized on `npm`. It includes a `package-lock.json` and a `packageManager` field so hosts like Vercel do not guess the wrong installer.

### Local Dev Note

The Astro 6 + Vite 7 setup includes a small workaround in `astro.config.mjs` for local environments where Vite's internal `@vite/env` or `@vite/client` imports fail to resolve during `astro dev`.

This only affects local dev. It does not change production build output.

## Customize The Starter

Start with these files:

- `src/consts.ts` for site name, navigation, homepage card layout, metadata, and social links
- `src/config/media.ts` for image defaults like hero layout, thumbnail shape, and responsive widths
- `src/config/seo.ts` for global SEO defaults
- `src/pages/index.astro`, `src/pages/about/index.astro`, and `src/pages/contact/index.astro` for the main marketing copy
- `src/content/projects/*` for case studies
- `src/content/blog/*` for posts or notes
- `src/content/work/*` for the timeline shown on the about page
- `astro.config.mjs` for your canonical site URL

The blog also includes starter guidance posts for the core collections and contact workflow, so the sample content doubles as lightweight documentation while you are getting oriented.

The default `site` value in `astro.config.mjs` falls back to `https://example.com`. On Vercel previews, the config will fall back to the Vercel preview URL automatically. For production, replace it or set `SITE_URL` in your deployment environment before going live.

## Themes

The active theme is selected in `src/styles/theme.css`.

- `src/styles/themes/theme-default.css` keeps the original sans-forward, rounded look.
- `src/styles/themes/theme-serif.css` demonstrates a serif-led, square-corner, wider-layout variation with a warmer palette.

To switch themes, change the `@import` in `src/styles/theme.css`.

The top of each theme file is the main control surface:

- font roles for body, headings, and UI
- radius values for corners and pills
- container widths and content measures
- primitive palette plus semantic surface, text, focus, and feedback colors

## Images

The image workflow is designed so users manage one source file per image slot and Astro handles delivery optimization during the build.

### Simple author workflow

When preparing images, keep it lightweight:

- `hero` image: export a wide image around `2000-2400px`
- `thumbnail` image: export a separate crop around `1200-1600px`
- `gallery` image: export images around `1600-2200px`
- photos and mockups: use `jpg`
- transparency: use `png`
- logos and vectors: use `svg`
- keep images in `sRGB`
- write alt text when you add the image

Do not create your own `@2x`, mobile, desktop, or `webp` copies. The starter does that work for you.

### Where to put images

- project images live next to the project entry in `src/content/projects/<slug>/`
- blog images live next to the blog entry in `src/content/blog/<slug>/`

For projects, frontmatter should point to one file for each image slot:

- `thumbNail`
- `thumbNailAlt`
- `heroImage`
- `heroImageAlt`

Inside MDX, each inline image should be referenced once. The shared `MDXImage` component turns that single source image into responsive output during the build.

### Central media configuration

The main control surface is `src/config/media.ts`.

That file lets users change defaults without touching components:

- project hero layout: contained or full-bleed
- project hero aspect ratio
- homepage project stack thumbnail aspect ratio
- project thumbnail aspect ratio
- responsive widths and `sizes`
- image quality defaults for hero, thumbnail, and MDX images

Example changes a user can make there:

- make project heroes span the full viewport instead of staying inside the container
- switch project thumbnails from landscape to square by changing the ratio to `1 / 1`
- switch project thumbnails to portrait by changing the ratio to `4 / 5`

## Homepage Project Cards

The homepage project section is configured in `src/consts.ts`, alongside the other starter-level site controls.

That config currently supports:

- `LAYOUT: "waterfall"` for the stacked scrolling cards
- `LAYOUT: "grid"` for a static grid of cards
- `GRID_COLUMNS: 1 | 2 | 3 | 4` to control the desktop grid density

Example:

```ts
export const HOMEPAGE_PROJECTS = {
  LAYOUT: "grid",
  GRID_COLUMNS: 3,
};
```

The homepage will automatically choose the right thumbnail image profile for the selected layout, so users do not need to manage separate image references when switching between waterfall and grid.

## Project Landing Grid

The project landing page grid is also configured in `src/consts.ts`.

That config currently supports:

- `GRID_COLUMNS: 1 | 2 | 3 | 4` to control the desktop grid density

Example:

```ts
export const PROJECTS_LISTING = {
  GRID_COLUMNS: 3,
};
```

This keeps the projects index on a simple responsive grid:

- `1` stays one-up
- `2` becomes two-up on larger screens
- `3` becomes two-up first, then three-up
- `4` becomes two-up, then three-up, then four-up

## Blog Landing Grid

The blog landing page grid is configured in `src/consts.ts` as well.

That config currently supports:

- `GRID_COLUMNS: 1 | 2 | 3 | 4` to control the desktop grid density

Example:

```ts
export const BLOG_LISTING = {
  GRID_COLUMNS: 3,
};
```

This keeps the blog index on the same responsive pattern as the projects index:

- `1` stays one-up
- `2` becomes two-up on larger screens
- `3` becomes two-up first, then three-up
- `4` becomes two-up, then three-up, then four-up

### Why this works well for a future CMS

This setup is intentionally close to how a self-hosted Markdown CMS would work later:

- content entries keep a single file reference for each image field
- the build pipeline decides how images are served
- frontmatter field names stay stable
- users do not need to manage generated asset paths

Long term, gallery images can also move into structured frontmatter arrays if you want a more CMS-like editing experience.

## SEO And OG Images

The SEO pipeline is centralized so users can configure metadata in one place and override it only when needed.

- `src/config/seo.ts` controls the global site defaults
- `src/lib/seo.ts` resolves canonical URLs, title templates, OG/Twitter meta, and structured data
- `src/styles/theme.css` and the active theme do not affect metadata directly, but the generated placeholder OG images use the same Grogu visual direction
- `src/pages/og/[...slug].png.ts` generates static social preview images at build time for pages, legal docs, blog posts, and project entries
- `generatedImage: true` in `PageLayout` SEO props opts a route into a route-specific generated OG placeholder
- `npm run generate:placeholders` creates starter blog hero PNGs next to each blog entry

Fallback order:

1. explicit per-page or per-entry SEO image
2. entry hero image when that content type provides one
3. generated route OG image like `/og/projects/onelab.png` when the route opts in with `generatedImage: true`
4. global site fallback at `/og/site.png`

Content entries can override SEO with optional `seo` frontmatter. For blog and project entries this supports:

- `seo.title`
- `seo.description`
- `seo.image`
- `seo.imageAlt`
- `seo.noindex`

Blog entries can also define optional `heroImage` and `heroImageAlt`. If present, they become the default OG image for that post unless `seo.image` overrides them.
For the starter content, those sample hero images live next to each blog entry as local files, so blog images follow the same content-managed pattern as projects.

## Accessibility

The starter includes a basic accessibility foundation:

- skip link and explicit `main` target
- keyboard-visible focus states
- active navigation state with `aria-current`
- labeled search input and live results status
- improved mobile drawer semantics
- consistent alt text handling in the main templates

This should still be checked in-browser with real content before launch.

## Performance Direction

The starter now includes a first round of performance work:

- centralized image defaults in `src/config/media.ts`
- responsive project thumbnails generated at build time
- tighter MDX image width generation
- less aggressive hydration on blog, projects, search, and homepage interactive surfaces
- cleaned up font preloading so the head is lighter by default

The long-term strategy is:

- keep one source image per content slot
- let Astro generate delivery variants during the build
- keep configuration in central files instead of component-by-component overrides
- stay close to a content model that can later be edited by a Markdown-based CMS

## Content Model

The starter uses Astro content collections:

- `blog`: dated posts with descriptions and tags
- `projects`: case studies with thumbnail and hero images
- `work`: timeline entries rendered on the about page
- `legal`: Markdown-backed legal pages

## Contact Form

The `/contact` page posts to `/api/contact`. To enable email delivery, configure:

- `RESEND_API_KEY`
- `CONTACT_FROM_EMAIL`
- `CONTACT_TO_EMAIL`

Without those variables, the endpoint stays disabled and returns an error response.

## Deployment

The starter stays host-agnostic by default.

- `npm run build` creates the standard static Astro build for generic static hosting.
- Vercel support is included, but it only activates when the build runs on Vercel or when `DEPLOY_TARGET=vercel` is set.
- That keeps the template usable on Netlify, Cloudflare Pages, GitHub Pages, or any other static host without first removing Vercel-specific code.

### Vercel Preview Deployments

If you import the repo into Vercel:

- Astro automatically switches to the Vercel adapter
- the app uses `server` output on Vercel so `/api/contact` can work
- preview deployments get a usable canonical site URL from Vercel when `SITE_URL` is not set

Recommended production environment variables:

- `SITE_URL`
- `RESEND_API_KEY`
- `CONTACT_FROM_EMAIL`
- `CONTACT_TO_EMAIL`

To validate the Vercel-targeted build locally:

```bash
npm run deploy:check
```

This keeps Vercel as an optional deployment target instead of the only supported host.

If your shell reports `No version is set for command vercel`, that is usually an `asdf` or `mise` shim issue on your machine, not a repo problem. In that case, use:

```bash
npx vercel
```

You can also install the CLI under your active Node version and reshim, but the project docs assume `npx vercel` so users do not need a global install.

## Commands

| Command | Action |
| :-- | :-- |
| `npm run dev` | Start the local dev server |
| `npm run dev:network` | Start the dev server on your local network |
| `npm run build` | Run Astro checks and create a production build |
| `npm run build:vercel` | Run Astro checks and build with the optional Vercel target |
| `npm run deploy:check` | Validate the Vercel deployment build locally |
| `npm run preview` | Preview the production build locally |
| `npm run preview:network` | Preview the production build on your local network |
| `npm run generate:placeholders` | Generate starter blog placeholder images |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix ESLint issues |

## License

MIT
