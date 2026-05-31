"use client";

import { ChevronDown, Globe } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { SocialIcon, socialIconClass } from "@/components/portfolio/social-icons";
import type { SiteSocial } from "@/lib/pocketbase";

function SocialMenuItem({
  social,
  onSelect,
}: {
  social: SiteSocial;
  onSelect: () => void;
}) {
  return (
    <a
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      role="menuitem"
      className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-heading transition-colors hover:bg-input"
      onClick={onSelect}
    >
      <SocialIcon
        name={social.icon}
        className={socialIconClass(social.icon)}
      />
      <span>{social.label}</span>
    </a>
  );
}

export function SocialsMenu({ socials }: { socials: SiteSocial[] }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (socials.length === 0) return null;

  return (
    <div ref={wrapperRef} className="relative shrink-0">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        aria-label="Connect"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex touch-manipulation items-center justify-center gap-1 px-0 py-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-heading sm:gap-1.5 sm:px-2 sm:py-1"
      >
        <Globe
          className="size-7 shrink-0 sm:size-3.5"
          strokeWidth={1.75}
          aria-hidden
        />
        <span className="hidden sm:inline">Connect</span>
        <ChevronDown
          className={`hidden size-4 shrink-0 transform-gpu transition-transform duration-300 ease-out motion-reduce:transition-none sm:inline ${open ? "-rotate-180" : ""}`}
          strokeWidth={1.75}
          aria-hidden
        />
      </button>

      {open && (
        <nav
          id={menuId}
          aria-label="Connect links"
          role="menu"
          className="absolute right-0 top-full z-10 mt-1.5 min-w-[12rem] overflow-hidden border border-border-subtle bg-card py-1 shadow-sm"
        >
          {socials.map((social) => (
            <SocialMenuItem
              key={`${social.icon}-${social.href}`}
              social={social}
              onSelect={close}
            />
          ))}
        </nav>
      )}
    </div>
  );
}
