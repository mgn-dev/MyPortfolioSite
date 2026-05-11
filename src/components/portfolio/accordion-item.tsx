import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

export function AccordionItem({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <details className="group border-b border-border-subtle bg-transparent">
      <summary
        className="cursor-pointer list-none [&::-webkit-details-marker]:hidden flex w-full items-center justify-between py-6"
        aria-controls={id}
      >
        <span className="px-1 text-xs font-semibold tracking-[0.18em] text-heading">
          {label}
        </span>
        <ChevronDown
          className="size-5 shrink-0 transition-transform duration-200 group-open:-rotate-180"
          strokeWidth={1.75}
          aria-hidden
        />
      </summary>
      <div id={id} className="pb-8">
        {children}
      </div>
    </details>
  );
}

