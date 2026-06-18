import type { Project } from './types';

export const goLibraries: Project = {
  id: 'go-libraries',
  title: 'Go libraries',
  public: true,
  group: 'public-projects',
  displayOrder: 3,
  status: 'active',
  featured: false,
  publicDescription:
    'Seven published Go modules covering production infrastructure primitives: batchwriter, chanhub, configwatcher, reloader, systemd, throttler, complete-command. CI, tests, and documentation on each package.',
  audienceFraming:
    'Go engineers building production services that need reliable infrastructure primitives',
  tags: ['Go', 'Open Source'],
  links: { repo: 'https://github.com/BlackOrder' },
  internal: { techStack: ['Go', 'GitHub Actions'] },
};
