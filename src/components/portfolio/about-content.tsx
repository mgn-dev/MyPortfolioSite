import { site } from "@/content/site";

export function AboutContent() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold tracking-tight text-heading">
        Hey, I&apos;m {site.name}.
      </h1>
      <p className="text-muted">{site.role}</p>
      <p className="max-w-prose text-base leading-relaxed text-muted">
        {site.bio}
      </p>
    </div>
  );
}

