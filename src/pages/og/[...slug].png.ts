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

function normalizeSlugParam(value: string | undefined) {
  return value?.replace(/^\/+|\/+$/g, "") ?? "";
}

export const GET: APIRoute<OgProps> = async ({ props, params }) => {
  const slug = normalizeSlugParam(params.slug);

  let resolvedProps = props;

  if (!resolvedProps && slug) {
    const staticEntry = staticPages.find((entry) => entry.slug === slug);

    if (staticEntry) {
      resolvedProps = staticEntry.props;
    } else if (slug.startsWith("blog/")) {
      const id = slug.slice("blog/".length);
      const posts = await getCollection("blog");
      const post = posts.find((entry) => !entry.data.draft && entry.id === id);

      if (post) {
        resolvedProps = {
          title: post.data.title,
          description: post.data.description,
          eyebrow: "Blog Post",
          tags: post.data.tags,
        };
      }
    } else if (slug.startsWith("projects/")) {
      const id = slug.slice("projects/".length);
      const projects = await getCollection("projects");
      const project = projects.find((entry) => !entry.data.draft && entry.id === id);

      if (project) {
        resolvedProps = {
          title: project.data.title,
          description: project.data.description || PROJECTS.DESCRIPTION,
          eyebrow: "Project",
          tags: project.data.tags,
        };
      }
    } else if (slug.startsWith("legal/")) {
      const id = slug.slice("legal/".length);
      const legalDocs = await getCollection("legal");
      const doc = legalDocs.find((entry) => entry.id === id);

      if (doc) {
        resolvedProps = {
          title: doc.data.title,
          description: `${doc.data.title} for ${SEO.siteName}.`,
          eyebrow: "Legal",
        };
      }
    }
  }

  if (!resolvedProps) {
    return new Response("Not found", { status: 404 });
  }

  const svg = renderOgImage({
    title: resolvedProps.title,
    description: resolvedProps.description,
    eyebrow: resolvedProps.eyebrow,
    siteName: SEO.siteName,
    tags: resolvedProps.tags,
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
