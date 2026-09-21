export const THEME_STORAGE_KEY = "northline-ui";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_COLORS = {
  light: "#ffffff",
  dark: "#0b0c0e",
} as const;

export const THEME_SWATCHES = {
  light: { rail: "#ffffff", surface: "#ffffff", ink: "#2a3038" },
  dark: { rail: "#0e0f12", surface: "#141518", ink: "#c5ccd6" },
} as const;

export const THEME_OPTIONS: {
  id: ThemePreference;
  label: string;
  hint: string;
}[] = [
  { id: "light", label: "White", hint: "White canvas, graphite ink" },
  { id: "dark", label: "Nightline", hint: "Steel on charcoal" },
  { id: "system", label: "System", hint: "Follow the device" },
];

export function resolveTheme(
  preference: ThemePreference,
  prefersLight?: boolean,
): ResolvedTheme {
  if (preference === "light" || preference === "dark") return preference;
  const light =
    prefersLight ??
    (typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: light)").matches
      : true);
  return light ? "light" : "dark";
}

export function applyResolvedTheme(resolved: ResolvedTheme) {
  const root = document.documentElement;
  root.dataset.theme = resolved;
  root.style.colorScheme = resolved;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", THEME_COLORS[resolved]);
}

/** Inline head script — keeps the first paint on the stored theme. */
export const THEME_BOOT_SCRIPT = `(function(){try{var t="light",k=${JSON.stringify(THEME_STORAGE_KEY)},s=localStorage.getItem(k);if(s){var p=JSON.parse(s);if(p&&p.state&&(p.state.theme==="light"||p.state.theme==="dark"||p.state.theme==="system"))t=p.state.theme}if(t==="system")t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";if(t!=="dark")t="light";var r=document.documentElement;r.setAttribute("data-theme",t);r.style.colorScheme=t}catch(e){document.documentElement.setAttribute("data-theme","light");document.documentElement.style.colorScheme="light"}})();`;
