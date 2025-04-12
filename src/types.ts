export type Site = {
  NAME: string;
  EMAIL: string;
  NUM_POSTS_ON_HOMEPAGE: number;
  NUM_WORKS_ON_HOMEPAGE: number;
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
  TEXT: string
  HREF: string;
}[];

export type Page = {
  TITLE: string;
  DESCRIPTION: string;
};