#!/usr/bin/env bash
# scripts/validate-projects.sh — Project registry schema validation
# Validates all files in data/projects/*.toml against the canonical schema.
# CI step: runs at step 3 (after checkout, before Hugo setup and build).
# Invocation: bash scripts/validate-projects.sh
# Exit 0: all checks pass. Exit non-zero: any schema violation found.
# Spec reference: spec/03-technical.md §3.6, spec/09-quality.md §9.9 tracker

set -euo pipefail

# shopt -s nullglob is required per spec/00-OVERVIEW.md §7.2 mandatory nullglob rule:
# without it, if data/projects/*.toml produces no matches, the literal string
# "data/projects/*.toml" is passed as a filename to grep, causing "No such file
# or directory" under set -euo pipefail.
shopt -s nullglob

# Assert Python >= 3.10 (required for tomllib or tomli fallback)
python3 -c "import sys; assert sys.version_info >= (3,10), f'Python >=3.10 required, got {sys.version}'"

toml_files=(data/projects/*.toml)
if [ ${#toml_files[@]} -eq 0 ]; then
  echo "FAIL: no TOML files found in data/projects/ — at least one project entry required (REG-014)" >&2
  exit 1
fi

# REG-015 / REG-016: pre-validate single-line notes and tech_stack before Python parsing
# Detect triple-quoted notes (multi-line TOML string) — prohibited by REG-015
for f in "${toml_files[@]}"; do
  if grep -q '^notes *= *"""' "$f"; then
    echo "FAIL (REG-015): ${f}: internal.notes must be a single-line TOML string — triple-quoted multi-line values are prohibited" >&2
    exit 1
  fi
  # Detect multi-line tech_stack array: opening bracket with no closing bracket on same line
  if grep -qP '^tech_stack\s*=\s*\[(?!.*\])' "$f" 2>/dev/null || \
     grep -E '^tech_stack\s*=\s*\[' "$f" | grep -qv '\]'; then
    echo "FAIL (REG-016): ${f}: internal.tech_stack must be a single-line inline TOML array — multi-line array syntax is prohibited" >&2
    exit 1
  fi
done

# Run Python-based TOML validation for all REG rules
python3 - "${toml_files[@]}" << 'PYEOF'
import sys
import re
import os

# tomllib (Python 3.11+) or tomli fallback (Python 3.10)
try:
    import tomllib
except ModuleNotFoundError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "--quiet", "tomli"])
    import tomli as tomllib

VALID_GROUPS = {"public-projects", "private-work"}
VALID_STATUSES = {"active", "completed", "archived"}
KEBAB_RE = re.compile(r'^[a-z0-9]+(-[a-z0-9]+)*$')

files = sys.argv[1:]
errors = []
all_projects = {}  # slug -> data dict for cross-file checks

# ── Pass 1: parse and per-file validation ────────────────────────────────────
for filepath in files:
    stem = os.path.splitext(os.path.basename(filepath))[0]
    with open(filepath, "rb") as f:
        try:
            data = tomllib.load(f)
        except Exception as e:
            errors.append(f"FAIL (PARSE): {filepath}: TOML parse error: {e}")
            continue

    # REG-001: id must equal filename stem
    if data.get("id") != stem:
        errors.append(f"FAIL (REG-001): {filepath}: id '{data.get('id')}' does not match filename stem '{stem}'")

    # REG-002: id must be kebab-case
    entry_id = data.get("id", "")
    if not KEBAB_RE.match(entry_id):
        errors.append(f"FAIL (REG-002): {filepath}: id '{entry_id}' is not kebab-case (lowercase, hyphens, digits only)")

    # REG-003: public field must be explicitly present
    if "public" not in data:
        errors.append(f"FAIL (REG-003): {filepath}: 'public' field is absent — must be explicitly present")

    # REG-005: group, display_order, status, featured all present; boolean type validation
    for required_field in ("group", "display_order", "status", "featured", "title"):
        if required_field not in data:
            errors.append(f"FAIL (REG-005/REG-013): {filepath}: required field '{required_field}' is absent")

    # Boolean type validation for public and featured (REG-005)
    for bool_field in ("public", "featured"):
        if bool_field in data and not isinstance(data[bool_field], bool):
            errors.append(f"FAIL (REG-005): {filepath}: field '{bool_field}' must be a boolean (true/false), got {type(data[bool_field]).__name__}")

    # REG-006: group must be one of the valid values
    group = data.get("group", "")
    if group not in VALID_GROUPS:
        errors.append(f"FAIL (REG-006): {filepath}: group '{group}' is not valid — must be one of {sorted(VALID_GROUPS)}")

    # REG-007: status must be one of the valid values
    status = data.get("status", "")
    if status not in VALID_STATUSES:
        errors.append(f"FAIL (REG-007): {filepath}: status '{status}' is not valid — must be one of {sorted(VALID_STATUSES)}")

    # REG-012: display_order must be a positive integer
    display_order = data.get("display_order")
    if display_order is not None:
        if not isinstance(display_order, int) or isinstance(display_order, bool) or display_order < 1:
            errors.append(f"FAIL (REG-012): {filepath}: display_order must be a positive integer (got {display_order!r})")

    # REG-013: title must be non-empty for ALL entries (regardless of public value)
    title = data.get("title", "")
    if not title or not str(title).strip():
        errors.append(f"FAIL (REG-013): {filepath}: title is absent or empty — required for all entries")

    is_public = data.get("public", False)
    group = data.get("group", "")

    # REG-008: public = true entries must have non-empty public_description
    if is_public:
        pub_desc = data.get("public_description", "")
        if not pub_desc or not str(pub_desc).strip():
            errors.append(f"FAIL (REG-008): {filepath}: public = true but public_description is absent or empty")

    # REG-009: public = true AND group = "private-work" must have non-empty outcome
    if is_public and group == "private-work":
        outcome = data.get("outcome", "")
        if not outcome or not str(outcome).strip():
            errors.append(f"FAIL (REG-009): {filepath}: public = true and group = private-work but outcome is absent or empty")

    # REG-010: group = "private-work" entries must have no links.repo, links.pkg, links.demo
    if group == "private-work":
        links = data.get("links", {})
        for link_field in ("repo", "pkg", "demo"):
            val = links.get(link_field, "")
            if val and str(val).strip():
                errors.append(f"FAIL (REG-010): {filepath}: group = private-work but links.{link_field} is non-empty — disclosure risk")

    # REG-015: internal.notes must be single-line (no newlines in value)
    internal = data.get("internal", {})
    notes = internal.get("notes", "")
    if notes and "\n" in str(notes):
        errors.append(f"FAIL (REG-015): {filepath}: internal.notes contains newlines — must be a single-line TOML string")

    # REG-016: internal.tech_stack must be single-line inline array
    # (detected at shell level above; Python-level check for value integrity)
    tech_stack = internal.get("tech_stack", [])
    if not isinstance(tech_stack, list):
        errors.append(f"FAIL (REG-016): {filepath}: internal.tech_stack must be an array (got {type(tech_stack).__name__})")

    # Tags warning (non-fatal) — not a REG hard failure per §3.6 REG table footnote
    tags = data.get("tags", [])
    if isinstance(tags, list) and len(tags) > 5:
        print(f"WARN: {filepath}: tags array has {len(tags)} entries; template silently truncates to 5 — remove extra tags to avoid confusion", file=sys.stderr)

    all_projects[stem] = data

# ── Pass 2: cross-file checks ────────────────────────────────────────────────

# REG-004: display_order must be unique within same group across all files
from collections import defaultdict
group_order_map = defaultdict(dict)  # group -> {display_order -> filepath}
for stem, data in all_projects.items():
    group = data.get("group", "")
    display_order = data.get("display_order")
    if group and display_order is not None and isinstance(display_order, int):
        filepath = f"data/projects/{stem}.toml"
        if display_order in group_order_map[group]:
            existing = group_order_map[group][display_order]
            errors.append(
                f"FAIL (REG-004): {filepath}: display_order {display_order} in group '{group}' "
                f"duplicates entry in {existing}"
            )
        else:
            group_order_map[group][display_order] = filepath

# REG-014: at least one entry with public = true must exist
public_count = sum(1 for data in all_projects.values() if data.get("public") is True)
if public_count == 0:
    errors.append(
        "FAIL (REG-014): no entries with public = true found across all data/projects/*.toml files — "
        "Work section would render empty; at least one public entry is required before deploy"
    )

# ── Report ────────────────────────────────────────────────────────────────────
if errors:
    print("", file=sys.stderr)
    print(f"validate-projects.sh: {len(errors)} validation error(s) found:", file=sys.stderr)
    for err in errors:
        print(f"  {err}", file=sys.stderr)
    print("", file=sys.stderr)
    sys.exit(1)

print(f"validate-projects.sh: all checks passed ({len(all_projects)} file(s) validated, {public_count} public entry/entries)")
PYEOF
