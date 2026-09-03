import type { Issue } from '../entities/Issue';

export interface IIssuesRepository {
  listByProject(projectId: string): Promise<Issue[]>;
}
