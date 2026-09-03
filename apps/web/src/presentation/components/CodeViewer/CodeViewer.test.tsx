import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CodeViewer } from './CodeViewer';
import type { Issue } from '../../../domain/entities/Issue';
import type { ProjectFile } from '../../../domain/entities/Project';

const LOGIN_TS_CONTENT = `import { db } from "../db";

const ADMIN_TOKEN = "sk_live_9f2b8c1d4e7a";

export async function login(username: string, password: string) {
  const rows = await db.query(
    "SELECT id, role FROM users WHERE name = '" + username + "'"
  );
  if (rows.length === 0) {
    return null;
  }
  if (password == rows[0].password) {
    return { id: rows[0].id, role: rows[0].role };
  }
  return null;
}

export const bypass = (t: string) => t === ADMIN_TOKEN;
`;

const FILE: ProjectFile = { path: 'src/auth/login.ts', content: LOGIN_TS_CONTENT };

const T = '2026-08-14T09:12:00.000Z';

const LOGIN_ISSUES: Issue[] = [
  {
    id: 'iss-001',
    projectId: 'acme-payments',
    filePath: 'src/auth/login.ts',
    line: 3,
    type: 'VULNERABILITY',
    severity: 'BLOCKER',
    status: 'OPEN',
    rule: 'S6418',
    message: 'Hard-coded credential: a live API token is committed to source.',
    author: null,
    createdAt: T,
    updatedAt: T,
  },
  {
    id: 'iss-002',
    projectId: 'acme-payments',
    filePath: 'src/auth/login.ts',
    line: 7,
    type: 'VULNERABILITY',
    severity: 'CRITICAL',
    status: 'CONFIRMED',
    rule: 'S3649',
    message: 'SQL query is built from user-controlled input; use a parameterized query.',
    author: null,
    createdAt: T,
    updatedAt: T,
  },
  {
    id: 'iss-003',
    projectId: 'acme-payments',
    filePath: 'src/auth/login.ts',
    line: 12,
    type: 'QUALITY_GATE_VIOLATION',
    severity: 'MAJOR',
    status: 'OPEN',
    rule: 'S1440',
    message: 'Use the strict equality operator === instead of ==.',
    author: null,
    createdAt: T,
    updatedAt: T,
  },
  {
    id: 'iss-004',
    projectId: 'acme-payments',
    filePath: 'src/auth/login.ts',
    line: 12,
    type: 'COMMENT',
    severity: null,
    status: 'OPEN',
    rule: null,
    message: 'Comparing against a plaintext password column. Is this hashed anywhere?',
    author: 'marie',
    createdAt: T,
    updatedAt: T,
  },
  {
    id: 'iss-005',
    projectId: 'acme-payments',
    filePath: 'src/auth/login.ts',
    line: 18,
    type: 'VULNERABILITY',
    severity: 'MAJOR',
    status: 'FALSE_POSITIVE',
    rule: 'S2076',
    message: 'Authentication bypass helper is exported as part of the public API.',
    author: null,
    createdAt: T,
    updatedAt: T,
  },
];

describe('CodeViewer', () => {
  it('renders 18 line rows for the login.ts fixture', () => {
    render(
      <MemoryRouter>
        <CodeViewer file={FILE} issues={LOGIN_ISSUES} />
      </MemoryRouter>,
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(18);
  });

  it('line 12 has an accessible name reporting 2 issues', () => {
    render(
      <MemoryRouter>
        <CodeViewer file={FILE} issues={LOGIN_ISSUES} />
      </MemoryRouter>,
    );
    expect(screen.getByRole('button', { name: /Line 12, 2 issue/ })).toBeInTheDocument();
  });

  it('clicking line 12 reveals both the S1440 message and the comment text', () => {
    render(
      <MemoryRouter>
        <CodeViewer file={FILE} issues={LOGIN_ISSUES} />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole('button', { name: /Line 12, 2 issue/ }));
    expect(screen.getByText('Use the strict equality operator === instead of ==.')).toBeInTheDocument();
    expect(screen.getByText('Comparing against a plaintext password column. Is this hashed anywhere?')).toBeInTheDocument();
  });

  it('line 5 renders no issue-toggle button', () => {
    render(
      <MemoryRouter>
        <CodeViewer file={FILE} issues={LOGIN_ISSUES} />
      </MemoryRouter>,
    );
    expect(screen.queryByRole('button', { name: /Line 5,/ })).not.toBeInTheDocument();
  });
});
