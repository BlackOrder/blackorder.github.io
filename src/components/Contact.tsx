import { contact } from '../data/contact';
import Reveal from './motion/Reveal';

export default function Contact() {
  return (
    <section id="contact" className="section">
      <div className="container">
        <p className="eyebrow">Get in touch</p>
        <h2 className="section__title">Work together</h2>
        <Reveal>
          <div className="contact__body">
            <p>
              Available for project-based engagements — platform architecture, telecom infrastructure, and
              system integrations. The fastest way to reach me is GitHub.
            </p>
            <div className="hero__actions">
              <a className="btn btn--primary" href={contact.github} rel="noopener noreferrer" target="_blank">
                BlackOrder on GitHub
                <span className="visually-hidden"> (opens in new tab)</span> ↗
              </a>
              {contact.email && (
                <a className="btn btn--ghost" href={`mailto:${contact.email}`}>
                  Email me
                </a>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
