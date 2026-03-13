import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import rehypeUnwrap from "rehype-unwrap-images";
import solidJs from "@astrojs/solid-js";

const isVercel =
  process.env.DEPLOY_TARGET === "vercel" ||
  process.env.VERCEL === "1" ||
  process.env.VERCEL === "true" ||
  Boolean(process.env.VERCEL_URL);

const vercelSiteUrl =
  process.env.VERCEL_BRANCH_URL ||
  process.env.VERCEL_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL;

export default defineConfig({
  site:
    process.env.SITE_URL ??
    (vercelSiteUrl ? `https://${vercelSiteUrl}` : "https://example.com"),
  output: isVercel ? "server" : "static",
  adapter: isVercel ? vercel() : undefined,
  integrations: [
    mdx({ rehypePlugins: [rehypeUnwrap] }),
    sitemap(),
    solidJs(),
  ],
});
