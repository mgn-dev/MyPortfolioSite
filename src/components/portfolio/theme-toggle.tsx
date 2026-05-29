"use client";

import { Moon, Sun } from "lucide-react";
import { useCallback, useSyncExternalStore } from "react";

export const STORAGE_KEY = "portfolio-theme";

export type ThemePreference = "light" | "dark";

function readStored(): ThemePreference {
  if (typeof window === "undefined") return "light";
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "light" || v === "dark") return v;
  } catch {
    /* ignore */
  }
  return "light";
}

function applyDom(pref: ThemePreference) {
  const root = document.documentElement;
  root.classList.toggle("dark", pref === "dark");
  root.setAttribute("data-theme-pref", pref);
}

function subscribe(onChange: () => void) {
  const onCustom = () => onChange();
  window.addEventListener("portfolio-theme", onCustom);
  return () => window.removeEventListener("portfolio-theme", onCustom);
}

function getSnapshot(): ThemePreference {
  return readStored();
}

function getServerSnapshot(): ThemePreference {
  return "light";
}

function persistAndNotify(pref: ThemePreference) {
  try {
    localStorage.setItem(STORAGE_KEY, pref);
  } catch {
    /* ignore */
  }
  applyDom(pref);
  window.dispatchEvent(new Event("portfolio-theme"));
}

export function ThemeToggle() {
  const pref = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const cycle = useCallback(() => {
    const next: ThemePreference = pref === "light" ? "dark" : "light";
    persistAndNotify(next);
  }, [pref]);

  const Icon = pref === "light" ? Sun : Moon;
  const label =
    pref === "light"
      ? "Theme: light. Click for dark."
      : "Theme: dark. Click for light.";

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={label}
      title={label}
      suppressHydrationWarning
      className="inline-flex size-10 items-center justify-center rounded-full border border-border-subtle bg-card text-heading shadow-sm transition-colors hover:border-muted hover:bg-input"
    >
      <Icon className="size-[18px]" strokeWidth={1.75} aria-hidden />
    </button>
  );
}
