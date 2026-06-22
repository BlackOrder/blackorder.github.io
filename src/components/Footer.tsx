import { contact } from '../data/contact';

export default function Footer() {
  // Static year keeps the prerendered output deterministic (no build-time Date dependency).
  const year = 2026;
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <a className="footer__logo" href="#hero" aria-label="BlackOrder — home">
          <img src="/branding/logo-wordmark.webp" alt="" aria-hidden="true" width={180} height={36} />
        </a>
        <span className="footer__rule" aria-hidden="true" />
        <p className="footer__copy">
          © {year} BlackOrder ·{' '}
          <a href={contact.github} rel="noopener noreferrer" target="_blank">
            GitHub<span className="visually-hidden"> (opens in new tab)</span>
          </a>
        </p>
      </div>
    </footer>
  );
}
