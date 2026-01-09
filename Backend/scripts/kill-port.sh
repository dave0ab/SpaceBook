#!/bin/bash
# Script to kill all processes running on port 5060

PORT=${1:-4253}
PID=$(lsof -ti:$PORT 2>/dev/null)

if [ -z "$PID" ]; then
  echo "✅ No processes found on port $PORT"
  exit 0
fi

echo "🔍 Found processes on port $PORT:"
lsof -i:$PORT | grep LISTEN

echo "🛑 Killing processes..."
kill -9 $PID 2>/dev/null

sleep 1

# Verify port is free
if lsof -ti:$PORT >/dev/null 2>&1; then
  echo "⚠️  Some processes are still running. Force killing..."
  killall -9 node 2>/dev/null
  sleep 1
fi

if lsof -ti:$PORT >/dev/null 2>&1; then
  echo "❌ Failed to free port $PORT"
  exit 1
else
  echo "✅ Port $PORT is now free"
  exit 0
fi

