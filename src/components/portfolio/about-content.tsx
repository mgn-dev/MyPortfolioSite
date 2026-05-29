import type { SiteContent } from "@/lib/pocketbase";
import { BioMarkdown } from "@/components/portfolio/bio-markdown";

export function AboutContent({ site }: { site: SiteContent }) {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold tracking-tight text-heading">
        {site.name}.
      </h1>
      <p className="text-muted">{site.role}</p>
      <BioMarkdown content={site.bio} />
    </div>
  );
}
