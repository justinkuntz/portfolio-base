export const BRAND_THEMES = {
  default: {
    label: "Default",
    description: "Sans-forward, rounded, and soft-edged.",
  },
  serif: {
    label: "Serif",
    description: "Editorial, square, and warmer-toned.",
  },
} as const;

export type BrandThemeId = keyof typeof BRAND_THEMES;

export const THEME = {
  BRAND: "default" as BrandThemeId,
  COLOR_MODE_STORAGE_KEY: "theme",
};
