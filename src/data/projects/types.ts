export type ProjectGroup = 'public-projects' | 'private-work';
export type ProjectStatus = 'active' | 'completed' | 'archived';

export interface ProjectLinks {
  repo?: string;
  pkg?: string;
  demo?: string;
}

export interface ProjectInternal {
  /* Never rendered. Editorial `notes` are intentionally omitted from committed modules
     (src/data/ is public in git history) — keep only non-sensitive tech context. */
  techStack?: string[];
}

export interface Project {
  id: string; // kebab-case; MUST equal the module file stem
  title: string;
  public: boolean; // single rendering gate
  group: ProjectGroup;
  displayOrder: number; // unique within group
  status: ProjectStatus;
  featured: boolean;
  publicDescription: string; // required when public
  audienceFraming?: string;
  outcome?: string; // required when public && group === 'private-work'
  tags?: string[]; // max 5 rendered
  links?: ProjectLinks; // forbidden for private-work
  internal?: ProjectInternal;
}
