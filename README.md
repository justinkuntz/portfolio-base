# Portfolio Base

`Portfolio Base` is an Astro starter for personal portfolios, studio sites, and small creative practices. It includes sample case studies, writing, search, RSS, legal pages, and a contact form wired to an API route.

The sample copy currently follows Grogu as he grows from foundling to Mandalorian. It keeps the demo light-hearted without sacrificing the structure you would expect from a production-ready starter.

## Features

- Astro 5 with MDX and Solid components
- Filterable projects and blog collections
- Full-text search with `astro-fuse`
- Sitemap and RSS generation
- Light and dark theme toggle
- Contact form endpoint with honeypot, timing check, and rate limiting
- Sample legal pages for privacy, cookies, and terms

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:4321`.

## Customize The Starter

Start with these files:

- `src/consts.ts` for site name, navigation, metadata, and social links
- `src/pages/index.astro`, `src/pages/about/index.astro`, and `src/pages/contact/index.astro` for the main marketing copy
- `src/content/projects/*` for case studies
- `src/content/blog/*` for posts or notes
- `src/content/work/*` for the timeline shown on the about page
- `astro.config.mjs` for your canonical site URL

The blog also includes starter guidance posts for the core collections and contact workflow, so the sample content doubles as lightweight documentation while you are getting oriented.

The default `site` value in `astro.config.mjs` falls back to `https://example.com`. Replace it or set `SITE_URL` in your deployment environment before going live.

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

## Commands

| Command | Action |
| :-- | :-- |
| `npm run dev` | Start the local dev server |
| `npm run dev:network` | Start the dev server on your local network |
| `npm run build` | Run Astro checks and create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run preview:network` | Preview the production build on your local network |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix ESLint issues |

## License

MIT
