#!/usr/bin/env bash
# scripts/check-contact.sh — Contact data validation script
# Validates data/contact.toml: github field must be present and non-empty,
# beginning with https://github.com/
# CI step name: "Contact data validation"
# Invocation: bash scripts/check-contact.sh
# Exit 0: validation passes. Exit 1: any failure.
# Spec reference: spec/09-quality.md §9.10, spec/03-technical.md §3.4 step 4

set -euo pipefail

if [ ! -f data/contact.toml ]; then
  echo "FAIL: data/contact.toml not found" >&2
  exit 1
fi

github_val=$(grep '^github' data/contact.toml | sed 's/^github *= *"\(.*\)"/\1/')
if [ -z "$github_val" ]; then
  echo "FAIL: data/contact.toml github field is empty or missing" >&2
  exit 1
fi
if [[ "$github_val" != https://github.com/* ]]; then
  echo "FAIL: data/contact.toml github field must begin with https://github.com/ (got: $github_val)" >&2
  exit 1
fi
echo "OK: data/contact.toml github field validated: $github_val"
