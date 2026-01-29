#!/bin/bash
# Restart API and run tests

echo "================================"
echo "🔄 Restarting API Server"
echo "================================"

# Kill any existing node processes on port 3000
echo "Stopping API server..."
taskkill /F /IM node.exe /T 2>/dev/null || true

# Wait a moment
sleep 2

# Start API server in background
echo "Starting API server..."
cd ../api-db-app
node server.js &
API_PID=$!

# Wait for API to start
echo "Waiting for API to be ready..."
sleep 5

# Check if API is ready
echo "Testing API health..."
for i in {1..10}; do
  if curl -s http://localhost:3000/scheduling-groups > /dev/null 2>&1; then
    echo "✅ API is ready"
    break
  fi
  echo "⏳ Waiting... attempt $i/10"
  sleep 1
done

# Return to test directory
cd ../playwright-api-tests

echo ""
echo "================================"
echo "🧪 Running Tests"
echo "================================"
echo ""

# Run tests
npm test

echo ""
echo "================================"
echo "Cleaning up..."
echo "================================"
# Kill the API server
kill $API_PID 2>/dev/null || true

echo "✅ Complete"
