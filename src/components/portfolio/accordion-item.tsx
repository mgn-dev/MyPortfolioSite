"use client";

import { ChevronDown } from "lucide-react";
import { useCallback, useState, type ReactNode } from "react";

export function AccordionItem({
  id,
  label,
  children,
  onToggle,
}: {
  id: string;
  label: string;
  children: ReactNode;
  onToggle?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => {
    setOpen((prev) => {
      const next = !prev;
      onToggle?.(next);
      return next;
    });
  }, [onToggle]);

  return (
    <div className="border-b border-border-subtle bg-transparent">
      <button
        type="button"
        id={`${id}-trigger`}
        className="flex w-full cursor-pointer items-center justify-between py-6 text-left"
        aria-expanded={open}
        aria-controls={id}
        onClick={toggle}
      >
        <span className="px-1 text-xs font-semibold tracking-[0.18em] text-heading">
          {label}
        </span>
        <ChevronDown
          className={`size-5 shrink-0 transition-transform duration-300 ease-out motion-reduce:transition-none ${open ? "-rotate-180" : ""}`}
          strokeWidth={1.75}
          aria-hidden
        />
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            id={id}
            role="region"
            aria-labelledby={`${id}-trigger`}
            className={`pb-8 transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none ${open ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0 motion-reduce:translate-y-0"}`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
