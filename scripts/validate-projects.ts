/* Project registry schema validation (CI pre-build gate).
   Ports the REG-* invariants from the functional spec to the typed registry.
   Run: npm run validate:projects  (tsx scripts/validate-projects.ts) */
import { projects, type Project } from '../src/data/projects';

const errors: string[] = [];
const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const seenIds = new Set<string>();
const orderByGroup: Record<string, Set<number>> = {};

for (const p of projects as Project[]) {
  const at = `project '${p.id ?? '<no id>'}'`;
  if (!p.id || !KEBAB.test(p.id)) errors.push(`${at}: id must be non-empty kebab-case (REG-002).`);
  if (seenIds.has(p.id)) errors.push(`${at}: duplicate id (REG-001).`);
  seenIds.add(p.id);
  if (typeof p.public !== 'boolean') errors.push(`${at}: 'public' must be present + boolean (REG-003/005).`);
  if (!['public-projects', 'private-work'].includes(p.group)) errors.push(`${at}: invalid group (REG-006).`);
  if (!['active', 'completed', 'archived'].includes(p.status)) errors.push(`${at}: invalid status (REG-007).`);
  if (!Number.isInteger(p.displayOrder) || p.displayOrder <= 0) errors.push(`${at}: displayOrder must be a positive integer (REG-012).`);
  if (!p.title?.trim()) errors.push(`${at}: title must be non-empty (REG-013).`);

  (orderByGroup[p.group] ??= new Set());
  if (orderByGroup[p.group].has(p.displayOrder)) errors.push(`${at}: duplicate displayOrder ${p.displayOrder} within group ${p.group} (REG-004).`);
  orderByGroup[p.group].add(p.displayOrder);

  if (p.public) {
    if (!p.publicDescription?.trim()) errors.push(`${at}: publicDescription required when public (REG-008).`);
    if (p.group === 'private-work' && !p.outcome?.trim()) errors.push(`${at}: outcome required for public private-work (REG-009).`);
  }
  if (p.group === 'private-work' && p.links && (p.links.repo || p.links.pkg || p.links.demo)) {
    errors.push(`${at}: private-work entries must carry no links — disclosure risk (REG-010).`);
  }
  if ((p.tags?.length ?? 0) > 5) console.warn(`WARN: ${at}: ${p.tags!.length} tags; only 5 render.`);
}

if (!projects.some((p) => p.public)) errors.push('Registry has zero public entries — Work section would render empty (REG-014).');

if (errors.length) {
  console.error('validate-projects: FAIL\n' + errors.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}
console.log(`validate-projects: OK — ${projects.length} entries, ${projects.filter((p) => p.public).length} public.`);
