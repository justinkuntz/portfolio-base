export type Site = {
  NAME: string;
  NUM_POSTS_ON_HOMEPAGE: number;
  NUM_PROJECTS_ON_HOMEPAGE: number;
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
