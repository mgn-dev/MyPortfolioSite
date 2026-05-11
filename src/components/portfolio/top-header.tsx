import { Camera } from "lucide-react";
import { ThemeToggle } from "@/components/portfolio/theme-toggle";
import { SocialIcon } from "@/components/portfolio/social-icons";
import { site } from "@/content/site";

export function TopHeader() {
  return (
    <header className="flex items-start justify-between pb-2 pt-10">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Profile picture"
          className="flex size-18 items-center justify-center rounded-full bg-input text-heading shadow-sm ring-1 ring-border-subtle"
        >
          <Camera className="size-8" strokeWidth={1.75} aria-hidden />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <nav aria-label="Social links" className="flex items-center gap-3">
          {site.socials.slice(0, 5).map((s) => (
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

        <ThemeToggle />
      </div>
    </header>
  );
}
