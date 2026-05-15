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

export type ProjectStatus = "live" | "staging";
export type ProjectInvolvement = "gen-ai" | "human" | "both";

export type SiteProject = {
  title: string;
  tech: string;
  status: ProjectStatus;
  involvement: ProjectInvolvement;
  githubUrl?: string;
  imageSrc?: string;
  url?: string;
  description?: string;
  /** Subtle gradient tint on placeholder artwork */
  accent?: string;
};

export type ProjectGroupId = "software-engineering" | "cybersecurity";

export type SiteProjectGroup = {
  id: ProjectGroupId;
  label: string;
  projects: SiteProject[];
};

export const site = {
  name: "Mojalefa Gideon Nkwana",
  role: "Software | Cybersecurity",
  bio: "I craft calm, readable interfaces and ship thoughtful web experiences. Currently freelancing and exploring creative tooling.",
  initials: "MN",
  socials: [
    { href: "https://twitter.com", label: "X / Twitter", icon: "twitter" },
    { href: "https://youtube.com", label: "YouTube", icon: "youtube" },
    { href: "https://linkedin.com", label: "LinkedIn", icon: "linkedin" },
    { href: "https://github.com", label: "GitHub", icon: "github" },
  ] satisfies SiteSocial[],
  projectGroups: [
    {
      id: "software-engineering",
      label: "SOFTWARE ENGINEERING",
      projects: [
        {
          title: "Northwind Studio",
          tech: "Next.js",
          status: "live",
          involvement: "human",
          githubUrl: "#",
          description:
            "Brand and marketing site for a small product studio—typography-led layouts and a modular component system.",
          url: "#",
          accent: "#6366f1",
        },
        {
          title: "Ledgerbooks",
          tech: "React",
          status: "live",
          involvement: "both",
          githubUrl: "#",
          description:
            "SaaS dashboard UI exploration focused on dense data, keyboard flows, and accessible charts.",
          url: "#",
          accent: "#0ea5e9",
        },
        {
          title: "Atlas Reader",
          tech: "TypeScript",
          status: "staging",
          involvement: "gen-ai",
          githubUrl: "#",
          description:
            "Minimal reading app marketing page with fluid type scales and a restrained monochrome palette.",
          url: "#",
          accent: "#22c55e",
        },
      ],
    },
    {
      id: "cybersecurity",
      label: "CYBERSECURITY",
      projects: [],
    },
  ] satisfies SiteProjectGroup[],
};
