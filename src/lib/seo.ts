import type { ImageMetadata } from "astro";
import { SEO } from "@config/seo";

export type SeoImage = string | ImageMetadata | undefined;

export type SeoInput = {
  title: string;
  description?: string;
  image?: SeoImage;
  imageAlt?: string;
  generatedImage?: boolean | string;
  pathname: string;
  site: URL;
  kind?: "page" | "blog" | "project" | "legal";
  type?: "website" | "article";
  noindex?: boolean;
  publishedTime?: Date;
  modifiedTime?: Date;
  tags?: string[];
};

export type ResolvedSeo = {
  title: string;
  description: string;
  canonicalUrl: string;
  type: "website" | "article";
  image: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  imageType?: string;
  noindex: boolean;
  locale: string;
  publishedTime?: string;
  modifiedTime?: string;
  tags: string[];
  jsonLd: Record<string, unknown>[];
};

function isAbsoluteUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function toAbsoluteUrl(value: string, site: URL) {
  return isAbsoluteUrl(value) ? value : new URL(value, site).toString();
}

function inferImageType(path: string) {
  const lower = path.toLowerCase();
  if (lower.endsWith(".svg")) return "image/svg+xml";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  return undefined;
}

function resolveGeneratedImagePath(
  generatedImage: SeoInput["generatedImage"],
  pathname: string,
) {
  if (typeof generatedImage === "string" && generatedImage.length > 0) {
    return generatedImage;
  }

  if (generatedImage) {
    return getOgImagePath(pathname);
  }

  return undefined;
}

function resolveImage(
  image: SeoImage,
  generatedImage: SeoInput["generatedImage"],
  pathname: string,
  site: URL,
) {
  if (image && typeof image !== "string") {
    return {
      url: toAbsoluteUrl(image.src, site),
      width: image.width,
      height: image.height,
      type: image.format ? `image/${image.format}` : undefined,
      kind: "explicit" as const,
    };
  }

  if (typeof image === "string" && image.length > 0) {
    return {
      url: toAbsoluteUrl(image, site),
      width: SEO.imageWidth,
      height: SEO.imageHeight,
      type: inferImageType(image),
      kind: "explicit" as const,
    };
  }

  const generatedImagePath = resolveGeneratedImagePath(generatedImage, pathname);
  if (generatedImagePath) {
    return {
      url: toAbsoluteUrl(generatedImagePath, site),
      width: SEO.imageWidth,
      height: SEO.imageHeight,
      type: inferImageType(generatedImagePath),
      kind: "generated" as const,
    };
  }

  return {
    url: toAbsoluteUrl(SEO.defaultImagePath, site),
    width: SEO.imageWidth,
    height: SEO.imageHeight,
    type: inferImageType(SEO.defaultImagePath),
    kind: "default" as const,
  };
}

export function getOgImagePath(pathname: string) {
  const cleaned = pathname.replace(/^\/+|\/+$/g, "");
  return `/og/${cleaned || "home"}.png`;
}

function formatTitle(title: string, pathname: string) {
  if (pathname === "/" && title.trim().toLowerCase() === "home") {
    return SEO.defaultTitle;
  }

  if (pathname === "/") {
    return title;
  }

  return SEO.titleTemplate.replace("%s", title);
}

function buildJsonLd(input: SeoInput, resolved: Omit<ResolvedSeo, "jsonLd">) {
  const pageSchema =
    input.kind === "blog"
      ? {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: input.title,
          description: resolved.description,
          image: [resolved.image],
          datePublished: resolved.publishedTime,
          dateModified: resolved.modifiedTime ?? resolved.publishedTime,
          keywords: resolved.tags,
          mainEntityOfPage: resolved.canonicalUrl,
          author: {
            "@type": "Person",
            name: SEO.siteName,
          },
          publisher: {
            "@type": "Organization",
            name: SEO.siteName,
          },
        }
      : input.kind === "project"
        ? {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: input.title,
            description: resolved.description,
            image: [resolved.image],
            datePublished: resolved.publishedTime,
            keywords: resolved.tags,
            url: resolved.canonicalUrl,
            author: {
              "@type": "Person",
              name: SEO.siteName,
            },
          }
        : {
            "@context": "https://schema.org",
            "@type": pathnameToSchemaType(input.pathname),
            name: input.title,
            description: resolved.description,
            url: resolved.canonicalUrl,
            image: [resolved.image],
            isPartOf: {
              "@type": "WebSite",
              name: SEO.siteName,
              url: input.site.toString(),
            },
          };

  if (input.pathname === "/") {
    return [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SEO.siteName,
        description: SEO.defaultDescription,
        url: input.site.toString(),
      },
      pageSchema,
    ];
  }

  return [pageSchema];
}

function pathnameToSchemaType(pathname: string) {
  if (pathname === "/contact") return "ContactPage";
  if (pathname === "/about") return "AboutPage";
  if (pathname === "/search") return "SearchResultsPage";
  return "WebPage";
}

export function resolveSeo(input: SeoInput): ResolvedSeo {
  const description = input.description?.trim() || SEO.defaultDescription;
  const image = resolveImage(
    input.image,
    input.generatedImage,
    input.pathname,
    input.site,
  );
  const title = formatTitle(input.title, input.pathname);
  const canonicalUrl = toAbsoluteUrl(input.pathname, input.site);
  const imageAlt =
    input.imageAlt?.trim() ||
    (image.kind === "default"
      ? SEO.defaultImageAlt
      : `${input.title} social sharing image`);

  const resolvedBase = {
    title,
    description,
    canonicalUrl,
    type: input.type ?? (input.kind === "blog" ? "article" : "website"),
    image: image.url,
    imageAlt,
    imageWidth: image.width,
    imageHeight: image.height,
    imageType: image.type,
    noindex: input.noindex ?? false,
    locale: SEO.locale,
    publishedTime: input.publishedTime?.toISOString(),
    modifiedTime: input.modifiedTime?.toISOString(),
    tags: input.tags ?? [],
  };

  return {
    ...resolvedBase,
    jsonLd: buildJsonLd(input, resolvedBase),
  };
}
