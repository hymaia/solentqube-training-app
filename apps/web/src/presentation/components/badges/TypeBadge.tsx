import type { IssueType } from '../../../domain/entities/Issue';

const LABELS: Record<IssueType, string> = {
  VULNERABILITY: 'Vulnerability',
  QUALITY_GATE_VIOLATION: 'Quality gate',
  COMMENT: 'Comment',
};

export function TypeBadge({ type }: { type: IssueType }) {
  return <span className="type-badge">{LABELS[type]}</span>;
}
