import http from 'http';
import { URL } from 'url';
import fs from 'fs';
import path from 'path';
import { initWebSocketServer } from './api/websocket.js';

const PORT = process.env.PORT || 3000;
const WS_PORT = process.env.WS_PORT || 8080;

// MIME types for static file serving
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav'
};

function serveStaticFile(res, filePath) {
  const extName = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[extName] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`, 'utf-8');
      }
    } else {
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Cache-Control': extName === '.html' ? 'no-cache' : 'public, max-age=3600'
      });
      res.end(content, 'utf-8');
    }
  });
}

async function handleApiRequest(req, res, pathname) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  let body = '';
  if (req.method === 'POST') {
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        req.body = JSON.parse(body);
      } catch (e) {
        req.body = {};
      }
      await routeApiRequest(req, res, pathname);
    });
  } else {
    await routeApiRequest(req, res, pathname);
  }
}

async function routeApiRequest(req, res, pathname) {
  try {
    let handler;
    
    switch (pathname) {
      case '/api/scores':
        handler = (await import('./api/scores.js')).default;
        break;
      case '/api/update':
        handler = (await import('./api/update.js')).default;
        break;
      case '/api/websocket':
        handler = (await import('./api/websocket.js')).default;
        break;
      case '/api/rss':
        handler = (await import('./api/rss.js')).default;
        break;
      default:
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'API endpoint not found' }));
        return;
    }
    
    if (handler) {
      await handler(req, res);
    }
  } catch (error) {
    console.error('API Error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }));
  }
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = parsedUrl.pathname;

  console.log(`${req.method} ${pathname}`);

  // Handle API routes
  if (pathname.startsWith('/api/')) {
    await handleApiRequest(req, res, pathname);
    return;
  }

  // Handle static files
  let filePath = '';
  
  if (pathname === '/' || pathname === '/index.html') {
    filePath = path.join(process.cwd(), 'public', 'index.html');
  } else if (pathname === '/admin' || pathname === '/admin.html') {
    filePath = path.join(process.cwd(), 'public', 'admin.html');
  } else {
    filePath = path.join(process.cwd(), 'public', pathname);
  }

  // Security check - prevent directory traversal
  const normalizedPath = path.normalize(filePath);
  const publicDir = path.join(process.cwd(), 'public');
  
  if (!normalizedPath.startsWith(publicDir)) {
    res.writeHead(403, { 'Content-Type': 'text/html' });
    res.end('<h1>403 Forbidden</h1>', 'utf-8');
    return;
  }

  serveStaticFile(res, filePath);
});

// Initialize WebSocket server
console.log('Initializing WebSocket server...');
const wsServer = initWebSocketServer();

// Start HTTP server
server.listen(PORT, () => {
  console.log(`🚀 LED Soccer Scoreboard Server running on:`);
  console.log(`   HTTP: http://localhost:${PORT}`);
  console.log(`   WebSocket: ws://localhost:${WS_PORT}`);
  console.log(`   Admin Panel: http://localhost:${PORT}/admin`);
  console.log(`   Display: http://localhost:${PORT}/`);
  console.log(`\n🔄 Real-time updates enabled via WebSocket`);
  console.log(`📺 Optimized for LED displays with real-time communication`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    if (wsServer) {
      wsServer.close(() => {
        console.log('WebSocket server closed.');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    if (wsServer) {
      wsServer.close(() => {
        console.log('WebSocket server closed.');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  });
});