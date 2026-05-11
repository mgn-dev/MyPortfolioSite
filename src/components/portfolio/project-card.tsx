import { ArrowUpRight } from "lucide-react";
import type { SiteProject } from "@/content/site";

export function ProjectCard({ project }: { project: SiteProject }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-border-subtle bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-8 p-6 lg:flex-row lg:items-stretch lg:gap-10 lg:p-8">
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <div
            className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-input text-xs font-semibold uppercase tracking-wide text-muted"
            aria-hidden
          >
            {project.title.slice(0, 2)}
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold tracking-tight text-heading">
              {project.title}
            </h3>
            <p className="max-w-md text-base leading-relaxed text-muted">
              {project.description}
            </p>
          </div>
          <div className="mt-auto pt-2">
            <a
              href={project.url}
              className="inline-flex items-center gap-2 rounded-full border border-btn-outline-border px-5 py-2.5 text-sm font-medium text-heading transition-colors hover:bg-input"
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
