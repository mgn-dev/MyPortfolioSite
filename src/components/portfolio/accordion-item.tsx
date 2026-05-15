"use client";

import { ChevronDown } from "lucide-react";
import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
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

/** Shorter open for nested wide panels (project card grids). */
const NESTED_WIDE_OPEN_MS = 360;

/** When nested wide panels open, start child reveals partway through (ratio of open ms). */
const NESTED_CONTENT_READY_RATIO = 0.42;

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
  /** True after the panel open animation finishes — use to defer child reveals. */
  contentReady: boolean;
  transitionMs: number;
}>({ open: false, contentReady: false, transitionMs: ACCORDION_TRANSITION_MS });

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
  variant = "section",
  defaultOpen = false,
  wideContent = false,
  allowDescendantBleed = false,
}: {
  id: string;
  label: string;
  children: ReactNode;
  onToggle?: (open: boolean) => void;
  contentReveal?: "fade" | "none";
  variant?: "section" | "nested";
  defaultOpen?: boolean;
  /** Nested panels only: allow horizontal bleed for wide card grids. */
  wideContent?: boolean;
  /** Section panels: let nested wide content bleed without capping layout height. */
  allowDescendantBleed?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  /** When true, panel uses max-h-0. Deferred until close animation finishes. */
  const [panelCollapsed, setPanelCollapsed] = useState(!defaultOpen);
  /** When true, children can run enter animations (panel is fully expanded). */
  const [contentReady, setContentReady] = useState(defaultOpen);
  const panelRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const wasOpenRef = useRef(defaultOpen);
  const skipInitialCloseEffectRef = useRef(!defaultOpen);
  const nested = variant === "nested";
  const panelAllowsBleed = nested ? wideContent : allowDescendantBleed;

  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  const toggle = useCallback(() => {
    setOpen((prev) => {
      const next = !prev;
      setContentReady(false);
      if (next) setPanelCollapsed(false);
      onToggle?.(next);
      return next;
    });
  }, [onToggle]);

  const lockPanelOverflow = useCallback((panel: HTMLElement) => {
    panel.style.overflow = "hidden";
  }, []);

  const releasePanelOverflow = useCallback(
    (panel: HTMLElement) => {
      if (panelAllowsBleed) panel.style.overflow = "visible";
      else panel.style.overflow = "";
    },
    [panelAllowsBleed],
  );

  const syncOpenPanelHeight = useCallback(() => {
    const panel = panelRef.current;
    const inner = innerRef.current;
    if (!panel || !inner) return;
    if (animationRef.current?.playState === "running") return;
    panel.style.maxHeight = "none";
    releasePanelOverflow(panel);
  }, [releasePanelOverflow]);

  // After open, keep panel height in sync when nested sections or media change size.
  useLayoutEffect(() => {
    const inner = innerRef.current;
    if (!inner || !open) return;

    const ro = new ResizeObserver(() => syncOpenPanelHeight());
    ro.observe(inner);
    return () => ro.disconnect();
  }, [open, syncOpenPanelHeight]);

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
      inner.style.visibility = open ? "visible" : "hidden";
      panel.style.maxHeight = open ? "none" : "0px";
      if (open) releasePanelOverflow(panel);
      else lockPanelOverflow(panel);
      setPanelCollapsed(!open);
      setContentReady(open);
      wasOpenRef.current = open;
      return;
    }

    if (open) {
      inner.style.visibility = "visible";
      lockPanelOverflow(panel);
      const targetPx = Math.max(inner.scrollHeight, inner.offsetHeight);
      const earlyChildReveal = nested && panelAllowsBleed && contentReveal === "none";
      const openDuration = earlyChildReveal ? NESTED_WIDE_OPEN_MS : ACCORDION_TRANSITION_MS;
      panel.style.maxHeight = `${currentPx}px`;
      const anim = panel.animate(
        [
          { maxHeight: `${currentPx}px` },
          { maxHeight: `${targetPx}px` },
        ],
        {
          duration: openDuration,
          easing: EASE,
          fill: "both",
        },
      );
      animationRef.current = anim;

      let readyTimer: ReturnType<typeof setTimeout> | undefined;
      if (earlyChildReveal) {
        readyTimer = window.setTimeout(() => {
          setContentReady(true);
          releasePanelOverflow(panel);
        }, Math.round(openDuration * NESTED_CONTENT_READY_RATIO));
      }

      anim.onfinish = () => {
        if (readyTimer !== undefined) window.clearTimeout(readyTimer);
        // Release the cap so dynamic content (images loading, etc.) can
        // grow naturally while the panel is open.
        panel.style.maxHeight = "none";
        releasePanelOverflow(panel);
        setContentReady(true);
        anim.cancel();
        if (animationRef.current === anim) animationRef.current = null;
      };
      wasOpenRef.current = true;

      return () => {
        if (readyTimer !== undefined) window.clearTimeout(readyTimer);
        if (animationRef.current === anim) animationRef.current = null;
        anim.cancel();
      };
    }

    if (!wasOpenRef.current) {
      if (skipInitialCloseEffectRef.current) {
        skipInitialCloseEffectRef.current = false;
        return;
      }
      panel.style.maxHeight = "0px";
      return;
    }

    setContentReady(false);
    inner.style.visibility = "hidden";
    lockPanelOverflow(panel);
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
      lockPanelOverflow(panel);
      setPanelCollapsed(true);
      anim.cancel();
      if (animationRef.current === anim) animationRef.current = null;
    };
    wasOpenRef.current = false;

    return () => {
      if (animationRef.current === anim) animationRef.current = null;
      anim.cancel();
    };
  }, [open, reducedMotion, lockPanelOverflow, releasePanelOverflow]);

  return (
    <div
      className={
        nested
          ? "border-t border-border-subtle bg-transparent pl-4 first:border-t-0 sm:pl-6"
          : "border-b border-border-subtle bg-transparent"
      }
    >
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
      <div
        ref={panelRef}
        className={["overflow-hidden", panelCollapsed && "max-h-0"].join(" ")}
      >
        <div ref={innerRef} className="min-h-0">
          <AccordionPanelContext.Provider
            value={{ open, contentReady, transitionMs: ACCORDION_TRANSITION_MS }}
          >
            <div
              id={id}
              role="region"
              aria-labelledby={`${id}-trigger`}
              className={
                contentReveal === "fade"
                  ? `transform-gpu pb-8 transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none ${open ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0 motion-reduce:translate-y-0"}`
                  : allowDescendantBleed
                    ? [
                        "pb-8",
                        open
                          ? "opacity-100 transition-opacity duration-200 ease-out"
                          : "pointer-events-none opacity-0 transition-none",
                      ].join(" ")
                    : "pb-8"
              }
            >
              {allowDescendantBleed
                ? Children.map(children, (child) =>
                    isValidElement(child)
                      ? cloneElement(child, {
                          key: open ? "projects-open" : "projects-closed",
                        })
                      : child,
                  )
                : children}
            </div>
          </AccordionPanelContext.Provider>
        </div>
      </div>
    </div>
  );
}
