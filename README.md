# Smart4Qube

A SonarQube-like code review viewer: browse sample repositories, and read
line-anchored vulnerabilities, quality gate violations, and comments.

## Quickstart

Run the API and web app in separate terminals:

```
npm install
npm run dev:api    # http://localhost:3001
npm run dev:web    # http://localhost:5173
```

Then open http://localhost:5173.

## Stub coverage

`apps/api` is a stub implementation of `contracts/openapi.yaml`. Only the two
read operations are implemented; every write operation returns `501` with
`NOT_IMPLEMENTED`.

| Operation | Path | Stub behavior |
|---|---|---|
| `listIssues` | `GET /issues/{projectId}` | Implemented |
| `getIssue` | `GET /issues/{projectId}/{issueId}` | Implemented |
| `createIssue` | `POST /issues/{projectId}` | `501 NOT_IMPLEMENTED` |
| `updateIssue` | `PUT /issues/{projectId}/{issueId}` | `501 NOT_IMPLEMENTED` |
| `deleteIssue` | `DELETE /issues/{projectId}/{issueId}` | `501 NOT_IMPLEMENTED` |
