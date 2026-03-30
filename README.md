# blackorder.github.io

Personal freelance brand site for [BlackOrder](https://github.com/BlackOrder) — Go backend engineer specializing in platform architecture, telecom infrastructure, and system integrations.

Live at **[blackorder.dev](https://blackorder.dev)**

---

## Stack

- [Hugo](https://gohugo.io/) static site generator (Extended, pinned via `.hugo-version`)
- GitHub Pages via GitHub Actions
- Zero runtime JS dependencies — no-JS functional, JS-enhanced

## Local Development

**Prerequisites:** Hugo Extended ≥ 0.123.0

```bash
hugo server
```

Site available at `http://localhost:1313`

## Project Data

All content is data-driven — edit these files, not the templates:

| File | Controls |
|------|----------|
| `content/_index.md` | All page copy — headline, CTAs, specialties, about, contact messaging |
| `data/projects/*.toml` | Work section project cards |
| `data/contact.toml` | GitHub and email contact links |

## Deploy

Push to `main` → GitHub Actions builds Hugo and deploys to GitHub Pages automatically.

The deploy workflow (`.github/workflows/deploy.yml`) runs validation gates before build:
- Project registry schema validation
- Contact data validation
- SEO tag verification (post-build)
- Google verification file checksum

## Assets

| Path | Purpose |
|------|---------|
| `assets/branding/logo-h*.svg` | Calligraphic logos — inlined at build time |
| `assets/css/main.css` | Single stylesheet — processed via Hugo Pipes |
| `static/fonts/` | Self-hosted Cormorant Garamond WOFF2 (weights 300, 400) |
| `static/assets/branding/og-image.png` | Social preview image (1200×630) |
| `static/favicon.svg` | SVG favicon |
