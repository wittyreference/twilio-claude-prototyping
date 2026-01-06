#!/bin/bash
# ABOUTME: Post-bash hook for tracking command completions.
# ABOUTME: Logs deployment completions and sends notifications for key operations.

COMMAND="${CLAUDE_TOOL_INPUT_COMMAND:-}"

# Exit if no command
if [ -z "$COMMAND" ]; then
    exit 0
fi

# ============================================
# DEPLOYMENT COMPLETION
# ============================================

if echo "$COMMAND" | grep -qE "(twilio\s+serverless:deploy|npm\s+run\s+deploy)"; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Deployment command completed."
    echo "Check the output above for deployed URLs."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""

    # Send desktop notification on macOS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        osascript -e 'display notification "Deployment complete - check terminal for URLs" with title "Claude Code" sound name "Hero"' 2>/dev/null || true
    elif command -v notify-send &> /dev/null; then
        notify-send "Claude Code" "Deployment complete" 2>/dev/null || true
    fi
fi

# ============================================
# TEST COMPLETION
# ============================================

if echo "$COMMAND" | grep -qE "(npm\s+test|npm\s+run\s+test)"; then
    echo ""
    echo "Test execution completed."
fi

exit 0
