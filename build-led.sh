#!/bin/bash

# LED Display Build Script for Soccer Scoreboard
# Optimized for Viplex Software Large LED Screens

echo "🔥 Building Soccer Scoreboard for LED Display..."
echo "========================================"

# Check if we're in the right directory
if [ ! -f "vercel.json" ]; then
    echo "❌ Error: vercel.json not found. Please run this script from the project root."
    exit 1
fi

# Create build directory
echo "📁 Creating build directory..."
rm -rf build-led
mkdir -p build-led
mkdir -p build-led/api
mkdir -p build-led/public

# Copy and optimize files for LED display
echo "📋 Copying optimized files..."

# Copy API files
cp api/*.js build-led/api/
echo "✅ API files copied"

# Copy optimized public files
cp public/index.html build-led/public/
cp public/admin.html build-led/public/
echo "✅ HTML files copied"

# Copy configuration files
cp vercel.json build-led/
cp viplex-config.json build-led/
cp VIPLEX_INSTALLATION_GUIDE.md build-led/
echo "✅ Configuration files copied"

# Create optimized package.json for deployment
cat > build-led/package.json << 'EOF'
{
  "name": "soccer-scoreboard-led",
  "version": "1.0.0",
  "description": "High-performance soccer scoreboard optimized for Viplex Software Large LED Screens",
  "main": "api/scores.js",
  "scripts": {
    "start": "node api/scores.js",
    "dev": "vercel dev",
    "build": "echo 'Build completed'",
    "deploy": "vercel --prod"
  },
  "keywords": ["led", "display", "scoreboard", "viplex", "soccer"],
  "author": "LED Display Solutions",
  "license": "MIT",
  "engines": {
    "node": ">=14.0.0"
  },
  "dependencies": {},
  "devDependencies": {},
  "repository": {
    "type": "git",
    "url": "."
  }
}
EOF

# Create LED-specific README
cat > build-led/README.md << 'EOF'
# Soccer Scoreboard for LED Displays

## 🎯 Quick Start

This is a production-ready build optimized for Viplex Software Large LED Screens.

### Deployment Options

1. **Vercel (Recommended)**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

2. **Local Server**
   ```bash
   npx http-server . -p 8080 -c-1
   ```

### URLs
- **Main Display**: `/` (for LED screen)
- **Admin Panel**: `/admin.html` (for control)

### LED Display Configuration
See `VIPLEX_INSTALLATION_GUIDE.md` for detailed setup instructions.

### Features
- ✅ Optimized for LED display scaling
- ✅ High contrast colors and large fonts
- ✅ Media trigger support (keys 1-0)
- ✅ Real-time updates every 2 seconds
- ✅ Mobile-responsive admin interface
- ✅ Viplex Express compatibility

### Support
For technical support, refer to the installation guide or contact your LED display provider.
EOF

# Create deployment verification script
cat > build-led/verify-deployment.sh << 'EOF'
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
EOF

chmod +x build-led/verify-deployment.sh

# Create LED display test page
cat > build-led/public/test-pattern.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
  <title>LED Display Test Pattern</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <style>
    body {
      margin: 0;
      padding: 0;
      background: black;
      color: white;
      font-family: Arial Black, Arial, sans-serif;
      overflow: hidden;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .pattern {
      font-size: 10vw;
      text-align: center;
      animation: colorCycle 3s infinite;
    }
    @keyframes colorCycle {
      0% { color: #ff0000; }
      25% { color: #00ff00; }
      50% { color: #0000ff; }
      75% { color: #ffff00; }
      100% { color: #ff0000; }
    }
    .info {
      position: absolute;
      bottom: 50px;
      font-size: 3vw;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="pattern">LED TEST</div>
  <div class="info">
    Resolution: <span id="resolution"></span><br>
    Press ESC to return to scoreboard
  </div>
  <script>
    document.getElementById('resolution').textContent = 
      screen.width + 'x' + screen.height;
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        window.location.href = '/';
      }
    });
  </script>
</body>
</html>
EOF

# Optimize HTML files for LED display
echo "⚡ Applying LED display optimizations..."

# Add LED-specific meta tags and optimizations to index.html
sed -i.bak 's/<title>Live Soccer Scoreboard - LED Display<\/title>/<title>Live Soccer Scoreboard - LED Display<\/title>\n  <meta name="robots" content="noindex">\n  <meta name="led-optimized" content="true">\n  <meta name="viplex-compatible" content="true">/' build-led/public/index.html

# Create deployment status file
echo "📊 Creating deployment status..."
cat > build-led/deployment-status.json << EOF
{
  "buildTime": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "version": "1.0.0",
  "target": "led-display",
  "optimized": true,
  "viplexCompatible": true,
  "features": {
    "fullScreen": true,
    "highContrast": true,
    "scalableFonts": true,
    "mediaTriggers": true,
    "realTimeUpdates": true,
    "mobileAdmin": true
  },
  "requirements": {
    "minResolution": "1920x1080",
    "software": "Viplex Express 2.0+",
    "browser": "Chrome 90+, Firefox 88+, Edge 90+"
  }
}
EOF

echo ""
echo "🎉 LED Display Build Completed Successfully!"
echo "========================================"
echo "📁 Build location: ./build-led/"
echo "📋 Files optimized for Viplex Software LED Screens"
echo "🚀 Ready for deployment!"
echo ""
echo "Next steps:"
echo "1. cd build-led"
echo "2. Deploy using 'vercel --prod' or start local server"
echo "3. Configure Viplex Express with your deployment URL"
echo "4. See VIPLEX_INSTALLATION_GUIDE.md for detailed setup"
echo ""