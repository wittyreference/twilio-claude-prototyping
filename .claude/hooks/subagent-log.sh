#!/bin/bash
# ABOUTME: Logs subagent activity for workflow tracking and debugging.
# ABOUTME: Creates timestamped logs of subagent completions with git context.

# Determine the project root (where .claude directory is)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
LOG_DIR="$PROJECT_ROOT/.claude/logs"
LOG_FILE="$LOG_DIR/subagent-activity.log"

# Create log directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Get timestamp
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Get git context if available
GIT_BRANCH="N/A"
if [ -d "$PROJECT_ROOT/.git" ]; then
    GIT_BRANCH=$(cd "$PROJECT_ROOT" && git branch --show-current 2>/dev/null || echo "N/A")
fi

# Log the subagent completion
{
    echo "[$TIMESTAMP] Subagent completed"
    echo "  Branch: $GIT_BRANCH"
    echo "  Directory: $(pwd)"
    echo "---"
} >> "$LOG_FILE"

# Keep log file from growing too large (keep last 500 lines)
if [ -f "$LOG_FILE" ]; then
    LINES=$(wc -l < "$LOG_FILE" | tr -d ' ')
    if [ "$LINES" -gt 500 ]; then
        tail -500 "$LOG_FILE" > "$LOG_FILE.tmp" && mv "$LOG_FILE.tmp" "$LOG_FILE"
    fi
fi

exit 0
