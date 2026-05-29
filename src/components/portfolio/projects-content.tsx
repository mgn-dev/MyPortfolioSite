"use client";

import { AccordionItem, useAccordionPanel } from "@/components/portfolio/accordion-item";
import { ProjectCard } from "@/components/portfolio/project-card";
import type { SiteContent, SiteProjectGroup } from "@/lib/pocketbase";

/** Stagger card reveals after the panel is ready (keep tight — panel already eases in). */
const STAGGER_BASE_MS = 32;
const STAGGER_STEP_MS = 64;

function ProjectGroupCards({
  projects,
}: {
  projects: SiteProjectGroup["projects"];
}) {
  const { open, contentReady } = useAccordionPanel();

  if (projects.length === 0) {
    return <p className="py-2 text-sm text-muted">No projects yet.</p>;
  }

  return (
    <div className="projects-cards-bleed">
      <div className="projects-cards-grid">
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

export function ProjectsContent({
  projectGroups,
}: {
  projectGroups: SiteContent["projectGroups"];
}) {
  return (
    <>
      {projectGroups.map((group) => (
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
