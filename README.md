![Astro Nano](_astro_nano.png)

Astro Nano is a static, minimalist, lightweight, lightning fast portfolio and blog theme.

Built with Astro, Tailwind and Typescript, an no frameworks.

It was designed as an even more minimal theme than my popular theme [Astro Sphere](https://github.com/markhorn-dev/astro-sphere)

## 🚀 Deploy your own

[![Deploy with Vercel](_deploy_vercel.svg)](https://vercel.com/new/clone?repository-url=git@github.com:justinkuntz/portfolio-base.git)

## 📋 Features

- ✅ 100/100 Lighthouse performance
- ✅ Responsive
- ✅ Accessible
- ✅ SEO-friendly
- ✅ Typesafe
- ✅ Minimal style
- ✅ Light/Dark Theme
- ✅ Animated UI
- ✅ Tailwind styling
- ✅ Auto generated sitemap
- ✅ Auto generated RSS Feed
- ✅ Markdown support
- ✅ MDX Support (components in your markdown)

## 💯 Lighthouse score

![Astro Nano Lighthouse Score](_lighthouse.png)

## 🕊️ Lightweight

No frameworks or added bulk

## ⚡︎ Fast

Rendered in ~40ms on localhost

## 📄 Configuration

The blog posts on the demo serve as the documentation and configuration.

## ✉️ Contact form

1. Create a [Resend](https://resend.com) API key and verify the domain you want to send from.
2. Add the following environment variables locally (e.g. in `.env`) and on Vercel:
   - `RESEND_API_KEY`
   - `CONTACT_FROM_EMAIL` (formatted like `Portfolio <hello@example.com>`)
   - `CONTACT_TO_EMAIL` (where submissions should arrive)
3. Deploy/restart so the new environment variables are picked up.

The `/contact` page posts to `/api/contact`, which performs:

- Honeypot and 2-second minimum typing window
- Form validation (name, email, message length)
- Lightweight IP rate limiting
- Email delivery via Resend (with the visitor's email set as `reply_to`)

## 💻 Commands

All commands are run from the root of the project, from a terminal:

Replace npm with your package manager of choice. `npm`, `pnpm`, `yarn`, `bun`, etc

| Command                   | Action                                            |
| :------------------------ | :------------------------------------------------ |
| `npm install`             | Installs dependencies                             |
| `npm run dev`             | Starts local dev server at `localhost:4321`       |
| `npm run dev:network`     | Starts local dev server on local network          |
| `npm run sync`            | Generates TypeScript types for all Astro modules. |
| `npm run build`           | Build your production site to `./dist/`           |
| `npm run preview`         | Preview your build locally, before deploying      |
| `npm run preview:network` | Preview build on local network                    |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check`  |
| `npm run astro -- --help` | Get help using the Astro CLI                      |
| `npm run lint`            | Run ESLint                                        |
| `npm run lint:fix`        | Auto-fix ESLint issues                            |

## 🏛️ License

MIT
