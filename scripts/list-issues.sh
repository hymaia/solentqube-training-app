#!/usr/bin/env bash
set -euo pipefail

API_URL="${SOLENTQUBE_API_URL:-http://localhost:3001}"
PROJECT_ID="${1:-}"
QUERY="${2:-}"

if [ -z "$PROJECT_ID" ]; then
  cat <<EOF
Usage: scripts/list-issues.sh <projectId> [query-string]

Lists issues for a project via GET \$API_URL/issues/:projectId.

Examples:
  scripts/list-issues.sh acme-payments
  scripts/list-issues.sh acme-payments "file=src/auth/login.ts"
  scripts/list-issues.sh acme-payments "type=COMMENT"
  scripts/list-issues.sh acme-payments "severity=BLOCKER&severity=CRITICAL"

Env: SOLENTQUBE_API_URL (default http://localhost:3001)
EOF
  exit 1
fi

URL="$API_URL/issues/$PROJECT_ID"
if [ -n "$QUERY" ]; then
  URL="$URL?$QUERY"
fi

RESPONSE_FILE=$(mktemp)
trap 'rm -f "$RESPONSE_FILE"' EXIT

HTTP_STATUS=$(curl -sS -o "$RESPONSE_FILE" -w '%{http_code}' "$URL")

if command -v jq >/dev/null 2>&1; then
  jq . "$RESPONSE_FILE"
else
  cat "$RESPONSE_FILE"
fi

if [ "$HTTP_STATUS" != "200" ]; then
  echo "Error: request failed with HTTP $HTTP_STATUS" >&2
  exit 1
fi
