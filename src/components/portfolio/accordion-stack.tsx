"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export function AccordionStack({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const lastWidthRef = useRef<number>(0);
  const [marginTopPx, setMarginTopPx] = useState<number | null>(null);

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    // `marginTop` must be only this element's top margin — not distance from
    // `main` top (that double-counts header + border, which are still in flow).
    const prev = el.previousElementSibling;
    if (prev instanceof HTMLElement) {
      const gap =
        el.getBoundingClientRect().top - prev.getBoundingClientRect().bottom;
      setMarginTopPx(Math.max(0, gap));
      return;
    }

    const parent = el.parentElement;
    if (!parent) return;
    const top =
      el.getBoundingClientRect().top -
      parent.getBoundingClientRect().top +
      parent.scrollTop;
    setMarginTopPx(Math.max(0, top));
  }, []);

  useLayoutEffect(() => {
    if (marginTopPx !== null) return;
    measure();
  }, [marginTopPx, measure]);

  useEffect(() => {
    lastWidthRef.current = window.innerWidth;
    // Only re-pin on width changes. Mobile Safari/Firefox fire `resize`
    // continuously as the URL bar shows/hides (height changes), which would
    // otherwise cause the accordion to jitter while scrolling.
    const onResize = () => {
      const w = window.innerWidth;
      if (w === lastWidthRef.current) return;
      lastWidthRef.current = w;
      setMarginTopPx(null);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Treat 0 (no slack — accordion already fills the viewport) as "don't pin"
  // so the layout falls back to natural document flow on short screens.
  const pinned = marginTopPx !== null && marginTopPx > 0;

  return (
    <div
      ref={ref}
      className={[className, !pinned && "my-auto"].filter(Boolean).join(" ")}
      style={
        pinned ? { marginTop: marginTopPx, marginBottom: "auto" } : undefined
      }
    >
      {children}
    </div>
  );
}
