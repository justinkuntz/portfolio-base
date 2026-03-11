import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    draft: z.boolean().optional(),
    heroImage: z.string().optional(),
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
  type: "content",
  schema: z.object({
    company: z.string(),
    role: z.string(),
    dateStart: z.coerce.date(),
    dateEnd: z.union([z.coerce.date(), z.string()]),
  }),
});

const projects = defineCollection({
  type: "content",
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
  type: "content",
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
