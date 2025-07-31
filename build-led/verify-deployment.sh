#!/bin/bash

echo "🔍 Verifying LED Display Deployment..."

# Check if server is responding
if command -v curl &> /dev/null; then
    if curl -f -s http://localhost:8080 > /dev/null; then
        echo "✅ Server is responding"
    else
        echo "❌ Server is not responding on port 8080"
        exit 1
    fi
else
    echo "⚠️ curl not available, skipping server check"
fi

# Check required files
required_files=("index.html" "admin.html" "api/scores.js" "api/update.js" "vercel.json")
for file in "${required_files[@]}"; do
    if [ -f "public/$file" ] || [ -f "$file" ]; then
        echo "✅ $file found"
    else
        echo "❌ $file missing"
        exit 1
    fi
done

echo "✅ Deployment verification completed successfully!"
