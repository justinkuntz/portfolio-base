import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import sharp from "sharp";
import { SEO } from "@config/seo";
import { ABOUT, BLOG, CONTACT, HOME, PROJECTS, SEARCH } from "@consts";
import { renderOgImage } from "@lib/og";

type OgProps = {
  title: string;
  description: string;
  eyebrow: string;
  tags?: string[];
};

const staticPages: Array<{ slug: string; props: OgProps }> = [
  {
    slug: "site",
    props: {
      title: SEO.siteName,
      description: SEO.defaultDescription,
      eyebrow: "Grogu",
    },
  },
  {
    slug: "home",
    props: {
      title: SEO.siteName,
      description: HOME.DESCRIPTION,
      eyebrow: "Home",
    },
  },
  {
    slug: "about",
    props: {
      title: ABOUT.TITLE,
      description: ABOUT.DESCRIPTION,
      eyebrow: "About",
    },
  },
  {
    slug: "blog",
    props: {
      title: BLOG.TITLE,
      description: BLOG.DESCRIPTION,
      eyebrow: "Writing",
    },
  },
  {
    slug: "projects",
    props: {
      title: PROJECTS.TITLE,
      description: PROJECTS.DESCRIPTION,
      eyebrow: "Projects",
    },
  },
  {
    slug: "contact",
    props: {
      title: CONTACT.TITLE,
      description: CONTACT.DESCRIPTION,
      eyebrow: "Contact",
    },
  },
  {
    slug: "search",
    props: {
      title: SEARCH.TITLE,
      description: SEARCH.DESCRIPTION,
      eyebrow: "Search",
    },
  },
];

export async function getStaticPaths() {
  const [posts, projects, legalDocs] = await Promise.all([
    getCollection("blog"),
    getCollection("projects"),
    getCollection("legal"),
  ]);

  const blogPaths = posts
    .filter((post) => !post.data.draft)
    .map((post) => ({
      params: { slug: `blog/${post.id}` },
      props: {
        title: post.data.title,
        description: post.data.description,
        eyebrow: "Blog Post",
        tags: post.data.tags,
      } satisfies OgProps,
    }));

  const projectPaths = projects
    .filter((project) => !project.data.draft)
    .map((project) => ({
      params: { slug: `projects/${project.id}` },
      props: {
        title: project.data.title,
        description: project.data.description || PROJECTS.DESCRIPTION,
        eyebrow: "Project",
        tags: project.data.tags,
      } satisfies OgProps,
    }));

  const legalPaths = legalDocs.map((doc) => ({
    params: { slug: `legal/${doc.id}` },
    props: {
      title: doc.data.title,
      description: `${doc.data.title} for ${SEO.siteName}.`,
      eyebrow: "Legal",
    } satisfies OgProps,
  }));

  return [
    ...staticPages.map((entry) => ({
      params: { slug: entry.slug },
      props: entry.props,
    })),
    ...blogPaths,
    ...projectPaths,
    ...legalPaths,
  ];
}

export const GET: APIRoute<OgProps> = async ({ props }) => {
  const svg = renderOgImage({
    title: props.title,
    description: props.description,
    eyebrow: props.eyebrow,
    siteName: SEO.siteName,
    tags: props.tags,
  });

  const png = await sharp(Buffer.from(svg), { density: 144 })
    .png()
    .toBuffer();

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
