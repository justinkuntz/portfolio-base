import type {
  Site,
  Page,
  Links,
  Metadata,
  Socials,
  HomepageProjects,
  GridListing,
  ProtectedProjectsConfig,
} from "@types";

export const SITE: Site = {
  NAME: "Grogu",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOMEPAGE_PROJECTS: HomepageProjects = {
  LAYOUT: "waterfall",
  GRID_COLUMNS: 3,
};

export const PROJECTS_LISTING: GridListing = {
  GRID_COLUMNS: 2,
};

export const BLOG_LISTING: GridListing = {
  GRID_COLUMNS: 3,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "A portfolio starter with Grogu-flavored placeholder content and room for your own story.",
};

export const ABOUT: Metadata = {
  TITLE: "About",
  DESCRIPTION: "A playful placeholder biography for Grogu on the road to becoming a Mandalorian.",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "Starter guides, field notes, and sample documentation from Grogu's training archive.",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION: "Case studies, experiments, and missions completed on Grogu's path to the forge.",
};

export const CONTACT: Metadata = {
  TITLE: "Contact",
  DESCRIPTION: "A contact page template for missions, collaborations, and quiet transmissions to the covert.",
};

export const PROTECTED_PROJECTS: ProtectedProjectsConfig = {
  EYEBROW: "",
  TITLE: "Password Protected Content",
  DESCRIPTION:
    "This content contains confidential information. Please log in to gain access.",
  NDA_TEXT: "terms of the NDA",
  NDA_HREF: "/legal/nda",
  LOGIN_TAB_TEXT: "Log in",
  REQUEST_TAB_TEXT: "Request Access",
  EMAIL_LABEL: "Email",
  EMAIL_PLACEHOLDER: "Enter your email",
  PASSWORD_LABEL: "Password",
  PASSWORD_PLACEHOLDER: "Enter your password",
  LOGIN_SUBMIT_TEXT: "Unlock Content",
  LOGIN_FOOTER_PREFIX: "Looking for access?",
  LOGIN_FOOTER_ACTION_TEXT: "Request Access",
  REQUEST_MESSAGE_LABEL: "Message",
  REQUEST_MESSAGE_PLACEHOLDER: "Details about why you would like access...",
  REQUEST_SUBMIT_TEXT: "Request Access",
  REQUEST_FOOTER_PREFIX: "Already have a password?",
  REQUEST_FOOTER_ACTION_TEXT: "Log in",
};

// Search Page
export const SEARCH: Page = {
  TITLE: "Search",
  DESCRIPTION: "Search posts and projects by keyword.",
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
  {
    TEXT: "Contact",
    HREF: "/contact",
  },
];

export const SOCIALS: Socials = [
  {
    NAME: "twitter-x",
    ICON: "twitter-x",
    HREF: "https://twitter.com/your_handle",
  },
  {
    NAME: "github",
    ICON: "github",
    HREF: "https://github.com/your-handle",
  },
  {
    NAME: "linkedin",
    ICON: "linkedin",
    HREF: "https://www.linkedin.com/in/your-handle/",
  },
];
