"use client";

import { AccordionItem, useAccordionPanel } from "@/components/portfolio/accordion-item";
import { ProjectCard } from "@/components/portfolio/project-card";
import { site } from "@/content/site";

/** Stagger card reveals after the panel is ready (keep tight — panel already eases in). */
const STAGGER_BASE_MS = 32;
const STAGGER_STEP_MS = 64;

function ProjectGroupCards({
  projects,
}: {
  projects: (typeof site.projectGroups)[number]["projects"];
}) {
  const { open, contentReady } = useAccordionPanel();

  if (projects.length === 0) {
    return <p className="py-2 text-sm text-muted">No projects yet.</p>;
  }

  return (
    <div className="projects-cards-bleed">
      <div className="projects-cards-grid grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
        {projects.map((project, i) => (
          <ProjectCard
            key={project.title}
            project={project}
            reveal={{
              open: open && contentReady,
              delayMs: STAGGER_BASE_MS + i * STAGGER_STEP_MS,
              durationMs: 380,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function ProjectsContent() {
  return (
    <>
      {site.projectGroups.map((group) => (
        <AccordionItem
          key={group.id}
          id={`projects-${group.id}`}
          label={group.label}
          variant="nested"
          contentReveal="none"
          wideContent
        >
          <ProjectGroupCards projects={group.projects} />
        </AccordionItem>
      ))}
    </>
  );
}
