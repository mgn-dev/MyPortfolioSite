import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { GithubIcon } from "@/components/portfolio/social-icons";
import type { ProjectInvolvement, SiteProject } from "@/content/site";

const STATUS_LABEL: Record<SiteProject["status"], string> = {
  live: "Live",
  staging: "Staging",
};

function InvolvementPill({ involvement }: { involvement: ProjectInvolvement }) {
  const genAiActive = involvement === "gen-ai" || involvement === "both";
  const humanActive = involvement === "human" || involvement === "both";

  return (
    <div
      className="inline-flex shrink-0 overflow-hidden rounded-full text-[11px] font-medium tracking-wide"
      aria-label={
        involvement === "both"
          ? "Gen AI and Human"
          : involvement === "gen-ai"
            ? "Gen AI"
            : "Human"
      }
    >
      <span
        className={`px-2.5 py-1 ${
          genAiActive
            ? "bg-[#b0b0b0] text-white dark:bg-[#6b7280]"
            : "bg-[#d9d9d9] text-white dark:bg-[#404040]"
        }`}
      >
        Gen AI
      </span>
      <span
        className={`px-2.5 py-1 ${
          humanActive
            ? "bg-[#9ca3af] text-white dark:bg-[#525252]"
            : "bg-[#d9d9d9] text-white dark:bg-[#404040]"
        }`}
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
        <p className="absolute right-3 top-3 z-10 text-xs font-medium text-muted">
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
          <h3 className="text-pretty text-lg font-semibold leading-snug tracking-tight text-heading sm:text-xl">
            {project.title}
          </h3>
          <InvolvementPill involvement={project.involvement} />
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted">{project.tech}</p>
          {project.githubUrl ? (
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
