import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Public Sans", ...defaultTheme.fontFamily.sans],
        serif: ["Lora", ...defaultTheme.fontFamily.serif],
      },
      maxWidth: {
                "8xl": "124rem",
                "readable": "65ch"
      },
      textColor: {
        primary: "rgb(from var(--color-primary) r g b / <alpha-value>)",
        secondary: "rgb(from var(--color-secondary) r g b / <alpha-value>)",
        surface: "rgb(from var(--color-surface-50) r g b  / <alpha-value>)",
        surface1: "rgb(from var(--color-surface-100) r g b  / <alpha-value>)",
        surface2: "rgb(from var(--color-surface-200) r g b  / <alpha-value>)",
        surface3: "rgb(from var(--color-surface-300) r g b  / <alpha-value>)",
        surface4: "rgb(from var(--color-surface-400) r g b  / <alpha-value>)",
        surface5: "rgb(from var(--color-surface-500) r g b  / <alpha-value>)",
        surface6: "rgb(from var(--color-surface-600) r g b  / <alpha-value>)",
        surface7: "rgb(from var(--color-surface-700) r g b  / <alpha-value>)",
        surface8: "rgb(from var(--color-surface-800) r g b  / <alpha-value>)",
        surface9: "rgb(from var(--color-surface-900) r g b  / <alpha-value>)",
        surface10: "rgb(from var(--color-surface-950) r g b / <alpha-value>)"
      },
      backgroundColor: {
        primary: "rgb(from var(--color-primary) r g b  / <alpha-value>)",
        secondary: "rgb(from var(--color-secondary) r g b  / <alpha-value>)",
        surface: "rgb(from var(--color-surface-50) r g b  / <alpha-value>)",
        surface1: "rgb(from var(--color-surface-100) r g b  / <alpha-value>)",
        surface2: "rgb(from var(--color-surface-200) r g b  / <alpha-value>)",
        surface3: "rgb(from var(--color-surface-300) r g b  / <alpha-value>)",
        surface4: "rgb(from var(--color-surface-400) r g b  / <alpha-value>)",
        surface5: "rgb(from var(--color-surface-500) r g b  / <alpha-value>)",
        surface6: "rgb(from var(--color-surface-600) r g b  / <alpha-value>)",
        surface7: "rgb(from var(--color-surface-700) r g b  / <alpha-value>)",
        surface8: "rgb(from var(--color-surface-800) r g b  / <alpha-value>)",
        surface9: "rgb(from var(--color-surface-900) r g b  / <alpha-value>)",
        surface10: "rgb(from var(--color-surface-950) r g b / <alpha-value>)",
      },
      borderColor: {
        primary: "rgb(from var(--color-primary) r g b / <alpha-value>)",
        secondary: "rgb(from var(--color-secondary) r g b / <alpha-value>)",
        surface: "rgb(from var(--color-surface-50) r g b  / <alpha-value>)",
        surface1: "rgb(from var(--color-surface-100) r g b  / <alpha-value>)",
        surface2: "rgb(from var(--color-surface-200) r g b  / <alpha-value>)",
        surface3: "rgb(from var(--color-surface-300) r g b  / <alpha-value>)",
        surface4: "rgb(from var(--color-surface-400) r g b  / <alpha-value>)",
        surface5: "rgb(from var(--color-surface-500) r g b  / <alpha-value>)",
        surface6: "rgb(from var(--color-surface-600) r g b  / <alpha-value>)",
        surface7: "rgb(from var(--color-surface-700) r g b  / <alpha-value>)",
        surface8: "rgb(from var(--color-surface-800) r g b  / <alpha-value>)",
        surface9: "rgb(from var(--color-surface-900) r g b  / <alpha-value>)",
        surface10: "rgb(from var(--color-surface-950) r g b / <alpha-value>)"
      },
      colors: {
        primary: "rgb(from var(--color-primary) r g b / <alpha-value>)",
        secondary: "rgb(from var(--color-secondary) r g b / <alpha-value>)",
        surface: "rgb(from var(--color-surface-50) r g b  / <alpha-value>)",
        surface1: "rgb(from var(--color-surface-100) r g b  / <alpha-value>)",
        surface2: "rgb(from var(--color-surface-200) r g b  / <alpha-value>)",
        surface3: "rgb(from var(--color-surface-300) r g b  / <alpha-value>)",
        surface4: "rgb(from var(--color-surface-400) r g b  / <alpha-value>)",
        surface5: "rgb(from var(--color-surface-500) r g b  / <alpha-value>)",
        surface6: "rgb(from var(--color-surface-600) r g b  / <alpha-value>)",
        surface7: "rgb(from var(--color-surface-700) r g b  / <alpha-value>)",
        surface8: "rgb(from var(--color-surface-800) r g b  / <alpha-value>)",
        surface9: "rgb(from var(--color-surface-900) r g b  / <alpha-value>)",
        surface10: "rgb(from var(--color-surface-950) r g b / <alpha-value>)"
      },
      typography: (theme) => ({
        crow: {
            css: {
                "--tw-prose-body": theme("textColor.surface10 / 100%"),
                "--tw-prose-headings": theme("textColor.surface10 / 100%"),
                "--tw-prose-lead": theme("textColor.surface10 / 100%"),
                "--tw-prose-links": theme("textColor.surface10 / 100%"),
                "--tw-prose-bold": theme("textColor.surface10 / 100%"),
                "--tw-prose-counters": theme("textColor.surface10 / 100%"),
                "--tw-prose-bullets": theme("textColor.surface10 / 100%"),
                "--tw-prose-hr": theme("borderColor.surface10 / 100%"),
                "--tw-prose-quotes": theme("textColor.surface10 / 100%"),
                "--tw-prose-quote-borders": theme("borderColor.surface10 / 100%"),
                "--tw-prose-captions": theme("textColor.surface10 / 100%"),
                "--tw-prose-code": theme("textColor.surface10 / 100%"),
                "--tw-prose-pre-code": theme("colors.zinc.100"),
                "--tw-prose-pre-bg": theme("colors.zinc.800"),
                "--tw-prose-th-borders": theme("borderColor.surface10 / 100%"),
                "--tw-prose-td-borders": theme("borderColor.surface10 / 100%")
            }
        },
        DEFAULT: {
            css: {
                a: {
                    fontWeight: "normal",
                    textDecoration: "underline",
                    textDecorationStyle: "dashed",
                    textDecorationThickness: "1px",
                    textUnderlineOffset: "2px",
                    "&:hover": {
                        textDecorationStyle: "solid"
                    }
                },
                "h1,h2,h3,h4,h5,h6": {
                    fontFamily: theme("fontFamily.sans"),
                    fontWeight: 500
                },
                blockquote: {
                    border: 0,
                    fontFamily: theme("fontFamily.sans"),
                    fontSize: "1.3125em",
                    fontStyle: "italic",
                    fontWeight: "normal",
                    lineHeight: 1.4,
                    paddingLeft: 0,
                    "@media (min-width: theme(\"screens.sm\"))": {
                        fontSize: "1.66667em",
                        lineHeight: 1.3
                    }
                }
            }
        },
        lg: {
            css: {
                blockquote: {
                    paddingLeft: 0
                }
            }
        }
      }),      
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
