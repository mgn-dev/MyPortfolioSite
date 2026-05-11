import { ProjectCard } from "@/components/portfolio/project-card";
import { site } from "@/content/site";

export function ProjectsContent() {
  return (
    <div className="space-y-5">
      {site.projects.map((project) => (
        <ProjectCard key={project.title} project={project} />
      ))}
    </div>
  );
}

