import type { Site, Page, Links, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "Popeye the Sailor",
  EMAIL: "popeyethesailor234@gmail.com",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_WORKS_ON_HOMEPAGE: 3,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "Astro Nano is a minimal and lightweight blog and portfolio.",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "A collection of articles on topics I am passionate about.",
};

export const WORK: Metadata = {
  TITLE: "Work",
  DESCRIPTION: "Where I have worked and what I have done.",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION: "A collection of my projects, with links to repositories and demos.",
};

// Search Page
export const SEARCH: Page = {
  TITLE: "Search",
  DESCRIPTION: "Search all posts and projects by keyword.",
};

// Links
export const LINKS: Links = [
  { 
    TEXT: "About", 
    HREF: "/about", 
  },
  { 
    TEXT: "Projects", 
    HREF: "/projects", 
  },
  { 
    TEXT: "Blog", 
    HREF: "/blog", 
  },
];

export const SOCIALS: Socials = [
  { 
    NAME: "twitter-x",
    ICON: "twitter-x",
    TEXT: "pope_the_sailor",
    HREF: "https://twitter.com/pope_the_sailor",
  },
  { 
    NAME: "github",
    ICON: "github",
    TEXT: "popeye-the-sailor",
    HREF: "https://github.com/popeyeTheSailor",
  },
  { 
    NAME: "linkedin",
    ICON: "linkedin",
    TEXT: "popeye-the-sailor",
    HREF: "https://www.linkedin.com/in/popeye-the-sailor/",
    
  }
];
