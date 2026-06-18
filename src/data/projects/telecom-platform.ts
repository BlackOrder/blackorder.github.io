import type { Project } from './types';

export const telecomPlatform: Project = {
  id: 'telecom-platform',
  title: 'Telecom Platform',
  public: true,
  group: 'private-work',
  displayOrder: 1,
  status: 'completed',
  featured: false,
  publicDescription:
    'Complete cloud and on-premise RBT platform for a telecom operator. Built in Go. Each node sustains ~20,000 concurrent active-caller requests in production — operator-scale real-time subscriber responses.',
  outcome:
    'Each node sustains ~20,000 concurrent active-caller requests in production — operator-scale real-time subscriber responses.',
  tags: ['Go', 'Telecom', 'RBT', 'Architecture'],
  internal: { techStack: ['Go', 'PHP', 'TypeScript', 'Next.js', 'MongoDB', 'Docker'] },
};
