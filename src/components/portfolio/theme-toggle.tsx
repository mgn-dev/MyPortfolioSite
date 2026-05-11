"use client";

import { Laptop, Moon, Sun } from "lucide-react";
import { useCallback, useSyncExternalStore } from "react";

export const STORAGE_KEY = "portfolio-theme";

export type ThemePreference = "light" | "dark" | "system";

function readStored(): ThemePreference {
  if (typeof window === "undefined") return "system";
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {
    /* ignore */
  }
  return "system";
}

function resolveDark(pref: ThemePreference): boolean {
  if (pref === "dark") return true;
  if (pref === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyDom(pref: ThemePreference) {
  const root = document.documentElement;
  root.classList.toggle("dark", resolveDark(pref));
  root.setAttribute("data-theme-pref", pref);
}

function subscribe(onChange: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const onMq = () => {
    if (readStored() === "system") applyDom("system");
    onChange();
  };
  mq.addEventListener("change", onMq);
  const onCustom = () => onChange();
  window.addEventListener("portfolio-theme", onCustom);
  return () => {
    mq.removeEventListener("change", onMq);
    window.removeEventListener("portfolio-theme", onCustom);
  };
}

function getSnapshot(): ThemePreference {
  return readStored();
}

function getServerSnapshot(): ThemePreference {
  return "system";
}

function persistAndNotify(pref: ThemePreference) {
  try {
    if (pref === "system") localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, pref);
  } catch {
    /* ignore */
  }
  applyDom(pref);
  window.dispatchEvent(new Event("portfolio-theme"));
}

export function ThemeToggle() {
  const pref = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const cycle = useCallback(() => {
    const next: ThemePreference =
      pref === "light" ? "dark" : pref === "dark" ? "system" : "light";
    persistAndNotify(next);
  }, [pref]);

  const Icon = pref === "light" ? Sun : pref === "dark" ? Moon : Laptop;
  const label =
    pref === "light"
      ? "Theme: light. Click for dark."
      : pref === "dark"
        ? "Theme: dark. Click for system."
        : "Theme: system. Click for light.";

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
