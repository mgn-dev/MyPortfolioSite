import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

const bioMarkdownComponents: Components = {
  p: ({ children }) => (
    <p className="text-base leading-relaxed text-muted [&:not(:last-child)]:mb-4">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="mb-4 list-disc space-y-1 pl-5 text-base leading-relaxed text-muted">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 list-decimal space-y-1 pl-5 text-base leading-relaxed text-muted">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-heading">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-medium text-heading underline-offset-2 hover:underline"
      target="_blank"
      rel="noreferrer noopener"
    >
      {children}
    </a>
  ),
  h2: ({ children }) => (
    <h2 className="mb-2 mt-5 text-base font-semibold tracking-tight text-heading first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 mt-4 text-base font-semibold tracking-tight text-heading first:mt-0">
      {children}
    </h3>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-4 border-l-2 border-border-subtle pl-4 text-muted">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-5 border-border-subtle" />,
};

/** Strip common markdown syntax for plain-text metadata fields. */
export function plainTextFromMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~>#-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

type BioMarkdownProps = {
  content: string;
  className?: string;
};

export function BioMarkdown({ content, className }: BioMarkdownProps) {
  return (
    <div className={className ?? "max-w-prose"}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={bioMarkdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
