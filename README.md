# blackorder.github.io

Personal freelance brand site for [BlackOrder](https://github.com/BlackOrder) — Go backend engineer specializing in platform architecture, telecom infrastructure, and system integrations.

Live at **[blackorder.dev](https://blackorder.dev)**

---

## Stack

- **Vite + React 18 + TypeScript** single-page app (anchor navigation, no client router)
- **Static pre-rendering (SSG)** via [vite-react-ssg](https://github.com/Daydreamer-riri/vite-react-ssg) — real HTML + meta tags at build time for SEO and link previews
- **Framer Motion** for motion + micro-interactions (behind `prefers-reduced-motion`)
- **GitHub Pages** via GitHub Actions (no server, no container)

## Local development

**Prerequisites:** Node.js 22 LTS (`.nvmrc`)

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # Vite + SSG → dist/
npm run preview    # serve the built dist/
npm run typecheck  # tsc --noEmit
npm run lint
npm run validate:projects
```

## Content is data-driven

Edit data/components, not markup:

| Path | Controls |
|------|----------|
| `src/data/projects/*.ts` | Work-section project cards (one typed module per project) |
| `src/data/contact.ts` | GitHub (mandatory) + optional email |
| `src/components/*.tsx` | Section components (Hero, Specialties, Work, About, Contact, Nav, Footer) |
| `src/styles/tokens.css` | Design tokens (colors, type scale, motion) — single source of truth |

## Deploy

Push to `main` → GitHub Actions (`.github/workflows/deploy.yml`) runs typecheck → lint → registry validation → build (Vite + SSG) → SEO check → deploy to GitHub Pages. `public/CNAME` + `public/.nojekyll` ship in the artifact.

## Functional spec

The authoritative functional spec lives in `docs/functional/` (council-managed; gitignored — local planning material). See `CONTEXT.md`, `FLOW-MAP.md`, `CONVENTIONS.md`, `behavior/`, and `adr/`.

## Pre-deploy open items

See `docs/functional/CONTEXT.md` § Pre-deploy open items — notably: acquire the Cormorant Garamond WOFF2 weights (placeholders currently in `public/fonts/`), confirm the OG image, and create `.checksums/google-verify.sha256` before the first CI run.
