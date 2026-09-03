import express from 'express';
import type { Request } from 'express';
import { ISSUE_TYPES, ISSUE_SEVERITIES, ISSUE_STATUSES } from './types.js';
import type { Issue, IssueType, IssueSeverity, IssueStatus } from './types.js';
import { SEED_ISSUES, KNOWN_PROJECT_IDS } from './seed.js';

interface ErrorBody {
  code: string;
  message: string;
  details?: string[];
}

function toArray(value: unknown): string[] {
  if (value === undefined) return [];
  if (Array.isArray(value)) return value.map(String);
  return [String(value)];
}

function notImplemented(_req: Request, res: express.Response) {
  const body: ErrorBody = {
    code: 'NOT_IMPLEMENTED',
    message: 'Write operations are specified in contracts/openapi.yaml but not implemented by the stub server.',
  };
  res.status(501).json(body);
}

export function createApp(): express.Express {
  const app = express();
  app.use(express.json());

  app.get('/issues/:projectId', (req, res) => {
    const { projectId } = req.params;
    if (!KNOWN_PROJECT_IDS.includes(projectId as (typeof KNOWN_PROJECT_IDS)[number])) {
      const body: ErrorBody = { code: 'PROJECT_NOT_FOUND', message: `Unknown project '${projectId}'.` };
      res.status(404).json(body);
      return;
    }

    const typeValues = toArray(req.query.type);
    const severityValues = toArray(req.query.severity);
    const statusValues = toArray(req.query.status);
    const fileValue = typeof req.query.file === 'string' ? req.query.file : undefined;

    const details: string[] = [];
    for (const v of typeValues) {
      if (!ISSUE_TYPES.includes(v as IssueType)) details.push(`type: '${v}' is not a valid IssueType`);
    }
    for (const v of severityValues) {
      if (!ISSUE_SEVERITIES.includes(v as IssueSeverity)) details.push(`severity: '${v}' is not a valid IssueSeverity`);
    }
    for (const v of statusValues) {
      if (!ISSUE_STATUSES.includes(v as IssueStatus)) details.push(`status: '${v}' is not a valid IssueStatus`);
    }
    if (details.length > 0) {
      const body: ErrorBody = { code: 'INVALID_QUERY', message: 'Invalid query parameter value.', details };
      res.status(400).json(body);
      return;
    }

    let results: Issue[] = SEED_ISSUES.filter((issue) => issue.projectId === projectId);
    if (fileValue !== undefined) {
      results = results.filter((issue) => issue.filePath === fileValue);
    }
    if (typeValues.length > 0) {
      results = results.filter((issue) => typeValues.includes(issue.type));
    }
    if (severityValues.length > 0) {
      results = results.filter((issue) => issue.severity !== null && severityValues.includes(issue.severity));
    }
    if (statusValues.length > 0) {
      results = results.filter((issue) => statusValues.includes(issue.status));
    }

    res.status(200).json(results);
  });

  app.get('/issues/:projectId/:issueId', (req, res) => {
    const { projectId, issueId } = req.params;
    if (!KNOWN_PROJECT_IDS.includes(projectId as (typeof KNOWN_PROJECT_IDS)[number])) {
      const body: ErrorBody = { code: 'PROJECT_NOT_FOUND', message: `Unknown project '${projectId}'.` };
      res.status(404).json(body);
      return;
    }
    const issue = SEED_ISSUES.find((i) => i.projectId === projectId && i.id === issueId);
    if (!issue) {
      const body: ErrorBody = {
        code: 'ISSUE_NOT_FOUND',
        message: `Unknown issue '${issueId}' in project '${projectId}'.`,
      };
      res.status(404).json(body);
      return;
    }
    res.status(200).json(issue);
  });

  app.post('/issues/:projectId', notImplemented);
  app.put('/issues/:projectId/:issueId', notImplemented);
  app.delete('/issues/:projectId/:issueId', notImplemented);

  app.use((_req, res) => {
    const body: ErrorBody = { code: 'ISSUE_NOT_FOUND', message: 'No such route.' };
    res.status(404).json(body);
  });

  return app;
}
