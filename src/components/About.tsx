import { contact } from '../data/contact';
import Reveal from './motion/Reveal';

export default function About() {
  return (
    <section id="about" className="section section--surface">
      <div className="container">
        <p className="eyebrow">About</p>
        <h2 className="section__title">About</h2>
        <Reveal>
          <div className="about__body">
            <p>
              Senior backend engineer with a 13-year history shipping production systems. Primary language Go,
              with depth across PHP, Python, Node.js, and TypeScript — chosen by the problem, not by habit.
            </p>
            <p>
              Domains of depth: <strong>telecom</strong> (RBT platforms, SMS gateways, SMPP, AT commands),
              <strong> food-tech</strong> (full restaurant/delivery microservices), and{' '}
              <strong>DevOps</strong> (zero-downtime deployment, Docker, systemd, CI/CD).
            </p>
            <p>
              <strong>Open-source credibility:</strong> 3,000+ GitHub contributions in the last year and 11
              published packages across Go modules, PyPI, and npm — production code others depend on.{' '}
              <a href={contact.github} rel="noopener noreferrer" target="_blank">
                See the work on GitHub
                <span className="visually-hidden"> (opens in new tab)</span> →
              </a>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
