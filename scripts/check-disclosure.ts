/* Disclosure scan (CI gate). Recursively scans a directory for any term in
   .ci/disclosure-blocklist.txt (one term per line; '#' comments ignored).
   Run pre-build over src/data/ and post-build over dist/.
   Run: npx tsx scripts/check-disclosure.ts <dir> */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.argv[2];
if (!root) { console.error('usage: check-disclosure.ts <dir>'); process.exit(2); }

/* Prohibited terms come from the DISCLOSURE_BLOCKLIST secret (CI) — never a committed file (ADR-007).
   Fall back to the gitignored local .ci/disclosure-blocklist.txt for developer runs. */
let rawTerms = process.env.DISCLOSURE_BLOCKLIST ?? '';
if (!rawTerms.trim()) {
  try {
    rawTerms = readFileSync('.ci/disclosure-blocklist.txt', 'utf8');
  } catch {
    console.error('check-disclosure: no DISCLOSURE_BLOCKLIST env var and no local .ci/disclosure-blocklist.txt fallback');
    process.exit(2);
  }
}
const terms = rawTerms.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));

const TEXT = /\.(html|js|mjs|css|json|txt|xml|ts|tsx|svg)$/i;
const hits: string[] = [];

function walk(dir: string): void {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) { walk(p); continue; }
    if (!TEXT.test(name)) continue;
    const body = readFileSync(p, 'utf8').toLowerCase();
    for (const t of terms) if (body.includes(t.toLowerCase())) hits.push(`${p}: "${t}"`);
  }
}
walk(root);

if (hits.length) {
  console.error(`check-disclosure: FAIL (${root})\n` + hits.map((h) => '  - ' + h).join('\n'));
  process.exit(1);
}
console.log(`check-disclosure: OK — no blocklisted terms in ${root} (${terms.length} terms checked).`);
