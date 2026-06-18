import Reveal from './motion/Reveal';

const HERO_TAGS = ['Go', 'Telecom / RBT', 'Microservices', 'DevOps'];

export default function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="container">
        <Reveal>
          <div className="hero__content">
            <span className="hero__logo">
              <img src="/branding/logo-badge.webp" alt="BlackOrder" width={72} height={72} />
            </span>
            <p className="eyebrow">Architecture · Integrations</p>
            <h1 className="hero__headline">Backend systems. Built to scale.</h1>
            <p className="hero__sub">
              Go backend engineer — platform architecture, telecom infrastructure, and system integrations.
            </p>
            <ul className="hero__tags">
              {HERO_TAGS.map((t) => (
                <li key={t} className="badge">{t}</li>
              ))}
            </ul>
            <div className="hero__actions">
              <a className="btn btn--primary" href="#contact">Work together</a>
              <a className="btn btn--ghost" href="#work">See my work ↓</a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
