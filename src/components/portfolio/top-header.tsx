import { Camera } from "lucide-react";
import { SocialIcon } from "@/components/portfolio/social-icons";
import { site } from "@/content/site";

export function TopHeader() {
  return (
    <header className="flex flex-col gap-4 pb-2 pt-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pb-1 sm:pt-5">
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <button
          type="button"
          aria-label="Profile picture"
          className="flex size-14 shrink-0 touch-manipulation items-center justify-center rounded-full bg-input text-heading shadow-sm ring-1 ring-border-subtle sm:size-20"
        >
          <Camera className="size-7 sm:size-9" strokeWidth={1.75} aria-hidden />
        </button>
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
        className="flex w-full min-w-0 items-center justify-center gap-0.5 sm:w-auto sm:justify-end sm:gap-1.5 md:gap-2"
      >
        {site.socials
          .slice(0, 5)
          .reverse()
          .map((s) => (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="inline-flex size-11 touch-manipulation items-center justify-center rounded-full border border-transparent text-heading transition-colors active:bg-input hover:border-border-subtle hover:bg-input sm:size-10"
            >
              <SocialIcon name={s.icon} className="size-5 sm:size-5" />
            </a>
          ))}
      </nav>
    </header>
  );
}
