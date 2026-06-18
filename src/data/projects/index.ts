import type { Project } from './types';
import { vcdeploy } from './vcdeploy';
import { jasminSmsExtensions } from './jasmin-sms-extensions';
import { goLibraries } from './go-libraries';
import { telecomPlatform } from './telecom-platform';
import { foodTechPlatform } from './food-tech-platform';
import { aiTooling } from './ai-tooling';

/* Authoritative project registry. The <Work> component consumes this array;
   no project data is hardcoded in components. */
export const projects: Project[] = [
  vcdeploy,
  jasminSmsExtensions,
  goLibraries,
  telecomPlatform,
  foodTechPlatform,
  aiTooling,
];

export type { Project } from './types';
