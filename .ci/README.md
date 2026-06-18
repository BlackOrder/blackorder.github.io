# .ci/ — CI configuration & tooling notes

Supporting configuration for the BlackOrder site build pipeline
(`.github/workflows/deploy.yml` and `link-check.yml`). The site is a Vite + React + TypeScript
SPA, statically pre-rendered with `vite-react-ssg` and deployed to GitHub Pages.

## Files

### `versions.txt`

Pinned versions for **non-npm** CI tooling, read by the workflows at install time. Format:
`tool=VERSION`, one per line.

| Key | Tool | Purpose |
|-----|------|---------|
| `htmltest` | [htmltest](https://github.com/wjdp/htmltest) | HTML validity + image/alt checks and internal link integrity over `dist/` (deploy.yml), and external link checks over `dist/` (link-check.yml). |
| `node` | Node.js LTS | Toolchain runtime. The authoritative pin is `.nvmrc` (`node-version-file`); this line is documentation. |

npm-managed tools — `@lhci/cli`, `eslint`, `typescript`, `tsx`, `vite`, `vite-react-ssg`, etc. — are
pinned by `package-lock.json` (installed via `npm ci`), not here.

### `disclosure-blocklist.txt`

Prohibited terms for the private-work disclosure scan (`scripts/check-disclosure.ts`). One term
per line; `#` comments and blank lines ignored; case-insensitive substring match.

- Scanned **pre-build** over `src/data/` and **post-build** over `dist/`.
- **Maintenance:** update in the same commit/PR as any new private-work content in `src/data/`.

## CI gate sequence (`deploy.yml`)

Pre-build: `npm ci` → `npm run typecheck` (`tsc --noEmit`) → `npm run lint` (ESLint, `--max-warnings 0`)
→ `npm run validate:projects` (`scripts/validate-projects.ts`) → `npx tsx scripts/check-contact.ts`
→ `npx tsx scripts/check-disclosure.ts src/data`.

Build: `npm run build` (`vite-react-ssg build` → `dist/`), warnings-as-errors.

Post-build (over `dist/`): `npx tsx scripts/check-seo.ts dist/index.html` →
`npx tsx scripts/check-disclosure.ts dist` → Google-verification checksum →
`htmltest --conf .htmltest.yml dist` → `npx lhci autorun` (Lighthouse budget, `lighthouserc.cjs`).

## Updating a pinned tool version

1. Update the version in `versions.txt` (htmltest) or `package.json` + `package-lock.json` (npm tools).
2. Run the relevant CI step locally to confirm compatibility.
3. For `htmltest`: verify `.htmltest.yml` and `.htmltest-links.yml` still parse.
4. For `@lhci/cli`: verify the `lighthouserc.cjs` assertion keys are still supported.
