"use client";

import { ChevronDown } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

/** Panel height / chevron; keep in sync with the WAAPI call below. */
export const ACCORDION_TRANSITION_MS = 500;

const EASE = "cubic-bezier(0.33, 1, 0.68, 1)";

function subscribeReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export const AccordionPanelContext = createContext<{
  open: boolean;
  transitionMs: number;
}>({ open: false, transitionMs: ACCORDION_TRANSITION_MS });

export function useAccordionPanel() {
  return useContext(AccordionPanelContext);
}

function readCurrentPx(panel: HTMLElement, inner: HTMLElement): number {
  const computed = getComputedStyle(panel).maxHeight;
  if (computed === "none" || computed === "auto" || computed === "") {
    return inner.scrollHeight;
  }
  const parsed = parseFloat(computed);
  return Number.isFinite(parsed) ? parsed : inner.scrollHeight;
}

export function AccordionItem({
  id,
  label,
  children,
  onToggle,
  contentReveal = "fade",
}: {
  id: string;
  label: string;
  children: ReactNode;
  onToggle?: (open: boolean) => void;
  contentReveal?: "fade" | "none";
}) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const wasOpenRef = useRef(false);

  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  const toggle = useCallback(() => {
    setOpen((prev) => {
      const next = !prev;
      onToggle?.(next);
      return next;
    });
  }, [onToggle]);

  // Drive the panel height with WAAPI instead of CSS transitions on
  // `max-height`. iOS Safari frame-coalesces around touch events and
  // frequently fails to engage `transition: max-height` from 0 → measured
  // height, snapping the panel open with no animation. WAAPI bypasses the
  // render→paint→transition pipeline entirely and animates identically on
  // desktop and iOS Safari.
  useLayoutEffect(() => {
    const panel = panelRef.current;
    const inner = innerRef.current;
    if (!panel || !inner) return;

    // Preserve the current visual position when interrupting an in-flight
    // animation (rapid toggle).
    const currentPx = readCurrentPx(panel, inner);
    if (animationRef.current) {
      panel.style.maxHeight = `${currentPx}px`;
      animationRef.current.cancel();
      animationRef.current = null;
    }

    if (reducedMotion) {
      panel.style.maxHeight = open ? "none" : "0px";
      wasOpenRef.current = open;
      return;
    }

    if (open) {
      const targetPx = inner.scrollHeight;
      panel.style.maxHeight = `${currentPx}px`;
      const anim = panel.animate(
        [
          { maxHeight: `${currentPx}px` },
          { maxHeight: `${targetPx}px` },
        ],
        {
          duration: ACCORDION_TRANSITION_MS,
          easing: EASE,
          fill: "both",
        },
      );
      animationRef.current = anim;
      anim.onfinish = () => {
        // Release the cap so dynamic content (images loading, etc.) can
        // grow naturally while the panel is open.
        panel.style.maxHeight = "none";
        anim.cancel();
        if (animationRef.current === anim) animationRef.current = null;
      };
      wasOpenRef.current = true;

      return () => {
        if (animationRef.current === anim) animationRef.current = null;
        anim.cancel();
      };
    }

    if (!wasOpenRef.current) {
      panel.style.maxHeight = "0px";
      return;
    }

    panel.style.maxHeight = `${currentPx}px`;
    const anim = panel.animate(
      [
        { maxHeight: `${currentPx}px` },
        { maxHeight: "0px" },
      ],
      {
        duration: ACCORDION_TRANSITION_MS,
        easing: EASE,
        fill: "both",
      },
    );
    animationRef.current = anim;
    anim.onfinish = () => {
      panel.style.maxHeight = "0px";
      anim.cancel();
      if (animationRef.current === anim) animationRef.current = null;
    };
    wasOpenRef.current = false;

    return () => {
      if (animationRef.current === anim) animationRef.current = null;
      anim.cancel();
    };
  }, [open, reducedMotion]);

  return (
    <div className="border-b border-border-subtle bg-transparent">
      <button
        type="button"
        id={`${id}-trigger`}
        className="flex w-full cursor-pointer touch-manipulation items-center justify-between py-5 text-left sm:py-6"
        aria-expanded={open}
        aria-controls={id}
        onClick={toggle}
      >
        <span className="px-1 text-xs font-semibold tracking-[0.18em] text-heading">
          {label}
        </span>
        <ChevronDown
          className={`size-5 shrink-0 transform-gpu transition-transform duration-500 ease-out motion-reduce:transition-none ${open ? "-rotate-180" : ""}`}
          strokeWidth={1.75}
          aria-hidden
        />
      </button>
      <div ref={panelRef} className="overflow-hidden" style={{ maxHeight: 0 }}>
        <div ref={innerRef} className="min-h-0">
          <AccordionPanelContext.Provider
            value={{ open, transitionMs: ACCORDION_TRANSITION_MS }}
          >
            <div
              id={id}
              role="region"
              aria-labelledby={`${id}-trigger`}
              className={
                contentReveal === "fade"
                  ? `transform-gpu pb-8 transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none ${open ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0 motion-reduce:translate-y-0"}`
                  : "pb-8"
              }
            >
              {children}
            </div>
          </AccordionPanelContext.Provider>
        </div>
      </div>
    </div>
  );
}
