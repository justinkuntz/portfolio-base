---
title: "Projects collection"
description: "How to add new missions, case studies, and image-heavy project pages."
date: "2026-03-03"
draft: false
tags:
  - Tutorial
  - Projects
---

The `projects` collection lives in `src/content/projects`.

Each project has its own folder with an `index.mdx` file and any local assets it needs.

```text
src/content/projects
├── one-mission
│   ├── index.mdx
│   └── thumbnail.jpg
└── second-mission
    ├── index.mdx
    └── hero.jpg
```

Project entries support richer frontmatter than blog posts because the listing pages need thumbnails, tags, and optional links.

Core fields:

| Field | Required | Notes |
| :-- | :-- | :-- |
| `title` | Yes | Project title |
| `description` | Yes | Card copy and metadata |
| `date` | Yes | Used for sorting |
| `tags` | Yes | Powers filtering |
| `thumbNail` | Yes | Card image |
| `thumbNailAlt` | Yes | Accessible alt text |
| `heroImage` | Yes | Top image on the detail page |
| `heroImageAlt` | Yes | Accessible alt text |
| `draft` | No | Hidden when `true` |
| `demoURL` | No | Link to a live project |
| `repoURL` | No | Link to source code |

Use MDX body content for the longer story: challenge, approach, outcomes, and any supporting imagery that helps the reader understand how the mission unfolded.
