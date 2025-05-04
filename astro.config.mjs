import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import rehypeUnwrap from "rehype-unwrap-images";
import solidJs from "@astrojs/solid-js";
import fuse from "astro-fuse";

export default defineConfig({
  site: "https://astro-nano-demo.vercel.app",
  integrations: [
    mdx({ rehypePlugins: [rehypeUnwrap] }),
    tailwind(),
    sitemap(),
    solidJs(),
    fuse(),
  ],
});