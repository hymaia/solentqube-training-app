import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { ProjectFile } from '../../../domain/entities/Project';
import type { Issue } from '../../../domain/entities/Issue';
import { groupIssuesByLine } from '../../../application/use-cases/issueQueries';
import { TypeBadge } from '../badges/TypeBadge';
import { SeverityBadge } from '../badges/SeverityBadge';
import { StatusBadge } from '../badges/StatusBadge';

export function CodeViewer({ file, issues }: { file: ProjectFile; issues: Issue[] }) {
  const lines = (file.content.endsWith('\n') ? file.content.slice(0, -1) : file.content).split('\n');
  const grouped = groupIssuesByLine(issues);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [searchParams] = useSearchParams();
  const rowRefs = useRef<Map<number, HTMLLIElement>>(new Map());

  const targetLineParam = searchParams.get('line');
  const targetLine = targetLineParam ? Number(targetLineParam) : null;

  useEffect(() => {
    if (targetLine === null || !Number.isInteger(targetLine)) return;
    if (!grouped.has(targetLine)) return;
    setExpanded((prev) => {
      if (prev.has(targetLine)) return prev;
      const next = new Set(prev);
      next.add(targetLine);
      return next;
    });
    const row = rowRefs.current.get(targetLine);
    row?.scrollIntoView({ block: 'center' });
  }, [targetLine, file.path, issues]);

  function toggleLine(line: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(line)) next.delete(line);
      else next.add(line);
      return next;
    });
  }

  return (
    <div className="code-viewer">
      {issues.length === 0 && lines.length > 0 && (
        <p className="code-viewer-note">No issues match the current filters in this file.</p>
      )}
      <ol className="code-list">
        {lines.map((text, index) => {
          const lineNumber = index + 1;
          const bucket = grouped.get(lineNumber) ?? [];
          const hasIssues = bucket.length > 0;
          const isExpanded = expanded.has(lineNumber);
          const isTargeted = targetLine === lineNumber;

          return (
            <li
              key={lineNumber}
              ref={(el) => {
                if (el) rowRefs.current.set(lineNumber, el);
                else rowRefs.current.delete(lineNumber);
              }}
              className={`code-row-container${isTargeted ? ' targeted' : ''}`}
            >
              <div className={`code-row${hasIssues ? ' has-issues' : ''}`}>
                <span className="code-gutter">{lineNumber}</span>
                {hasIssues ? (
                  <button
                    type="button"
                    className="code-line-button"
                    aria-expanded={isExpanded}
                    aria-label={`Line ${lineNumber}, ${bucket.length} issue(s)`}
                    onClick={() => toggleLine(lineNumber)}
                  >
                    <span className="code-marker">{bucket.length}</span>
                    <pre className="code-line-text">{text}</pre>
                  </button>
                ) : (
                  <>
                    <span className="code-marker" />
                    <pre className="code-line-text">{text}</pre>
                  </>
                )}
              </div>
              {isExpanded && (
                <div className="issue-panel">
                  {bucket.map((issue) => (
                    <div key={issue.id} className="issue-panel-item">
                      <div className="issue-panel-badges">
                        <TypeBadge type={issue.type} />
                        {issue.severity !== null && <SeverityBadge severity={issue.severity} />}
                        <StatusBadge status={issue.status} />
                        {issue.rule !== null && <span className="code-viewer-rule">{issue.rule}</span>}
                      </div>
                      <p className="issue-panel-message">{issue.message}</p>
                      {issue.author !== null && (
                        <p className="issue-panel-meta">
                          {issue.author} · {new Date(issue.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
