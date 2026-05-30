import { BioMarkdown } from "@/components/portfolio/bio-markdown";
import type { SiteContent } from "@/lib/pocketbase";

export function AboutContent({ site }: { site: SiteContent }) {
  return (
    <div className="flex flex-col">
      <h1 className="mb-4 text-xl font-semibold tracking-tight text-heading">
        {site.name}.
      </h1>
      <p className="mb-12 text-muted">{site.role}</p>
      <BioMarkdown content={site.bio} />
    </div>
  );
}
