import { getImage } from "astro:assets";
import type { CollectionEntry } from "astro:content";
import { MEDIA } from "@config/media";
import type { OptimizedImage, ProjectCardEntry } from "@types";

async function getOptimizedImage(src: CollectionEntry<"projects">["data"]["thumbNail"]): Promise<OptimizedImage> {
  const image = await getImage({
    src,
    widths: [...MEDIA.projectThumbnail.widths],
    sizes: MEDIA.projectThumbnail.sizes,
    format: "webp",
    quality: MEDIA.projectThumbnail.quality,
  });

  return {
    src: image.src,
    srcset: image.srcSet.attribute,
    sizes: MEDIA.projectThumbnail.sizes,
    width: Number(image.attributes.width),
    height: Number(image.attributes.height),
  };
}

export async function toProjectCardEntry(
  project: CollectionEntry<"projects">
): Promise<ProjectCardEntry> {
  return {
    slug: project.slug,
    title: project.data.title,
    tags: project.data.tags,
    thumbNailAlt: project.data.thumbNailAlt,
    image: await getOptimizedImage(project.data.thumbNail),
  };
}

export async function toProjectCardEntries(
  projects: CollectionEntry<"projects">[]
): Promise<ProjectCardEntry[]> {
  return Promise.all(projects.map((project) => toProjectCardEntry(project)));
}
