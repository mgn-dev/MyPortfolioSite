import Image from "next/image";
import { Camera } from "lucide-react";
import { SocialIcon } from "@/components/portfolio/social-icons";
import type { SiteContent, SiteSocial } from "@/lib/pocketbase";

const socialLinkClassName =
  "inline-flex size-11 shrink-0 touch-manipulation items-center justify-center rounded-full border border-transparent text-heading transition-colors active:bg-input hover:border-border-subtle hover:bg-input sm:size-10";

function socialIconSize(icon: SiteSocial["icon"]): string {
  if (icon === "reddit") return "size-6";
  if (icon === "github") return "size-5.5";
  if (icon === "twitter") return "size-4.5";
  return "size-5";
}

function SocialLink({ social }: { social: SiteSocial }) {
  return (
    <a
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={social.label}
      className={socialLinkClassName}
    >
      <SocialIcon
        name={social.icon}
        className={socialIconSize(social.icon)}
      />
    </a>
  );
}

function socialRows(socials: SiteSocial[]): SiteSocial[][] {
  const count = socials.length;
  if (count > 4 && count % 2 === 0) {
    const half = count / 2;
    return [socials.slice(0, half), socials.slice(half)];
  }
  return [socials];
}

function ProfileAvatar({ site }: { site: SiteContent }) {
  const className =
    "relative flex size-14 shrink-0 overflow-hidden rounded-full bg-input text-heading shadow-sm ring-1 ring-border-subtle sm:size-20";

  if (site.profileImageUrl) {
    return (
      <div className={className}>
        <Image
          src={site.profileImageUrl}
          alt=""
          fill
          className="object-cover"
          sizes="80px"
          priority
        />
      </div>
    );
  }

  if (site.initials) {
    return (
      <div
        className={`${className} items-center justify-center text-sm font-semibold tracking-wide sm:text-base`}
        aria-hidden
      >
        {site.initials}
      </div>
    );
  }

  return (
    <div
      className={`${className} items-center justify-center`}
      aria-hidden
    >
      <Camera className="size-7 sm:size-9" strokeWidth={1.75} />
    </div>
  );
}

export function TopHeader({ site }: { site: SiteContent }) {
  const rows = socialRows(site.socials);
  const twoRows = rows.length === 2;

  return (
    <header className="flex flex-col gap-4 pb-2 pt-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pb-1 sm:pt-5">
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <ProfileAvatar site={site} />
        <div className="min-w-0 flex-1">
          <p className="text-balance text-xs font-semibold uppercase tracking-[0.14em] text-heading sm:text-[12px] sm:tracking-[0.16em]">
            {site.name}
          </p>
          <p className="mt-1 text-balance text-[10px] font-medium uppercase tracking-[0.12em] text-muted sm:mt-0.5 sm:text-[10px]">
            {site.role}
          </p>
        </div>
      </div>

      <nav
        aria-label="Social links"
        className={
          twoRows
            ? "flex w-full min-w-0 flex-col items-start gap-0.5 sm:w-auto sm:items-end sm:gap-1"
            : "hide-scrollbar flex w-full min-w-0 flex-nowrap items-center justify-start gap-0.5 overflow-x-auto sm:w-auto sm:justify-end sm:gap-1.5 md:gap-2"
        }
      >
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex items-center justify-start gap-0.5 sm:justify-end sm:gap-1.5 md:gap-2"
          >
            {row.map((s) => (
              <SocialLink key={`${s.icon}-${s.href}`} social={s} />
            ))}
          </div>
        ))}
      </nav>
    </header>
  );
}
