#!/bin/bash

echo "🌐 Starting Frontend Development Server"
echo "======================================"

# Check if Python is available
if command -v python3 &> /dev/null; then
    echo "Starting server with Python 3..."
    python3 -m http.server 3000
elif command -v python &> /dev/null; then
    echo "Starting server with Python..."
    python -m http.server 3000
elif command -v node &> /dev/null; then
    # Use Node.js http-server if available
    if npm list -g http-server &> /dev/null; then
        echo "Starting server with http-server..."
        npx http-server -p 3000 -c-1
    else
        echo "Installing http-server..."
        npm install -g http-server
        npx http-server -p 3000 -c-1
    fi
else
    echo "❌ No suitable server found. Please install Python or Node.js"
    echo "Or open index.html directly in your browser"
    exit 1
fi