export type IssueType = 'VULNERABILITY' | 'QUALITY_GATE_VIOLATION' | 'COMMENT';
export type IssueSeverity = 'BLOCKER' | 'CRITICAL' | 'MAJOR' | 'MINOR' | 'INFO';
export type IssueStatus = 'OPEN' | 'CONFIRMED' | 'RESOLVED' | 'FALSE_POSITIVE';

export interface Issue {
  id: string;                      // opaque, server-assigned, e.g. "iss-001"
  projectId: string;               // e.g. "acme-payments"
  filePath: string;                // repo-relative POSIX path, no leading slash
  line: number;                    // 1-indexed
  type: IssueType;
  severity: IssueSeverity | null;  // null iff type === 'COMMENT'
  status: IssueStatus;
  rule: string | null;             // opaque fixture key, /^S\d+$/; null iff type === 'COMMENT'
  message: string;
  author: string | null;           // non-null iff type === 'COMMENT'
  createdAt: string;               // ISO-8601 UTC, e.g. "2026-08-14T09:12:00.000Z"
  updatedAt: string;               // ISO-8601 UTC
}
