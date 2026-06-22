import { THEMES, useTheme } from '../lib/useTheme';

/* Compact theme switcher — paper-colour swatches, active gets a gold ring.
   Provisional A/B/C control (behavior/visual-design § Color modes). */
export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="theme-switcher" role="group" aria-label="Color theme">
      {THEMES.map((t) => (
        <button
          key={t.id}
          type="button"
          className="theme-switcher__btn"
          data-theme-btn={t.id}
          aria-pressed={theme === t.id}
          aria-label={`${t.label} theme`}
          title={`${t.label} theme`}
          onClick={() => setTheme(t.id)}
        />
      ))}
    </div>
  );
}
