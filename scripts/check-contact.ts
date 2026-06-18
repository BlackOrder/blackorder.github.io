/* Contact-data validation (CI pre-build gate).
   Asserts the GitHub link — the mandatory launch contact/trust anchor (behavior/content) —
   is a non-empty https://github.com/ URL. Run: npx tsx scripts/check-contact.ts */
import { contact } from '../src/data/contact';

if (!contact.github || !/^https:\/\/github\.com\/.+/.test(contact.github)) {
  console.error(
    `check-contact: FAIL — contact.github must be a non-empty https://github.com/ URL (got: ${contact.github ?? '<unset>'}).`,
  );
  process.exit(1);
}
console.log(`check-contact: OK — ${contact.github}`);
