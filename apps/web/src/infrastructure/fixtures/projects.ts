import type { Project, ProjectFile } from '../../domain/entities/Project';

const RAW = import.meta.glob('/fixtures/repos/**/*', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const PROJECT_NAMES: Record<string, string> = {
  'acme-payments': 'Acme Payments',
  'legacy-billing': 'Legacy Billing',
};

const FIXTURE_PREFIX = '/fixtures/repos/';

function buildProjects(): Project[] {
  const byProjectId = new Map<string, ProjectFile[]>();

  for (const [key, content] of Object.entries(RAW)) {
    const relative = key.slice(FIXTURE_PREFIX.length);
    const slashIndex = relative.indexOf('/');
    if (slashIndex === -1) continue;
    const projectId = relative.slice(0, slashIndex);
    const path = relative.slice(slashIndex + 1);
    const files = byProjectId.get(projectId) ?? [];
    files.push({ path, content });
    byProjectId.set(projectId, files);
  }

  const projects: Project[] = [];
  for (const [projectId, files] of byProjectId.entries()) {
    files.sort((a, b) => a.path.localeCompare(b.path));
    projects.push({ id: projectId, name: PROJECT_NAMES[projectId] ?? projectId, files });
  }
  projects.sort((a, b) => a.name.localeCompare(b.name));
  return projects;
}

export const PROJECTS: Project[] = buildProjects();

export function getProject(id: string): Project | undefined {
  return PROJECTS.find((project) => project.id === id);
}

export function getProjectFile(projectId: string, path: string): ProjectFile | undefined {
  return getProject(projectId)?.files.find((file) => file.path === path);
}
