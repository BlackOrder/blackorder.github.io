import { useEffect, useState } from 'react';

/* Color themes — provisional A/B/C set (behavior/visual-design § Color modes).
   Dark is the default; the three light themes are user-selectable, pending live evaluation. */
export const THEMES = [
  { id: 'dark', label: 'Dark' },
  { id: 'light-ivory', label: 'Ivory' },
  { id: 'light-cool', label: 'Cool' },
  { id: 'light-sand', label: 'Sand' },
] as const;

export type ThemeId = (typeof THEMES)[number]['id'];

const STORAGE_KEY = 'theme';

function readCurrent(): ThemeId {
  if (typeof document === 'undefined') return 'dark';
  const attr = document.documentElement.getAttribute('data-theme');
  return THEMES.some((t) => t.id === attr) ? (attr as ThemeId) : 'dark';
}

/** Apply a theme to <html> and persist the choice. `dark` clears the attribute (the :root default). */
export function applyTheme(id: ThemeId): void {
  const root = document.documentElement;
  if (id === 'dark') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', id);
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    /* localStorage may be unavailable (private mode) — selection just won't persist */
  }
}

/** Theme state synced to the `[data-theme]` attribute the no-flash inline script seeds pre-paint. */
export function useTheme(): { theme: ThemeId; setTheme: (id: ThemeId) => void } {
  const [theme, setTheme] = useState<ThemeId>('dark');
  useEffect(() => {
    setTheme(readCurrent());
  }, []);
  return {
    theme,
    setTheme: (id: ThemeId) => {
      applyTheme(id);
      setTheme(id);
    },
  };
}
