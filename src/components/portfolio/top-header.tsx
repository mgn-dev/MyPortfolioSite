import Image from "next/image";
import { Camera } from "lucide-react";
import { SocialsMenu } from "@/components/portfolio/socials-menu";
import type { SiteContent } from "@/lib/pocketbase";

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
  return (
    <header className="flex items-center gap-3 pb-2 pt-3 sm:gap-4 sm:pb-1 sm:pt-5">
      <ProfileAvatar site={site} />
      <div className="min-w-0 flex-1">
        <p className="text-balance text-xs font-semibold uppercase tracking-[0.14em] text-heading sm:text-[12px] sm:tracking-[0.16em]">
          {site.name}
        </p>
        <p className="mt-1 text-balance text-[10px] font-medium uppercase tracking-[0.12em] text-muted sm:mt-0.5 sm:text-[10px]">
          {site.role}
        </p>
      </div>
      <SocialsMenu socials={site.socials} />
    </header>
  );
}
