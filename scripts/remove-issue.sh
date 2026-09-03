#!/usr/bin/env bash
set -euo pipefail

API_URL="${SOLENTQUBE_API_URL:-http://localhost:3001}"
PROJECT_ID="${1:-}"
ISSUE_ID="${2:-}"

if [ -z "$PROJECT_ID" ] || [ -z "$ISSUE_ID" ]; then
  cat <<EOF
Usage: scripts/remove-issue.sh <projectId> <issueId>

Deletes an issue via DELETE \$API_URL/issues/:projectId/:issueId.
Run scripts/list-issues.sh <projectId> first to find an issueId.

Env: SOLENTQUBE_API_URL (default http://localhost:3001)
EOF
  exit 1
fi

RESPONSE_FILE=$(mktemp)
trap 'rm -f "$RESPONSE_FILE"' EXIT

HTTP_STATUS=$(curl -sS -o "$RESPONSE_FILE" -w '%{http_code}' \
  -X DELETE "$API_URL/issues/$PROJECT_ID/$ISSUE_ID")

if [ "$HTTP_STATUS" = "204" ]; then
  echo "Deleted $ISSUE_ID from $PROJECT_ID."
  exit 0
fi

if command -v jq >/dev/null 2>&1; then
  jq . "$RESPONSE_FILE"
else
  cat "$RESPONSE_FILE"
fi
echo "Error: request failed with HTTP $HTTP_STATUS" >&2
exit 1
