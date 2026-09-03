import { describe, it, expect } from 'vitest';
import supertest from 'supertest';
import { createApp } from './app.js';

const app = createApp();
const request = supertest(app);

describe('GET /issues/:projectId', () => {
  it('returns every seeded issue for acme-payments', async () => {
    const res = await request.get('/issues/acme-payments');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(9);
    expect(res.body[0]).toEqual({
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
      createdAt: '2026-08-14T09:12:00.000Z',
      updatedAt: '2026-08-14T09:12:00.000Z',
    });
  });

  it('filters by file', async () => {
    const res = await request.get('/issues/legacy-billing?file=billing/db.py');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);
    expect(res.body.map((i: { id: string }) => i.id)).toEqual(['iss-015', 'iss-016', 'iss-017']);
  });

  it('filters by type=COMMENT', async () => {
    const res = await request.get('/issues/acme-payments?type=COMMENT');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);
    for (const issue of res.body) {
      expect(issue.severity).toBeNull();
      expect(issue.rule).toBeNull();
      expect(issue.author).not.toBeNull();
    }
  });

  it('filters by repeated severity parameter with OR semantics', async () => {
    const res = await request.get('/issues/acme-payments?severity=BLOCKER&severity=CRITICAL');
    expect(res.status).toBe(200);
    expect(res.body.map((i: { id: string }) => i.id)).toEqual(['iss-001', 'iss-002', 'iss-006']);
  });

  it('rejects an invalid enum value with 400 INVALID_QUERY', async () => {
    const res = await request.get('/issues/acme-payments?type=NOPE');
    expect(res.status).toBe(400);
    expect(res.body.code).toBe('INVALID_QUERY');
  });

  it('returns 404 PROJECT_NOT_FOUND for an unknown project', async () => {
    const res = await request.get('/issues/unknown-project');
    expect(res.status).toBe(404);
    expect(res.body.code).toBe('PROJECT_NOT_FOUND');
  });
});

describe('GET /issues/:projectId/:issueId', () => {
  it('returns a single issue by id', async () => {
    const res = await request.get('/issues/acme-payments/iss-003');
    expect(res.status).toBe(200);
    expect(res.body.type).toBe('QUALITY_GATE_VIOLATION');
  });

  it('returns 404 ISSUE_NOT_FOUND when the id belongs to a different project', async () => {
    const res = await request.get('/issues/acme-payments/iss-015');
    expect(res.status).toBe(404);
    expect(res.body.code).toBe('ISSUE_NOT_FOUND');
  });
});

describe('write operations', () => {
  it('POST /issues/:projectId returns 501 NOT_IMPLEMENTED', async () => {
    const res = await request.post('/issues/acme-payments').send({});
    expect(res.status).toBe(501);
    expect(res.body.code).toBe('NOT_IMPLEMENTED');
  });

  it('PUT /issues/:projectId/:issueId returns 501 NOT_IMPLEMENTED', async () => {
    const res = await request.put('/issues/acme-payments/iss-001').send({});
    expect(res.status).toBe(501);
    expect(res.body.code).toBe('NOT_IMPLEMENTED');
  });

  it('DELETE /issues/:projectId/:issueId returns 501 NOT_IMPLEMENTED', async () => {
    const res = await request.delete('/issues/acme-payments/iss-001');
    expect(res.status).toBe(501);
    expect(res.body.code).toBe('NOT_IMPLEMENTED');
  });
});
