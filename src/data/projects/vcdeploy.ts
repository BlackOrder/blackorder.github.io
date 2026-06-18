import type { Project } from './types';

export const vcdeploy: Project = {
  id: 'vcdeploy',
  title: 'vcdeploy',
  public: true,
  group: 'public-projects',
  displayOrder: 1,
  status: 'active',
  featured: false,
  publicDescription:
    'Manages web application lifecycle across servers without downtime. Webhook-driven deploys from GitHub, GitLab, and Bitbucket. Zero-downtime symlink releases. Web UI with RBAC and 2FA. AES-256-GCM secret encryption with auto key rotation. Built in Go with gRPC master-agent architecture.',
  audienceFraming: 'teams deploying Go applications to production',
  outcome: 'Manages web application lifecycle across servers without downtime.',
  tags: ['Go', 'gRPC', 'DevOps', 'Open Source', 'Security'],
  links: { repo: 'https://github.com/BlackOrder/vcdeploy' },
  internal: { techStack: ['Go', 'gRPC', 'SQLite', 'TypeScript', 'Docker', 'HTML'] },
};
