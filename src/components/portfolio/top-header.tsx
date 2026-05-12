import { Camera } from "lucide-react";
import { SocialIcon } from "@/components/portfolio/social-icons";
import { site } from "@/content/site";

export function TopHeader() {
  return (
    <header className="flex items-center justify-between pb-1 pt-4 sm:pt-5">
      <button
        type="button"
        aria-label="Profile picture"
        className="flex size-20 shrink-0 items-center justify-center rounded-full bg-input text-heading shadow-sm ring-1 ring-border-subtle"
      >
        <Camera className="size-9" strokeWidth={1.75} aria-hidden />
      </button>

      <nav aria-label="Social links" className="flex items-center gap-3">
        {site.socials.slice(0, 5).toReversed().map((s) => (
          <a
            key={s.href}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className="inline-flex size-10 items-center justify-center rounded-full border border-transparent text-heading transition-colors hover:border-border-subtle hover:bg-input"
          >
            <SocialIcon name={s.icon} className="size-5" />
          </a>
        ))}
      </nav>
    </header>
  );
}
