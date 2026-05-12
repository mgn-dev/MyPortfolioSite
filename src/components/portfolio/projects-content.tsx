"use client";

import {
  ACCORDION_TRANSITION_MS,
  useAccordionPanel,
} from "@/components/portfolio/accordion-item";
import { ProjectCard } from "@/components/portfolio/project-card";
import { site } from "@/content/site";

/** Spread card motion across the panel open transition (ms). */
const STAGGER_BASE_MS = 72;
const STAGGER_STEP_MS = 110;

export function ProjectsContent() {
  const { open } = useAccordionPanel();

  return (
    <div className="space-y-5">
      {site.projects.map((project, i) => (
        <ProjectCard
          key={project.title}
          project={project}
          reveal={{
            open,
            delayMs: STAGGER_BASE_MS + i * STAGGER_STEP_MS,
            durationMs: ACCORDION_TRANSITION_MS,
          }}
        />
      ))}
    </div>
  );
}
