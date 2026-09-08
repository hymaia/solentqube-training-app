import type { Issue, IssueType, IssueSeverity } from '../../domain/entities/Issue';

const ISSUE_TYPES: IssueType[] = ['VULNERABILITY', 'QUALITY_GATE_VIOLATION', 'COMMENT'];
const ISSUE_SEVERITIES: IssueSeverity[] = ['BLOCKER', 'CRITICAL', 'MAJOR', 'MINOR', 'INFO'];

export function groupIssuesByLine(issues: Issue[]): Map<number, Issue[]> {
  const byLine = new Map<number, Issue[]>();
  for (const issue of issues) {
    const bucket = byLine.get(issue.line) ?? [];
    bucket.push(issue);
    byLine.set(issue.line, bucket);
  }
  return byLine;
}

export function countIssuesByFile(issues: Issue[]): Map<string, number> {
  const byFile = new Map<string, number>();
  for (const issue of issues) {
    byFile.set(issue.filePath, (byFile.get(issue.filePath) ?? 0) + 1);
  }
  return byFile;
}

export function summarize(issues: Issue[]): {
  total: number;
  byType: Record<IssueType, number>;
  bySeverity: Record<IssueSeverity, number>;
} {
  const byType = {} as Record<IssueType, number>;
  for (const type of ISSUE_TYPES) byType[type] = 0;
  const bySeverity = {} as Record<IssueSeverity, number>;
  for (const severity of ISSUE_SEVERITIES) bySeverity[severity] = 0;

  for (const issue of issues) {
    byType[issue.type] += 1;
    if (issue.severity !== null) bySeverity[issue.severity] += 1;
  }

  return { total: issues.length, byType, bySeverity };
}
