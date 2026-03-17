import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({
    pattern: "**/index.{md,mdx}",
    base: "./src/content/blog",
    generateId: ({ entry }) => entry.replace(/\/index\.(md|mdx)$/, ""),
  }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    draft: z.boolean().optional(),
    heroImage: image().optional(),
    heroImageAlt: z.string().optional(),
    seo: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      image: image().optional(),
      imageAlt: z.string().optional(),
      noindex: z.boolean().optional(),
    }).optional(),
  }),
});

const work = defineCollection({
  loader: glob({
    pattern: "*.md",
    base: "./src/content/work",
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    dateStart: z.coerce.date(),
    dateEnd: z.union([z.coerce.date(), z.string()]),
  }),
});

const projects = defineCollection({
  loader: glob({
    pattern: "**/index.mdx",
    base: "./src/content/projects",
    generateId: ({ entry }) => entry.replace(/\/index\.mdx$/, ""),
  }),
  schema: ({ image }) => z.object({
    accentColor: z.string().optional(),
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    draft: z.boolean().optional(),
    demoText: z.string().optional(),
    demoURL: z.string().optional(),
    repoText: z.string().optional(),
    repoURL: z.string().optional(),
    thumbNail: image(),
    thumbNailAlt: z.string(),
    heroImage: image(),
    heroImageAlt: z.string(),
    challenge: z.string().optional(),
    solution: z.string().optional(),
    results: z.string().optional(),
    passwordProtect: z.union([
      z.boolean(),
      z.enum(["Yes", "No", "yes", "no"]),
    ]).transform((value) => {
      if (typeof value === "boolean") return value;
      return value.toLowerCase() === "yes";
    }).optional().default(false),
    passwordId: z.string().optional(),
    passwordHint: z.string().optional(),
    passwordSummary: z.string().optional(),
    access: z.object({
      visibility: z.enum(["public", "protected"]).default("public"),
      passwordId: z.string().optional(),
      hint: z.string().optional(),
      summary: z.string().optional(),
    }).optional().refine((value) => {
      if (!value || value.visibility === "public") return true;
      return Boolean(value.passwordId);
    }, {
      message: "Protected projects require an access.passwordId value.",
      path: ["passwordId"],
    }),
    seo: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      image: image().optional(),
      imageAlt: z.string().optional(),
      noindex: z.boolean().optional(),
    }).optional(),
  }),
});

const legal = defineCollection({
  loader: glob({
    pattern: "*.md",
    base: "./src/content/legal",
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    seo: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      noindex: z.boolean().optional(),
    }).optional(),
  }),
});

export const collections = { blog, work, projects, legal };
