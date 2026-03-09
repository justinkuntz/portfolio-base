---
title: "Work collection"
description: "How the experience timeline on the about page is assembled."
date: "2026-03-04"
draft: false
tags:
  - Tutorial
  - About
---

The experience timeline on `/about` is powered by the `work` collection in `src/content/work`.

Unlike the blog and projects collections, each work entry is a single Markdown file:

```text
src/content/work
├── the-covert.md
├── din-djarin.md
└── jedi-training.md
```

Required frontmatter:

```md
---
company: "The Covert"
role: "Mandalorian Apprentice"
dateStart: "2026-01-01"
dateEnd: "Present"
---
```

Fields:

| Field | Required | Notes |
| :-- | :-- | :-- |
| `company` | Yes | Organization or team name |
| `role` | Yes | Title shown in the timeline |
| `dateStart` | Yes | Start date |
| `dateEnd` | Yes | End date or a string like `Present` |

The Markdown body becomes the supporting description for that role. Keep it brief. One tight paragraph reads better than a cargo hold of bullet points.
