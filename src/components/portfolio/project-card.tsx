import { ArrowUpRight } from "lucide-react";
import type { SiteProject } from "@/content/site";

export function ProjectCard({
  project,
  reveal,
}: {
  project: SiteProject;
  /** When set, fades/slides in with the accordion panel using staggered delay. */
  reveal?: { open: boolean; delayMs: number; durationMs: number };
}) {
  const revealClasses = reveal
    ? [
        "transition-[opacity,transform,box-shadow] ease-out motion-reduce:transition-none",
        reveal.open
          ? "translate-y-0 opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100"
          : "translate-y-2 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-0",
      ].join(" ")
    : "";

  const revealStyle =
    reveal !== undefined
      ? {
          transitionProperty: "opacity, transform, box-shadow",
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
      className={`overflow-hidden rounded-3xl border border-border-subtle bg-card shadow-sm transition-shadow hover:shadow-md ${revealClasses} ${reveal ? "transform-gpu" : ""}`}
      style={revealStyle}
    >
      <div className="flex flex-col gap-6 p-5 sm:gap-8 sm:p-6 lg:flex-row lg:items-stretch lg:gap-10 lg:p-8">
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <div
            className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-input text-xs font-semibold uppercase tracking-wide text-muted"
            aria-hidden
          >
            {project.title.slice(0, 2)}
          </div>
          <div className="space-y-3">
            <h3 className="text-pretty text-xl font-semibold tracking-tight text-heading">
              {project.title}
            </h3>
            <p className="max-w-md text-pretty text-base leading-relaxed text-muted">
              {project.description}
            </p>
          </div>
          <div className="mt-auto pt-2">
            <a
              href={project.url}
              className="inline-flex min-h-11 touch-manipulation items-center gap-2 rounded-full border border-btn-outline-border px-5 text-sm font-medium text-heading transition-colors hover:bg-input"
            >
              Visit site
              <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden />
            </a>
          </div>
        </div>
        <div
          className="relative aspect-video w-full shrink-0 overflow-hidden rounded-2xl bg-input lg:aspect-auto lg:w-[min(100%,320px)] lg:max-w-[42%]"
          aria-hidden
        >
          <div
            className="absolute inset-0 opacity-90"
            style={{
              background: `linear-gradient(135deg, ${project.accent}55 0%, var(--placeholder-shade) 48%, var(--input-bg) 100%)`,
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_45%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_50%)]" />
        </div>
      </div>
    </article>
  );
}
