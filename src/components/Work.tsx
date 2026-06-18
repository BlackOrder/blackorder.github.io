import { projects, type Project } from '../data/projects';
import Reveal from './motion/Reveal';

const GROUPS: ReadonlyArray<readonly [Project['group'], string]> = [
  ['public-projects', 'Public Projects'],
  ['private-work', 'Private Work'],
];

function sortGroup(items: Project[]): Project[] {
  return [...items].sort(
    (a, b) => Number(b.featured) - Number(a.featured) || a.displayOrder - b.displayOrder,
  );
}

export default function Work() {
  const publicEntries = projects.filter((p) => p.public);
  return (
    <section id="work" className="section">
      <div className="container">
        <p className="eyebrow">Selected work</p>
        <h2 className="section__title">Work</h2>
        {GROUPS.map(([group, label]) => {
          const entries = sortGroup(publicEntries.filter((p) => p.group === group));
          if (entries.length === 0) return null;
          return (
            <div className="work__group" key={group}>
              <h3 className="work__group-header">{label}</h3>
              <div className="work__cards">
                {entries.map((p, i) => (
                  <Reveal key={p.id} delay={i * 0.05}>
                    <ProjectCard project={p} />
                  </Reveal>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ProjectCard({ project: p }: { project: Project }) {
  const isPrivate = p.group === 'private-work';
  const tags = (p.tags ?? []).slice(0, 5);
  return (
    <article
      className="card"
      data-status={p.status}
      aria-label={p.featured ? `Featured project: ${p.title}` : undefined}
    >
      <header className="card__header">
        <span className="card__title">{p.title}</span>
        {isPrivate && <span className="card__meta">Private Engagement</span>}
      </header>
      <p className="card__copy">
        {p.audienceFraming ? <strong>For {p.audienceFraming}: </strong> : null}
        {p.publicDescription}
      </p>
      {isPrivate && p.outcome ? <p className="card__outcome">{p.outcome}</p> : null}
      {tags.length > 0 && (
        <ul className="tags" aria-label="Technologies">
          {tags.map((t) => (
            <li key={t} className="badge">{t}</li>
          ))}
        </ul>
      )}
      {!isPrivate && p.links && (
        <footer className="card__links">
          {p.links.repo && <CardLink href={p.links.repo} label="GitHub" title={p.title} />}
          {p.links.pkg && <CardLink href={p.links.pkg} label="Package" title={p.title} />}
          {p.links.demo && <CardLink href={p.links.demo} label="Demo" title={p.title} />}
        </footer>
      )}
    </article>
  );
}

function CardLink({ href, label, title }: { href: string; label: string; title: string }) {
  return (
    <a href={href} rel="noopener noreferrer" target="_blank">
      {label}
      <span className="visually-hidden"> — {title} ({label}, opens in new tab)</span>
    </a>
  );
}
