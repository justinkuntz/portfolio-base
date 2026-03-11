import { SITE, HOME } from "@consts";

export const SEO = {
  siteName: SITE.NAME,
  titleTemplate: "%s | " + SITE.NAME,
  defaultTitle: SITE.NAME,
  defaultDescription: HOME.DESCRIPTION,
  locale: "en_US",
  twitterCard: "summary_large_image",
  twitterHandle: "",
  defaultImagePath: "/og/site.png",
  defaultImageAlt: SITE.NAME + " default social sharing image",
  imageWidth: 1200,
  imageHeight: 630,
} as const;
