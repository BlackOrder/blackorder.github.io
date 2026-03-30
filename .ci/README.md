# .ci/ — CI Tool Dependency Notes

This directory contains pinned tool versions and supporting CI configuration for the BlackOrder personal brand site build pipeline.

## Files

### `versions.txt`

Pinned versions for all external CI tools. Read by the `.github/workflows/deploy.yml` build job to install tools at a specific version for reproducibility.

Format: `tool=VERSION` (one entry per line).

| Key | Tool | Version | Purpose |
|-----|------|---------|---------|
| `htmltest` | [htmltest](https://github.com/wjdp/htmltest) | 0.17.0 | HTML structural validity and image alt-text checks (spec §9.2) and internal link integrity (spec §9.3). Two separate configs: `.htmltest.yml` (structural) and `.htmltest-links.yml` (links). |
| `htmlq` | [htmlq](https://github.com/mgdm/htmlq) | 0.4.0 | CSS selector-based attribute extraction from HTML. Used by `scripts/check-seo.sh` to assert SEO meta tag presence and values (spec §9.4). |
| `@lhci/cli` | [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) | 0.14.0 | Performance, LCP, CLS, FCP, and payload budget assertions against `public/` build output (spec §7.1). Minimum version supporting `staticDistDir` and the assertion keys in `lighthouserc.js`. |
| `node` | Node.js (LTS) | 22 | Required for `@lhci/cli`. Pinned to major version 22 LTS (not floating `lts/*`) for reproducibility. Pin in `actions/setup-node@v4` step. |

### `disclosure-blocklist.txt`

Versioned list of prohibited terms for the private work disclosure scan (spec §9.6).

- One term per line. Lines beginning with `#` are comments. Empty lines are ignored.
- Scanned against `data/projects/*.toml` (pre-build, `internal.notes` and `internal.tech_stack` fields only) and `public/` rendered output (post-build).
- **Maintenance rule:** Update this file in the same commit or PR as any new private work content added to `data/projects/` or `content/_index.md`.
- Authoritative prohibited categories: spec/05-content.md §5.5 (client proper nouns, internal codenames, non-owner email addresses, internal URLs, unreleased tooling names).

### `README.md`

This file. Documents CI tool dependencies and version rationale.

## Updating Tool Versions

When upgrading a pinned tool version:

1. Update the version string in `versions.txt`.
2. Test the new version locally by running the relevant CI step manually.
3. Update this README if the tool's behavior or purpose has changed.
4. For `htmltest`: verify `.htmltest.yml` and `.htmltest-links.yml` configs remain compatible with the new version.
5. For `htmlq`: verify `scripts/check-seo.sh` selector syntax remains compatible.
6. For `@lhci/cli`: verify `lighthouserc.js` assertion key names remain supported.
7. For `node`: check `@lhci/cli` compatibility with the new Node.js major version before pinning.

## Python Dependency (`validate-projects.sh`)

`scripts/validate-projects.sh` uses Python 3 with `tomllib` (Python 3.11+, stdlib) or `tomli` (Python 3.10 fallback, pip-installed). The `ubuntu-latest` GitHub Actions runner ships Python 3.12+ as of 2026, satisfying the `tomllib` path without pip install.

If the runner image ships a Python version below 3.10 in the future, the script will hard-fail with a version assertion error. Remediation: add a `setup-python` step to the workflow pinning Python 3.12.

Spec reference: spec/03-technical.md §3.6 (validate-projects.sh Python dependency rationale).
