import { getImage } from "astro:assets";
import type { CollectionEntry } from "astro:content";
import { MEDIA } from "@config/media";
import type { OptimizedImage, ProjectCardEntry } from "@types";

type ProjectCardImageVariant = "homepage" | "project";

function getProjectCardMedia(variant: ProjectCardImageVariant) {
  return variant === "homepage"
    ? MEDIA.homepageProjectThumbnail
    : MEDIA.projectThumbnail;
}

async function getOptimizedImage(
  src: CollectionEntry<"projects">["data"]["thumbNail"],
  variant: ProjectCardImageVariant
): Promise<OptimizedImage> {
  const media = getProjectCardMedia(variant);
  const image = await getImage({
    src,
    widths: [...media.widths],
    sizes: media.sizes,
    format: "webp",
    quality: media.quality,
  });

  return {
    src: image.src,
    srcset: image.srcSet.attribute,
    sizes: media.sizes,
    width: Number(image.attributes.width),
    height: Number(image.attributes.height),
  };
}

export async function toProjectCardEntry(
  project: CollectionEntry<"projects">,
  variant: ProjectCardImageVariant = "project"
): Promise<ProjectCardEntry> {
  return {
    slug: project.id,
    title: project.data.title,
    tags: project.data.tags,
    thumbNailAlt: project.data.thumbNailAlt,
    image: await getOptimizedImage(project.data.thumbNail, variant),
  };
}

export async function toProjectCardEntries(
  projects: CollectionEntry<"projects">[],
  variant: ProjectCardImageVariant = "project"
): Promise<ProjectCardEntry[]> {
  return Promise.all(projects.map((project) => toProjectCardEntry(project, variant)));
}
