const LINKS: ReadonlyArray<readonly [string, string]> = [
  ['#specialties', 'Specialties'],
  ['#work', 'Work'],
  ['#about', 'About'],
  ['#contact', 'Contact'],
];

export default function Nav() {
  return (
    <nav className="nav" aria-label="Primary">
      <div className="container nav__inner">
        <a className="nav__logo" href="#hero" aria-label="BlackOrder — home">
          <img src="/branding/logo-wordmark.webp" alt="" aria-hidden="true" width={180} height={36} />
        </a>
        <ul className="nav__links">
          {LINKS.map(([href, label]) => (
            <li key={href}>
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
