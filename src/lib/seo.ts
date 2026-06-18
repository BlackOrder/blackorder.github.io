import { contact } from '../data/contact';

export const SITE = {
  name: 'BlackOrder',
  titleFull: 'BlackOrder — Backend systems, built to scale',
  description:
    'Go backend engineer specializing in platform architecture, telecom infrastructure, and system integrations.',
  url: 'https://blackorder.dev',
  ogImage: 'https://blackorder.dev/assets/branding/og-image.png',
} as const;

/* Homepage-only JSON-LD Person schema. */
export const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: SITE.name,
  url: SITE.url,
  sameAs: [contact.github],
};
