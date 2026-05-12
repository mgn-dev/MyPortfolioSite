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

/** Panel height / chevron; keep in sync with `transitionMs` below. */
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
  const [panelMaxPx, setPanelMaxPx] = useState(0);
  const innerRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);
  const openRafRef = useRef(0);
  const closeRafRef = useRef(0);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

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

  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    cancelAnimationFrame(openRafRef.current);
    cancelAnimationFrame(closeRafRef.current);
    resizeObserverRef.current?.disconnect();
    resizeObserverRef.current = null;

    const measure = () => el.scrollHeight;

    if (open) {
      wasOpenRef.current = true;

      if (reducedMotion) {
        setPanelMaxPx(measure());
        resizeObserverRef.current = new ResizeObserver(() =>
          setPanelMaxPx(measure()),
        );
        resizeObserverRef.current.observe(el);
        return () => {
          resizeObserverRef.current?.disconnect();
          resizeObserverRef.current = null;
        };
      }

      // Let the browser paint max-height: 0 once, then apply the real height so
      // `transition: max-height` actually runs (desktop + iOS).
      setPanelMaxPx(0);
      openRafRef.current = requestAnimationFrame(() => {
        setPanelMaxPx(measure());
        resizeObserverRef.current = new ResizeObserver(() =>
          setPanelMaxPx(measure()),
        );
        resizeObserverRef.current.observe(el);
      });

      return () => {
        cancelAnimationFrame(openRafRef.current);
        resizeObserverRef.current?.disconnect();
        resizeObserverRef.current = null;
      };
    }

    if (wasOpenRef.current) {
      const h = measure();
      setPanelMaxPx(h);
      if (reducedMotion) {
        setPanelMaxPx(0);
      } else {
        closeRafRef.current = requestAnimationFrame(() => {
          closeRafRef.current = requestAnimationFrame(() => {
            setPanelMaxPx(0);
          });
        });
      }
    } else {
      setPanelMaxPx(0);
    }
    wasOpenRef.current = false;

    return () => {
      cancelAnimationFrame(closeRafRef.current);
    };
  }, [open, reducedMotion]);

  const panelStyle = {
    maxHeight: panelMaxPx,
    transition: reducedMotion
      ? "none"
      : `max-height ${ACCORDION_TRANSITION_MS}ms ${EASE}`,
  } as const;

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
      <div className="overflow-hidden" style={panelStyle}>
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
