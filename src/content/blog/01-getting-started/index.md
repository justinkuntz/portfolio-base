---
title: "Getting started"
description: "The first files Grogu would update before taking this starter out of the covert."
date: "2026-03-01"
draft: false
tags:
  - Tutorial
  - Setup
---

This starter is intentionally simple to customize. The first stop is `src/consts.ts`.

That file controls the shared site metadata:

```ts
export const SITE: Site = {
  NAME: "Grogu",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};
```

Use it to update the site name, homepage content limits, page descriptions, navigation links, and social profiles.

Then edit the main public-facing pages:

- `src/pages/index.astro`
- `src/pages/about/index.astro`
- `src/pages/contact/index.astro`

Those pages currently follow Grogu's path toward becoming a Mandalorian. Replace the placeholder voice with your own once the site is ready to leave the forge.

Finish by setting a real canonical URL in `astro.config.mjs` or by defining `SITE_URL` in your deployment environment.
