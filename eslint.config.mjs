import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginAstro from "eslint-plugin-astro";
import globals from "globals";

export default tseslint.config(
  {
    ignores: [".astro/", ".vscode/", "dist/", "node_modules/", "public/"],
  },
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  ...eslintPluginAstro.configs["jsx-a11y-recommended"],
  {
    rules: {
      semi: ["error", "always"],
      quotes: ["error", "double", { allowTemplateLiterals: true, avoidEscape: true }],
      "@typescript-eslint/triple-slash-reference": "off",
    },
  }
);
