import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { GithubIcon } from "@/components/portfolio/social-icons";
import type { ProjectInvolvement, SiteProject } from "@/content/site";

const STATUS_LABEL: Record<SiteProject["status"], string> = {
  live: "Live",
  staging: "Staging",
};

/** Shared accent color for involvement pills across all projects. */
const INVOLVEMENT_PILL_ACCENT = "#0ea5e9";

/**
 * Inactive halves of InvolvementPill and the thumbnail status capsule use the same greys
 * (`#d9d9d9` light / `#404040` dark) so chips read as one system.
 */
const INVOLVEMENT_GREY_SURFACE_CLASS =
  "bg-[#d9d9d9]/65 text-white dark:bg-[#404040]/65";

/** Subtle elevation for pills and thumbnail status capsule (tone with ProjectCard shadows). */
const CHIP_SHADOW_CLASS =
  "shadow-[0_2px_10px_rgba(0,0,0,0.07)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.32)]";

/** Staging status dot — warm orange beside Live pill blue (INVOLVEMENT_PILL_ACCENT). */
const STAGING_DOT = "#fb923c";

function InvolvementPill({
  involvement,
}: {
  involvement: ProjectInvolvement;
}) {
  const accentColor = INVOLVEMENT_PILL_ACCENT;

  const ariaLabel =
    involvement === "both"
      ? "Gen AI and Human"
      : involvement === "gen-ai"
        ? "Gen AI"
        : "Human";

  const shellClass =
    `inline-flex shrink-0 overflow-hidden rounded-full text-[10px] font-semibold leading-none tracking-wide ${CHIP_SHADOW_CLASS}`;

  if (involvement === "both") {
    return (
      <div
        className={`${shellClass} text-white`}
        style={{ backgroundColor: accentColor }}
        aria-label={ariaLabel}
      >
        <span className="px-1.5 py-0.5">Gen AI</span>
        <span
          className="w-px shrink-0 self-stretch bg-white/25"
          aria-hidden
        />
        <span className="px-1.5 py-0.5">Human</span>
      </div>
    );
  }

  return (
    <div className={shellClass} aria-label={ariaLabel}>
      <span
        className={`px-1.5 py-0.5 text-white ${
          involvement === "human" ? INVOLVEMENT_GREY_SURFACE_CLASS : ""
        }`}
        style={
          involvement === "gen-ai"
            ? { backgroundColor: accentColor }
            : undefined
        }
      >
        Gen AI
      </span>
      <span
        className={`px-1.5 py-0.5 text-white ${
          involvement === "gen-ai" ? INVOLVEMENT_GREY_SURFACE_CLASS : ""
        }`}
        style={
          involvement === "human"
            ? { backgroundColor: accentColor }
            : undefined
        }
      >
        Human
      </span>
    </div>
  );
}

export function ProjectCard({
  project,
  reveal,
}: {
  project: SiteProject;
  reveal?: { open: boolean; delayMs: number; durationMs: number };
}) {
  const revealClasses = reveal
    ? [
        "transition-[opacity,transform] ease-out motion-reduce:transition-none",
        reveal.open
          ? "translate-y-0 opacity-100"
          : "translate-y-2 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-0",
      ].join(" ")
    : "";

  const revealStyle =
    reveal !== undefined
      ? {
          transitionProperty: "opacity, transform",
          transitionTimingFunction: "cubic-bezier(0.33, 1, 0.68, 1)",
          ...(reveal.open
            ? {
                transitionDuration: `${reveal.durationMs}ms`,
                transitionDelay: `${reveal.delayMs}ms`,
              }
            : {
                transitionDuration: "160ms",
                transitionDelay: "0ms",
              }),
        }
      : undefined;

  return (
    <article
      className={`flex min-w-0 flex-col rounded-[2rem] bg-card p-5 shadow-[0_4px_24px_rgba(0,0,0,0.06)] sm:rounded-[2.5rem] sm:p-6 dark:shadow-[0_4px_24px_rgba(0,0,0,0.35)] ${revealClasses} ${reveal ? "transform-gpu" : ""}`}
      style={revealStyle}
    >
      <div
        className="relative aspect-[5/4] w-full overflow-hidden rounded-2xl"
        style={{ backgroundColor: "var(--placeholder-shade)" }}
        aria-hidden={!project.imageSrc}
      >
        <p
          className={`absolute right-3 top-3 z-10 flex items-center gap-2 rounded-full pl-2.5 pr-3 py-1 text-xs font-semibold ${INVOLVEMENT_GREY_SURFACE_CLASS} ${CHIP_SHADOW_CLASS}`}
        >
          <span
            className="size-1.5 shrink-0 rounded-full"
            style={{
              backgroundColor:
                project.status === "live" ? INVOLVEMENT_PILL_ACCENT : STAGING_DOT,
            }}
            aria-hidden
          />
          {STATUS_LABEL[project.status]}
        </p>

        {project.imageSrc ? (
          <Image
            src={project.imageSrc}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1152px) 33vw, 384px"
          />
        ) : project.accent ? (
          <>
            <div
              className="absolute inset-0 opacity-90"
              style={{
                background: `linear-gradient(135deg, ${project.accent}44 0%, var(--placeholder-shade) 55%, var(--input-bg) 100%)`,
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <ImageIcon className="size-10 text-heading/25" strokeWidth={1.25} />
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageIcon className="size-10 text-heading/25" strokeWidth={1.25} />
          </div>
        )}
      </div>

      <div className="mt-5 space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
          <h3 className="min-w-0 text-pretty text-lg font-semibold leading-snug tracking-tight text-heading sm:text-xl">
            {project.title}
          </h3>
          <div className="w-fit shrink-0">
            <InvolvementPill involvement={project.involvement} />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="min-w-0 flex-1 text-pretty text-[13px] leading-snug text-muted">
            {project.techStack.join(" · ")}
          </p>
          {project.status !== "live" && project.githubUrl ? (
            <a
              href={project.githubUrl}
              className="inline-flex shrink-0 touch-manipulation text-heading transition-opacity hover:opacity-70"
              aria-label={`${project.title} on GitHub`}
              target={project.githubUrl.startsWith("http") ? "_blank" : undefined}
              rel={project.githubUrl.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              <GithubIcon className="size-6" />
            </a>
          ) : (
            <span className="size-6 shrink-0" aria-hidden />
          )}
        </div>
      </div>
    </article>
  );
}
