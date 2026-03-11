export type MediaLayout = "contained" | "full-bleed";

export type MediaVariantConfig = {
  widths: number[];
  sizes: string;
  quality: number;
};

export type HeroMediaConfig = MediaVariantConfig & {
  layout: MediaLayout;
  aspectRatio: string;
};

export type ThumbnailMediaConfig = MediaVariantConfig & {
  aspectRatio: string;
};

export const MEDIA: {
  projectHero: Omit<HeroMediaConfig, "sizes"> & {
    sizesContained: string;
    sizesFullBleed: string;
  };
  homepageProjectThumbnail: ThumbnailMediaConfig;
  projectThumbnail: ThumbnailMediaConfig;
  mdxImage: MediaVariantConfig;
} = {
  projectHero: {
    layout: "contained",
    aspectRatio: "5 / 4",
    widths: [640, 960, 1280, 1600],
    sizesContained: "(max-width: 767px) 100vw, min(92vw, 80rem)",
    sizesFullBleed: "100vw",
    quality: 76,
  },
  homepageProjectThumbnail: {
    aspectRatio: "2 / 1",
    widths: [480, 768, 1024, 1440],
    sizes: "(max-width: 767px) 100vw, (max-width: 1279px) min(92vw, 72rem), 72rem",
    quality: 72,
  },
  projectThumbnail: {
    aspectRatio: "4 / 3",
    widths: [480, 768, 1024, 1440],
    sizes: "(max-width: 767px) 100vw, (max-width: 1279px) min(92vw, 72rem), 72rem",
    quality: 72,
  },
  mdxImage: {
    widths: [480, 768, 1024, 1440, 1920],
    sizes: "(max-width: 768px) 100vw, (max-width: 1280px) min(92vw, 64rem), 64rem",
    quality: 72,
  },
};

export function getProjectHeroSizes() {
  return MEDIA.projectHero.layout === "full-bleed"
    ? MEDIA.projectHero.sizesFullBleed
    : MEDIA.projectHero.sizesContained;
}
