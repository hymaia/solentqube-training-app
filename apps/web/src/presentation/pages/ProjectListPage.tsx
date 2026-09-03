import { Link } from 'react-router-dom';
import { PROJECTS } from '../../infrastructure/fixtures/projects';
import { useIssues } from '../hooks/useIssues';
import { summarize } from '../../application/use-cases/issueQueries';
import { SeverityBadge } from '../components/badges/SeverityBadge';
import type { Project } from '../../domain/entities/Project';
import type { IssueSeverity } from '../../domain/entities/Issue';

const SEVERITIES: IssueSeverity[] = ['BLOCKER', 'CRITICAL', 'MAJOR', 'MINOR', 'INFO'];

function ProjectCard({ project }: { project: Project }) {
  const { issues, isLoading, error } = useIssues(project.id);
  const summary = summarize(issues);

  return (
    <Link to={`/projects/${project.id}`} className="project-card">
      <p className="project-card-name">{project.name}</p>
      <p className="project-card-id">{project.id}</p>
      <p className="count-row">
        <span>{project.files.length} files</span>
      </p>
      {isLoading && <p className="count-row">Loading…</p>}
      {error && <p className="project-card-error">{error.message}</p>}
      {!isLoading && !error && (
        <>
          <p className="count-row">
            <span>{summary.byType.VULNERABILITY} vulnerabilities</span>
            <span>{summary.byType.QUALITY_GATE_VIOLATION} quality gate</span>
            <span>{summary.byType.COMMENT} comments</span>
          </p>
          <p className="chip-row">
            {SEVERITIES.filter((severity) => summary.bySeverity[severity] > 0).map((severity) => (
              <SeverityBadge key={severity} severity={severity} />
            ))}
          </p>
        </>
      )}
    </Link>
  );
}

export function ProjectListPage() {
  return (
    <div className="project-list">
      {PROJECTS.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
