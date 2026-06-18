import type { Project } from './types';

export const aiTooling: Project = {
  id: 'ai-tooling',
  title: 'AI Tooling',
  public: true,
  group: 'private-work',
  displayOrder: 3,
  status: 'active',
  featured: false,
  publicDescription:
    'Developer tooling for AI-assisted workflows. MCP server exposing 38 tools. VS Code extension embedding the MCP server in-process. Claude Code plugin layer. Consolidates 38 MCP tools and two extension layers into a single in-process interface — eliminates tool-switching across four previously separate developer surfaces.',
  outcome:
    'Consolidates 38 MCP tools and two extension layers into a single in-process interface — eliminates tool-switching across four previously separate developer surfaces.',
  tags: ['TypeScript', 'MCP', 'VS Code', 'AI Tooling'],
  internal: { techStack: ['TypeScript', 'Shell', 'MCP Protocol', 'VS Code Extension API'] },
};
