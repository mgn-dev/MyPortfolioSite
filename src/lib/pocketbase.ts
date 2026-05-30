import {
  site as staticSite,
  type ProjectGroupId,
  type SiteProject,
  type SiteProjectGroup,
  type SiteSocial,
} from "@/content/site";

export type {
  ProjectGroupId,
  ProjectInvolvement,
  ProjectStatus,
  SiteProject,
  SiteProjectGroup,
  SiteSocial,
  SocialIconName,
} from "@/content/site";

export type SiteContent = {
  name: string;
  role: string;
  bio: string;
  initials: string;
  profileImageUrl?: string;
  contactEmail?: string;
  contactWhatsapp?: string;
  socials: SiteSocial[];
  projectGroups: SiteProjectGroup[];
};

const GROUP_LABELS: Record<ProjectGroupId, string> = {
  "software-engineering": "SOFTWARE ENGINEERING",
  cybersecurity: "CYBERSECURITY",
};

const GROUP_ORDER: ProjectGroupId[] = ["software-engineering", "cybersecurity"];

type PbFileField = string;

type PbSiteProfile = {
  id: string;
  collectionId: string;
  name: string;
  role?: string;
  bio?: string;
  initials?: string;
  profileImage?: PbFileField;
  contactEmail?: string;
  contactWhatsapp?: string;
};

type PbSocial = {
  href: string;
  label: string;
  icon: SiteSocial["icon"];
  sort?: number;
  /** When false, the link is hidden on the site. Omitted or true = visible. */
  enabled?: boolean;
};

type PbProject = {
  title: string;
  techStack?: string[];
  status: SiteProject["status"];
  involvement: SiteProject["involvement"];
  githubUrl?: string;
  url?: string;
  description?: string;
  accent?: string;
  image?: PbFileField;
  category: ProjectGroupId;
  sort?: number;
  id: string;
  collectionId: string;
};

type PbListResponse<T> = {
  items: T[];
};

/** Server-side API base (prefer internal HTTP URL in Docker). */
function getServerBaseUrl(): string | undefined {
  const url = (
    process.env.POCKETBASE_URL || process.env.NEXT_PUBLIC_POCKETBASE_URL
  )?.replace(/\/$/, "");
  return url || undefined;
}

/** Public base for file URLs shown in the browser. */
function getPublicBaseUrl(): string | undefined {
  const url = process.env.NEXT_PUBLIC_POCKETBASE_URL?.replace(/\/$/, "");
  return url || getServerBaseUrl();
}

export function fileUrl(
  baseUrl: string,
  record: { collectionId: string; id: string },
  filename: string | undefined,
): string | undefined {
  if (!filename) return undefined;
  return `${baseUrl}/api/files/${record.collectionId}/${record.id}/${filename}`;
}

function staticFallback(): SiteContent {
  return {
    name: staticSite.name,
    role: staticSite.role,
    bio: staticSite.bio,
    initials: staticSite.initials,
    contactEmail: "hello@example.com",
    contactWhatsapp: "",
    socials: staticSite.socials,
    projectGroups: staticSite.projectGroups,
  };
}

async function pbGetList<T>(
  baseUrl: string,
  collection: string,
  sort = "",
): Promise<T[]> {
  const params = new URLSearchParams({ perPage: "500" });
  if (sort) params.set("sort", sort);

  const res = await fetch(
    `${baseUrl}/api/collections/${collection}/records?${params}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    throw new Error(`PocketBase ${collection}: ${res.status}`);
  }

  const data = (await res.json()) as PbListResponse<T>;
  return data.items ?? [];
}

function mapProject(baseUrl: string, row: PbProject): SiteProject {
  return {
    title: row.title,
    techStack: Array.isArray(row.techStack) ? row.techStack : [],
    status: row.status,
    involvement: row.involvement,
    githubUrl: row.githubUrl || undefined,
    url: row.url || undefined,
    description: row.description || undefined,
    accent: row.accent || undefined,
    imageSrc: fileUrl(baseUrl, row, row.image),
  };
}

function buildProjectGroups(
  baseUrl: string,
  projects: PbProject[],
): SiteProjectGroup[] {
  const byCategory = new Map<ProjectGroupId, SiteProject[]>();

  for (const id of GROUP_ORDER) {
    byCategory.set(id, []);
  }

  const sorted = [...projects].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));

  for (const row of sorted) {
    const list = byCategory.get(row.category);
    if (list) list.push(mapProject(baseUrl, row));
  }

  return GROUP_ORDER.map((id) => ({
    id,
    label: GROUP_LABELS[id],
    projects: byCategory.get(id) ?? [],
  }));
}

export async function getSiteContent(): Promise<SiteContent> {
  const serverUrl = getServerBaseUrl();
  const publicUrl = getPublicBaseUrl();
  if (!serverUrl || !publicUrl) {
    return staticFallback();
  }

  try {
    const [profiles, socials, projects] = await Promise.all([
      pbGetList<PbSiteProfile>(serverUrl, "site_profile"),
      pbGetList<PbSocial & { id: string }>(serverUrl, "socials", "sort"),
      pbGetList<PbProject>(serverUrl, "projects", "sort"),
    ]);

    const profile = profiles[0];

    if (!profile) {
      console.warn(
        "[pocketbase] No site_profile record; using static fallback",
      );
      return staticFallback();
    }

    return {
      name: profile.name,
      role: profile.role ?? staticSite.role,
      bio: profile.bio ?? staticSite.bio,
      initials: profile.initials ?? staticSite.initials,
      profileImageUrl: fileUrl(publicUrl, profile, profile.profileImage),
      contactEmail: profile.contactEmail || undefined,
      contactWhatsapp: profile.contactWhatsapp || undefined,
      socials: socials
        .filter((s) => s.enabled !== false)
        .map((s) => ({
          href: s.href,
          label: s.label,
          icon: s.icon,
        })),
      projectGroups: buildProjectGroups(publicUrl, projects),
    };
  } catch (err) {
    console.error("[pocketbase] fetch failed:", err);
    return staticFallback();
  }
}

/** Server-only: contact fields for API routes (no ISR cache dependency). */
export async function getContactSettings(): Promise<{
  contactEmail?: string;
  contactWhatsapp?: string;
}> {
  const serverUrl = getServerBaseUrl();
  if (!serverUrl) {
    const fallback = staticFallback();
    return {
      contactEmail: fallback.contactEmail,
      contactWhatsapp: fallback.contactWhatsapp,
    };
  }

  try {
    const profiles = await pbGetList<PbSiteProfile>(serverUrl, "site_profile");
    const profile = profiles[0];
    return {
      contactEmail: profile?.contactEmail || undefined,
      contactWhatsapp: profile?.contactWhatsapp || undefined,
    };
  } catch {
    const fallback = staticFallback();
    return {
      contactEmail: fallback.contactEmail,
      contactWhatsapp: fallback.contactWhatsapp,
    };
  }
}
