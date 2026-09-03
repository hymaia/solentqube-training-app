import type { IssueStatus } from '../../../domain/entities/Issue';

const LABELS: Record<IssueStatus, string> = {
  OPEN: 'Open',
  CONFIRMED: 'Confirmed',
  RESOLVED: 'Resolved',
  FALSE_POSITIVE: 'False positive',
};

export function StatusBadge({ status }: { status: IssueStatus }) {
  return <span className="status-badge">{LABELS[status]}</span>;
}
