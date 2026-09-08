import type { IssueSeverity } from '../../../domain/entities/Issue';

const CLASS_BY_SEVERITY: Record<IssueSeverity, string> = {
  BLOCKER: 'sev-blocker',
  CRITICAL: 'sev-critical',
  MAJOR: 'sev-major',
  MINOR: 'sev-minor',
  INFO: 'sev-info',
};

export function SeverityBadge({ severity }: { severity: IssueSeverity }) {
  return <span className={`chip ${CLASS_BY_SEVERITY[severity]}`}>{severity}</span>;
}
