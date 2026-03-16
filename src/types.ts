export type Site = {
  NAME: string;
  NUM_POSTS_ON_HOMEPAGE: number;
  NUM_PROJECTS_ON_HOMEPAGE: number;
};

export type GridColumns = 1 | 2 | 3 | 4;

export type HomepageProjects = {
  LAYOUT: "waterfall" | "grid";
  GRID_COLUMNS: GridColumns;
};

export type GridListing = {
  GRID_COLUMNS: GridColumns;
};

export type ProtectedProjectsConfig = {
  EYEBROW: string;
  TITLE: string;
  DESCRIPTION: string;
  NDA_TEXT: string;
  NDA_HREF: string;
  LOGIN_TAB_TEXT: string;
  REQUEST_TAB_TEXT: string;
  EMAIL_LABEL: string;
  EMAIL_PLACEHOLDER: string;
  PASSWORD_LABEL: string;
  PASSWORD_PLACEHOLDER: string;
  LOGIN_SUBMIT_TEXT: string;
  LOGIN_FOOTER_PREFIX: string;
  LOGIN_FOOTER_ACTION_TEXT: string;
  REQUEST_MESSAGE_LABEL: string;
  REQUEST_MESSAGE_PLACEHOLDER: string;
  REQUEST_SUBMIT_TEXT: string;
  REQUEST_FOOTER_PREFIX: string;
  REQUEST_FOOTER_ACTION_TEXT: string;
};

export type Metadata = {
  TITLE: string;
  DESCRIPTION: string;
};

export type Links = {
  TEXT: string
  HREF: string
}[];

export type Socials = {
  NAME: string;
  ICON: string;
  HREF: string;
}[];

export type Page = {
  TITLE: string;
  DESCRIPTION: string;
};

export type OptimizedImage = {
  src: string;
  srcset: string;
  sizes: string;
  width: number;
  height: number;
};

export type ProjectCardEntry = {
  slug: string;
  title: string;
  tags: string[];
  thumbNailAlt: string;
  image: OptimizedImage;
};
