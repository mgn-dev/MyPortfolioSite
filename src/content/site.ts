export type SocialIconName =
  | "twitter"
  | "youtube"
  | "linkedin"
  | "github"
  | "instagram";

export type SiteSocial = {
  href: string;
  label: string;
  icon: SocialIconName;
};

export type SiteProject = {
  title: string;
  description: string;
  url: string;
  /** Subtle gradient tint on placeholder artwork */
  accent: string;
};

export const site = {
  name: "Alex Morgan",
  role: "Designer & Front-end developer",
  bio: "I craft calm, readable interfaces and ship thoughtful web experiences. Currently freelancing and exploring creative tooling.",
  initials: "AM",
  socials: [
    { href: "https://twitter.com", label: "X / Twitter", icon: "twitter" },
    { href: "https://youtube.com", label: "YouTube", icon: "youtube" },
    { href: "https://linkedin.com", label: "LinkedIn", icon: "linkedin" },
    { href: "https://github.com", label: "GitHub", icon: "github" },
  ] satisfies SiteSocial[],
  projects: [
    {
      title: "Northwind Studio",
      description:
        "Brand and marketing site for a small product studio—typography-led layouts and a modular component system.",
      url: "#",
      accent: "#6366f1",
    },
    {
      title: "Ledgerbooks",
      description:
        "SaaS dashboard UI exploration focused on dense data, keyboard flows, and accessible charts.",
      url: "#",
      accent: "#0ea5e9",
    },
    {
      title: "Atlas Reader",
      description:
        "Minimal reading app marketing page with fluid type scales and a restrained monochrome palette.",
      url: "#",
      accent: "#22c55e",
    },
  ] satisfies SiteProject[],
};
