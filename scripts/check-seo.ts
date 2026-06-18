/* SEO tag verification over the prerendered output (post-build CI gate).
   Run: npx tsx scripts/check-seo.ts dist/index.html */
import { readFileSync } from 'node:fs';

const file = process.argv[2] ?? 'dist/index.html';
const html = readFileSync(file, 'utf8');

const checks: Array<[string, boolean]> = [
  ['<title> non-empty', /<title[^>]*>[^<]{3,}<\/title>/i.test(html)],
  ['meta description', /<meta[^>]+name=["']description["'][^>]+content=["'][^"']{30,}/i.test(html)],
  ['canonical', /<link[^>]+rel=["']canonical["']/i.test(html)],
  ['color-scheme dark', /<meta[^>]+name=["']color-scheme["'][^>]+content=["']dark["']/i.test(html)],
  ['og:title', /<meta[^>]+property=["']og:title["']/i.test(html)],
  ['og:description', /<meta[^>]+property=["']og:description["']/i.test(html)],
  ['og:image', /<meta[^>]+property=["']og:image["']/i.test(html)],
  ['og:url', /<meta[^>]+property=["']og:url["']/i.test(html)],
  ['twitter:card', /<meta[^>]+name=["']twitter:card["']/i.test(html)],
  ['JSON-LD Person', /application\/ld\+json[^>]*>[^<]*"@type"\s*:\s*"Person"/i.test(html)],
  ['rendered content (no empty #root)', /<h1[^>]*>[^<]+<\/h1>/i.test(html)],
];

const failed = checks.filter(([, ok]) => !ok).map(([n]) => n);
if (failed.length) {
  console.error(`check-seo: FAIL (${file})\n` + failed.map((f) => '  - missing: ' + f).join('\n'));
  process.exit(1);
}
console.log(`check-seo: OK — ${checks.length} assertions pass against ${file}`);
