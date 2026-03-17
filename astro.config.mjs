import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import rehypeUnwrap from "rehype-unwrap-images";
import solidJs from "@astrojs/solid-js";
import { fileURLToPath } from "node:url";

const viteEnvPath = fileURLToPath(new URL("./node_modules/vite/dist/client/env.mjs", import.meta.url));
const viteClientPath = fileURLToPath(new URL("./node_modules/vite/dist/client/client.mjs", import.meta.url));

const isVercel =
  process.env.DEPLOY_TARGET === "vercel" ||
  process.env.VERCEL === "1" ||
  process.env.VERCEL === "true" ||
  Boolean(process.env.VERCEL_URL);

const vercelSiteUrl =
  process.env.VERCEL_BRANCH_URL ||
  process.env.VERCEL_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL;

const deployTarget = process.env.DEPLOY_TARGET ?? (isVercel ? "vercel" : "node");
const isServerTarget = deployTarget === "vercel" || deployTarget === "node";

export default defineConfig({
  site:
    process.env.SITE_URL ??
    (vercelSiteUrl ? `https://${vercelSiteUrl}` : "https://example.com"),
  output: isServerTarget ? "server" : "static",
  adapter:
    deployTarget === "vercel"
      ? vercel()
      : deployTarget === "node"
        ? node({ mode: "standalone" })
        : undefined,
  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      defaultColor: "light",
    },
  },
  integrations: [
    mdx({ rehypePlugins: [rehypeUnwrap] }),
    sitemap(),
    solidJs(),
  ],
  vite: {
    plugins: [
      {
        name: "resolve-vite-client-imports",
        enforce: "pre",
        resolveId(source) {
          if (source === "@vite/env" || source === "/@vite/env") {
            return viteEnvPath;
          }

          if (source === "@vite/client" || source === "/@vite/client") {
            return viteClientPath;
          }

          return null;
        },
      },
    ],
    resolve: {
      alias: [
        {
          // Some local Astro/Vite dev environments fail to resolve Vite's
          // internal virtual client imports unless they are mapped explicitly.
          find: /^\/?@vite\/env$/,
          replacement: viteEnvPath,
        },
        {
          find: /^\/?@vite\/client$/,
          replacement: viteClientPath,
        },
      ],
    },
  },
});
