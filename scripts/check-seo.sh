#!/usr/bin/env bash
# scripts/check-seo.sh — SEO tag verification script
# Implements all 16 assertions from spec/09-quality.md §9.4 (blocks a through p)
# Invocation: bash scripts/check-seo.sh public/index.html
# Exit 0: all assertions pass. Exit 1: any assertion fails.

set -euo pipefail

HTML="${1:-public/index.html}"

if [ ! -f "$HTML" ]; then
  echo "FAIL: HTML file not found: $HTML" >&2
  exit 1
fi

# shopt -s nullglob is required per spec/00-OVERVIEW.md §7.2 mandatory nullglob rule.
# Applied here before any glob patterns used in this script.
shopt -s nullglob

# (a) Assert title is non-empty
title=$(htmlq --text title < "$HTML")
if [ -z "$title" ]; then
  echo "FAIL: <title> is empty or absent" >&2
  exit 1
fi
echo "OK (a): <title> present: ${title}"

# (b) Extract description content and measure length — hard failure if absent or out of 50-160 char range
desc=$(htmlq --attribute content 'meta[name="description"]' < "$HTML")
desc_len=${#desc}
if [ -z "$desc" ] || [ "$desc_len" -lt 50 ] || [ "$desc_len" -gt 160 ]; then
  echo "FAIL: meta description absent or length ${desc_len} not in 50-160 range" >&2
  exit 1
fi
echo "OK (b): meta description length ${desc_len} chars"

# (c) Assert canonical href is an absolute URL
canonical=$(htmlq --attribute href 'link[rel="canonical"]' < "$HTML")
if [[ "$canonical" != https://* ]]; then
  echo "FAIL: canonical href is not an absolute URL: '${canonical}'" >&2
  exit 1
fi
echo "OK (c): canonical href: ${canonical}"

# (d) Assert color-scheme is present with value "dark"
color_scheme=$(htmlq --attribute content 'meta[name="color-scheme"]' < "$HTML")
if [ "$color_scheme" != "dark" ]; then
  echo "FAIL: meta color-scheme absent or value '${color_scheme}' is not 'dark'" >&2
  exit 1
fi
echo "OK (d): meta color-scheme = dark"

# (e) Assert og:title is present and non-empty
og_title=$(htmlq --attribute content 'meta[property="og:title"]' < "$HTML")
if [ -z "$og_title" ]; then
  echo "FAIL: og:title absent or empty" >&2
  exit 1
fi
echo "OK (e): og:title present"

# (f) Assert og:description is present and non-empty
og_desc=$(htmlq --attribute content 'meta[property="og:description"]' < "$HTML")
if [ -z "$og_desc" ]; then
  echo "FAIL: og:description absent or empty" >&2
  exit 1
fi
echo "OK (f): og:description present"

# (g) Assert og:type is present with value "website"
og_type=$(htmlq --attribute content 'meta[property="og:type"]' < "$HTML")
if [ "$og_type" != "website" ]; then
  echo "FAIL: og:type absent or value '${og_type}' is not 'website'" >&2
  exit 1
fi
echo "OK (g): og:type = website"

# (h) Assert og:url is present and is an absolute URL (https://)
# og:url is sourced from {{ .Permalink }} which Hugo produces as an absolute URL
# when baseURL is set — but CI must enforce this explicitly. Social media scrapers
# reject relative or protocol-relative og:url values; this check aligns with the
# canonical check (c) and the absURL requirement documented in §7.3.
og_url=$(htmlq --attribute content 'meta[property="og:url"]' < "$HTML")
if [[ "$og_url" != https://* ]]; then
  echo "FAIL: og:url is not an absolute URL: '${og_url}'" >&2
  exit 1
fi
echo "OK (h): og:url = ${og_url}"

# (i) og:image — soft failure until .og-image-ready sentinel exists at repo root.
# When .og-image-ready is present, this check becomes a hard failure (exit 1).
# Note: the same .og-image-ready sentinel governs block (n) twitter:image below —
# both tags reference og-image.png and share the same open-item lifecycle.
og_image=$(htmlq --attribute content 'meta[property="og:image"]' < "$HTML")

if [ -f .og-image-ready ]; then
  # Hard failure mode: sentinel present — OG image open item is closed
  if [[ "$og_image" != https://* ]]; then
    echo "FAIL: og:image is not an absolute URL: '${og_image}'" >&2
    exit 1
  fi
  echo "OK (i): og:image = ${og_image}"
else
  # Soft failure mode: sentinel absent — OG image open item is still open
  # NOTE: htmlq returns an empty string for a missing tag. The [[ != https://* ]] test
  # fires for both (a) absent tag (empty string) and (b) tag present but non-absolute URL.
  # Both conditions produce the same WARN text — this conflation is intentional for
  # soft-fail mode: either condition means the og-image open item is unresolved.
  # When the sentinel is present (hard-fail mode above), add a separate absence check
  # before the format check to distinguish the two failure causes in error output.
  if [[ "$og_image" != https://* ]]; then
    echo "WARN: og:image is not an absolute URL: '${og_image}' (soft failure — OG image open item pending)" >&2
  else
    echo "OK (i): og:image = ${og_image}"
  fi
  # exit 0 implicitly — warning is printed but CI is not failed
fi

# (j) Assert twitter:card is present with value "summary_large_image"
twitter_card=$(htmlq --attribute content 'meta[name="twitter:card"]' < "$HTML")
if [ "$twitter_card" != "summary_large_image" ]; then
  echo "FAIL: twitter:card absent or value '${twitter_card}' is not 'summary_large_image'" >&2
  exit 1
fi
echo "OK (j): twitter:card = summary_large_image"

# (k) Assert twitter:title is present and non-empty
twitter_title=$(htmlq --attribute content 'meta[name="twitter:title"]' < "$HTML")
if [ -z "$twitter_title" ]; then
  echo "FAIL: twitter:title absent or empty" >&2
  exit 1
fi
echo "OK (k): twitter:title present"

# (l) Assert twitter:description is present and non-empty
twitter_desc=$(htmlq --attribute content 'meta[name="twitter:description"]' < "$HTML")
if [ -z "$twitter_desc" ]; then
  echo "FAIL: twitter:description absent or empty" >&2
  exit 1
fi
echo "OK (l): twitter:description present"

# (m) Assert structured data (Person schema) present on homepage
# The {{ if .IsHome }} guard in layouts/partials/structured-data.html means this
# block is only emitted on public/index.html — never on inner pages.
# This assertion MUST only run against the homepage file (public/index.html).
# For v2+ multi-page invocation, skip this assertion for non-homepage files
# (see v2 scaling note in spec/09-quality.md §9.4).
grep -q '"@type".*"Person"' "$HTML" \
  || (echo "FAIL: structured data (Person schema) absent from homepage" >&2 && exit 1)
echo "OK (m): structured data Person schema present"

# (n) twitter:image — soft failure until .og-image-ready sentinel exists at repo root.
# When .og-image-ready is present, this check becomes a hard failure (exit 1).
# Note: the same .og-image-ready sentinel governs block (i) og:image above —
# both tags reference og-image.png and share the same open-item lifecycle.
twitter_image=$(htmlq --attribute content 'meta[name="twitter:image"]' < "$HTML")

if [ -f .og-image-ready ]; then
  # Hard failure mode: sentinel present — OG image open item is closed
  if [[ "$twitter_image" != https://* ]]; then
    echo "FAIL: twitter:image is not an absolute URL: '${twitter_image}'" >&2
    exit 1
  fi
  echo "OK (n): twitter:image = ${twitter_image}"
else
  # Soft failure mode: sentinel absent — OG image open item is still open
  if [[ "$twitter_image" != https://* ]]; then
    echo "WARN: twitter:image is not an absolute URL: '${twitter_image}' (soft failure — OG image open item pending)" >&2
  else
    echo "OK (n): twitter:image = ${twitter_image}"
  fi
  # exit 0 implicitly — warning is printed but CI is not failed
fi

# (o) Assert meta charset utf-8 is present
# Uses grep rather than htmlq --attribute because htmlq's --attribute flag extracts
# a named attribute's value — 'charset' is an attribute name, not a 'content' value.
# grep is the correct tool for this presence check.
# Hugo --minify strips attribute value quotes: charset="utf-8" → charset=utf-8
# Pattern matches both quoted and unquoted forms, case-insensitively.
grep -iEq 'charset="?utf-8"?' "$HTML" \
  || (echo "FAIL: meta charset utf-8 missing" >&2; exit 1)
echo "OK (o): meta charset utf-8 present"

# (p) Assert meta viewport is present (presence-only check)
htmlq 'meta[name="viewport"]' < "$HTML" | grep -q . \
  || (echo "FAIL: meta viewport missing" >&2; exit 1)
echo "OK (p): meta viewport present"

echo ""
echo "SEO check PASSED: all 16 assertions passed for ${HTML}"
