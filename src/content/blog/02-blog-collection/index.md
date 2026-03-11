---
title: "Blog collection"
description: "How to add notes, essays, and field reports to the blog."
heroImage: "./hero.png"
heroImageAlt: "Grogu-themed placeholder artwork for the Blog collection article"
date: "2026-03-02"
draft: false
tags:
  - Tutorial
  - Content
---

The `blog` collection lives in `src/content/blog`.

Each post gets its own folder:

```text
src/content/blog
├── 01-getting-started
│   └── index.md
└── 02-blog-collection
    └── index.md
```

The folder name becomes the slug, so `src/content/blog/field-notes/index.md` becomes:

- `/blog/field-notes`

Blog entries are validated by the schema in `src/content/config.ts`.

Required frontmatter:

```md
---
title: "Field notes from Nevarro"
description: "A short update from the workshop."
date: "2026-03-02"
tags:
  - Notes
  - Process
draft: false
---
```

Fields:

| Field | Required | Notes |
| :-- | :-- | :-- |
| `title` | Yes | Used on the page and in metadata |
| `description` | Yes | Used in cards, SEO, and RSS |
| `date` | Yes | Must parse as a valid date |
| `tags` | Yes | Powers filtering on `/blog` |
| `heroImage` | No | Optional local image used for SEO and sharing |
| `heroImageAlt` | No | Alt text for the optional hero image |
| `draft` | No | Hidden from the site when `true` |

Write in Markdown when you only need text. Use MDX when the post needs components or richer media.
