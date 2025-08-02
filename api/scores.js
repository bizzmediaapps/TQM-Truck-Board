import { initWebSocketServer, getCurrentState } from './websocket.js';

function getSystemStatus() {
  return {
    online: true,
    lastUpdate: new Date().toISOString(),
    uptime: process.uptime ? Math.floor(process.uptime()) : 0,
    memory: process.memoryUsage ? process.memoryUsage() : null
  };
}

export default function handler(req, res) {
  // Set CORS headers for LED display compatibility
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Initialize WebSocket server if not already running
    initWebSocketServer();
    
    // Get current state from shared WebSocket module
    const currentState = getCurrentState();
    
    const response = {
      ...currentState,
      systemStatus: getSystemStatus(),
      // LED Display optimizations
      displayOptimized: true,
      responseTime: Date.now()
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error in scores API:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve scoreboard data',
      timestamp: Date.now(),
      systemStatus: { online: false }
    });
  }
}
