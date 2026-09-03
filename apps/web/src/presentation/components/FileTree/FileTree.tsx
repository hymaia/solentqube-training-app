import { NavLink } from 'react-router-dom';
import type { Project } from '../../../domain/entities/Project';
import type { Issue } from '../../../domain/entities/Issue';
import { countIssuesByFile, highestSeverity } from '../../../application/use-cases/issueQueries';
import { severityClass } from '../badges/SeverityBadge';

export function FileTree({ project, filteredIssues }: { project: Project; filteredIssues: Issue[] }) {
  const countByFile = countIssuesByFile(filteredIssues);
  const issuesByFile = new Map<string, Issue[]>();
  for (const issue of filteredIssues) {
    const bucket = issuesByFile.get(issue.filePath) ?? [];
    bucket.push(issue);
    issuesByFile.set(issue.filePath, bucket);
  }

  return (
    <nav className="file-tree">
      {project.files.map((file) => {
        const count = countByFile.get(file.path) ?? 0;
        const best = highestSeverity(issuesByFile.get(file.path) ?? []);
        const badgeClass = count === 0 ? 'badge badge-zero' : `badge ${severityClass(best)}`;
        return (
          <NavLink
            key={file.path}
            to={`/projects/${project.id}/${file.path}`}
            className={({ isActive }) => `file-tree-link${isActive ? ' active' : ''}`}
          >
            <span className="file-tree-path">{file.path}</span>
            <span className={badgeClass}>{count}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
