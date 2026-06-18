import type { Project } from './types';

export const jasminSmsExtensions: Project = {
  id: 'jasmin-sms-extensions',
  title: 'Jasmin SMS extensions',
  public: true,
  group: 'public-projects',
  displayOrder: 2,
  status: 'active',
  featured: false,
  publicDescription:
    'Four PyPI packages extending Jasmin SMS Gateway with MongoDB integration: realtime stats, telnet management, MongoDB logging, and MongoDB configuration sync via Change Streams. Production tooling in active use.',
  audienceFraming: 'teams operating Jasmin SMS gateways at scale',
  outcome: 'Production tooling in active use.',
  tags: ['Python', 'Telecom', 'SMS', 'Open Source', 'MongoDB'],
  links: { pkg: 'https://pypi.org/user/BlackOrder/' },
  internal: { techStack: ['Python', 'MongoDB', 'Docker', 'AMQP', 'Jasmin SMS Gateway'] },
};
