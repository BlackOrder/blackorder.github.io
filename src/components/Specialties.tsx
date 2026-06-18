import Reveal from './motion/Reveal';

const SPECIALTIES: ReadonlyArray<readonly [string, string]> = [
  [
    'Architecture',
    'Builds and rebuilds complete systems from the ground up — from operator-scale RBT telecom platforms to multi-service food-tech stacks, owned end-to-end.',
  ],
  [
    'Integrations',
    'Links systems together — gateways, protocols (SMPP, gRPC, AMQP), and services woven into coherent, reliable platforms.',
  ],
];

export default function Specialties() {
  return (
    <section id="specialties" className="section section--surface">
      <div className="container">
        <p className="eyebrow">What I do</p>
        <h2 className="section__title">Specialties</h2>
        <div className="specialties__grid">
          {SPECIALTIES.map(([title, desc], i) => (
            <Reveal key={title} delay={i * 0.08}>
              <article className="specialty">
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
