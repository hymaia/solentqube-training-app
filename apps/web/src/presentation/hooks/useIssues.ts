import useSWR from 'swr';
import type { Issue } from '../../domain/entities/Issue';
import { issuesRepository } from '../../infrastructure/api/HttpIssuesRepository';

export function useIssues(projectId: string): { issues: Issue[]; isLoading: boolean; error: Error | undefined } {
  const { data, isLoading, error } = useSWR<Issue[]>(['issues', projectId], () =>
    issuesRepository.listByProject(projectId),
  );
  return { issues: data ?? [], isLoading, error };
}
