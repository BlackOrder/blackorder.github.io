import type { Project } from './types';

export const foodTechPlatform: Project = {
  id: 'food-tech-platform',
  title: 'Food-Tech Platform',
  public: true,
  group: 'private-work',
  displayOrder: 2,
  status: 'completed',
  featured: false,
  publicDescription:
    'Full restaurant and food delivery platform. 10+ Go microservices, built from scratch. Complete stack: order management, delivery routing, merchant tooling. Replaced a fragmented legacy operation with a single integrated system owned end-to-end.',
  outcome:
    'Replaced a fragmented legacy operation with a single integrated system owned end-to-end.',
  tags: ['Go', 'Microservices', 'Architecture', 'Food-Tech'],
  internal: { techStack: ['Go', 'PostgreSQL', 'TypeScript', 'Docker', 'MongoDB'] },
};
