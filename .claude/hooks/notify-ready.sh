#!/bin/bash
# ABOUTME: Desktop notification hook for when Claude finishes responding.
# ABOUTME: Uses native macOS notifications, Linux notify-send, or terminal bell.

notify_user() {
    local title="$1"
    local message="$2"

    # macOS native notification (AppleScript)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        osascript -e "display notification \"$message\" with title \"$title\" sound name \"Glass\"" 2>/dev/null || true
    # Linux with notify-send
    elif command -v notify-send &> /dev/null; then
        notify-send "$title" "$message" 2>/dev/null || true
    # Fallback: terminal bell
    else
        echo -e "\a"
    fi
}

# Send notification
notify_user "Claude Code" "Ready for your input"

exit 0
