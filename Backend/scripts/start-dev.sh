#!/bin/bash
# Script to start the backend with proper signal handling
# This ensures the process terminates when the terminal closes

PORT=4253
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Kill any existing processes on port 5060
echo "🧹 Cleaning up port $PORT..."
bash "$SCRIPT_DIR/kill-port.sh" $PORT

# Trap signals to ensure cleanup on exit
cleanup() {
  echo ""
  echo "🛑 Shutting down backend server on port $PORT..."
  PID=$(lsof -ti:$PORT 2>/dev/null)
  if [ ! -z "$PID" ]; then
    kill -TERM $PID 2>/dev/null
    sleep 2
    # Force kill if still running
    if lsof -ti:$PORT >/dev/null 2>&1; then
      kill -9 $PID 2>/dev/null
    fi
  fi
  echo "✅ Port $PORT is now free"
  exit 0
}

trap cleanup SIGTERM SIGINT EXIT

# Change to project directory
cd "$PROJECT_DIR"

# Start the server
echo "🚀 Starting backend server on port $PORT..."
npm run start:dev

# Keep script running until interrupted
wait

