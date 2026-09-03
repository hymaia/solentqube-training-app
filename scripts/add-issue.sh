#!/usr/bin/env bash
set -euo pipefail

API_URL="${SOLENTQUBE_API_URL:-http://localhost:3001}"
PROJECT_ID="${1:-}"
JSON_FILE="${2:-}"

if [ -z "$PROJECT_ID" ] || [ -z "$JSON_FILE" ]; then
  cat <<EOF
Usage: scripts/add-issue.sh <projectId> <path/to/issue.json>

Creates an issue via POST \$API_URL/issues/:projectId, sending the
given JSON file as the request body. Copy one of scripts/examples/*.json
as a starting point (one template per issue type) and edit it.

Env: SOLENTQUBE_API_URL (default http://localhost:3001)
EOF
  exit 1
fi

if [ ! -f "$JSON_FILE" ]; then
  echo "Error: no such file '$JSON_FILE'" >&2
  exit 1
fi

RESPONSE_FILE=$(mktemp)
trap 'rm -f "$RESPONSE_FILE"' EXIT

HTTP_STATUS=$(curl -sS -o "$RESPONSE_FILE" -w '%{http_code}' \
  -X POST "$API_URL/issues/$PROJECT_ID" \
  -H 'Content-Type: application/json' \
  --data-binary @"$JSON_FILE")

if command -v jq >/dev/null 2>&1; then
  jq . "$RESPONSE_FILE"
else
  cat "$RESPONSE_FILE"
fi

if [ "$HTTP_STATUS" != "201" ]; then
  echo "Error: request failed with HTTP $HTTP_STATUS" >&2
  exit 1
fi
