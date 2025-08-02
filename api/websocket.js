import { WebSocketServer } from 'ws';

// In-memory storage for the current game state (shared with scores.js and update.js)
let scoreboard = {
  teamA: "Team A",
  teamB: "Team B",
  scoreA: 0,
  scoreB: 0,
  logoA: "",
  logoB: "",
  status: "Not Started",
  startTime: null,
  paused: true,
  pausedTime: 0,
  triggers: {},
  displaySettings: {
    brightness: 100,
    contrast: 100,
    refreshRate: 60,
    resolution: "1920x1080",
    lastUpdate: new Date().toISOString()
  }
};

let wss = null;
let connectedClients = new Set();

// Initialize WebSocket server if not already created
function initWebSocketServer() {
  if (wss) return wss;
  
  wss = new WebSocketServer({ 
    port: process.env.WS_PORT || 8080,
    perMessageDeflate: false // Better for LED displays
  });
  
  wss.on('connection', (ws, req) => {
    const clientType = req.url?.includes('admin') ? 'admin' : 'display';
    ws.clientType = clientType;
    connectedClients.add(ws);
    
    console.log(`New ${clientType} connection established. Total clients: ${connectedClients.size}`);
    
    // Send current state immediately upon connection
    ws.send(JSON.stringify({
      type: 'initial_state',
      data: getCurrentState(),
      timestamp: Date.now()
    }));
    
    // Handle ping/pong for connection health
    ws.isAlive = true;
    ws.on('pong', () => {
      ws.isAlive = true;
    });
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        handleClientMessage(ws, data);
      } catch (error) {
        console.error('Invalid WebSocket message:', error);
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Invalid message format',
          timestamp: Date.now()
        }));
      }
    });
    
    ws.on('close', () => {
      connectedClients.delete(ws);
      console.log(`${clientType} connection closed. Total clients: ${connectedClients.size}`);
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      connectedClients.delete(ws);
    });
  });
  
  // Heartbeat to detect broken connections
  const heartbeat = setInterval(() => {
    connectedClients.forEach((ws) => {
      if (!ws.isAlive) {
        connectedClients.delete(ws);
        return ws.terminate();
      }
      
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);
  
  wss.on('close', () => {
    clearInterval(heartbeat);
  });
  
  return wss;
}

function handleClientMessage(ws, data) {
  switch (data.type) {
    case 'ping':
      ws.send(JSON.stringify({
        type: 'pong',
        timestamp: Date.now()
      }));
      break;
      
    case 'get_state':
      ws.send(JSON.stringify({
        type: 'state_update',
        data: getCurrentState(),
        timestamp: Date.now()
      }));
      break;
      
    case 'admin_update':
      if (ws.clientType === 'admin') {
        handleAdminUpdate(data.payload);
        broadcastUpdate('scoreboard_update', getCurrentState());
      }
      break;
      
    default:
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Unknown message type',
        timestamp: Date.now()
      }));
  }
}

function handleAdminUpdate(payload) {
  const { 
    teamA, teamB, scoreA, scoreB, logoA, logoB, status, action, triggers,
    displaySettings
  } = payload;

  // Handle timer actions
  if (action === "start") {
    if (scoreboard.paused) {
      scoreboard.startTime = Date.now() - scoreboard.pausedTime;
      scoreboard.paused = false;
      scoreboard.status = "1st Half";
    }
  } else if (action === "pause") {
    if (!scoreboard.paused) {
      scoreboard.pausedTime = Date.now() - scoreboard.startTime;
      scoreboard.paused = true;
      scoreboard.status = "Paused";
    }
  } else if (action === "stop") {
    scoreboard.pausedTime = 0;
    scoreboard.startTime = null;
    scoreboard.paused = true;
    scoreboard.status = "Not Started";
  } else {
    // Update scoreboard data
    if (teamA !== undefined) scoreboard.teamA = String(teamA).substring(0, 20);
    if (teamB !== undefined) scoreboard.teamB = String(teamB).substring(0, 20);
    if (typeof scoreA === "number") scoreboard.scoreA = Math.max(0, Math.min(999, scoreA));
    if (typeof scoreB === "number") scoreboard.scoreB = Math.max(0, Math.min(999, scoreB));
    if (logoA !== undefined) scoreboard.logoA = String(logoA);
    if (logoB !== undefined) scoreboard.logoB = String(logoB);
    if (status !== undefined) scoreboard.status = String(status);
  }

  // Handle media triggers
  if (triggers && typeof triggers === 'object') {
    Object.keys(triggers).forEach(key => {
      if (triggers[key] && typeof triggers[key] === 'string') {
        try {
          new URL(triggers[key]);
          scoreboard.triggers[key] = triggers[key];
        } catch (e) {
          console.warn(`Invalid trigger URL for key ${key}:`, triggers[key]);
        }
      }
    });
  }

  // Handle LED display settings
  if (displaySettings && typeof displaySettings === 'object') {
    Object.assign(scoreboard.displaySettings, displaySettings);
  }

  // Update timestamp
  scoreboard.displaySettings.lastUpdate = new Date().toISOString();
}

function getCurrentState() {
  let now = Date.now();
  let elapsed = scoreboard.paused ? scoreboard.pausedTime : now - scoreboard.startTime;
  elapsed = Math.max(0, Math.min(elapsed, 120 * 60 * 1000));
  
  return {
    ...scoreboard,
    time: formatTime(elapsed),
    timestamp: now,
    displayOptimized: true,
    responseTime: Date.now()
  };
}

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const mins = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const secs = String(totalSeconds % 60).padStart(2, '0');
  return `${mins}:${secs}`;
}

function broadcastUpdate(type, data, excludeClient = null) {
  const message = JSON.stringify({
    type,
    data,
    timestamp: Date.now()
  });
  
  connectedClients.forEach((client) => {
    if (client !== excludeClient && client.readyState === 1) { // WebSocket.OPEN
      try {
        client.send(message);
      } catch (error) {
        console.error('Error sending message to client:', error);
        connectedClients.delete(client);
      }
    }
  });
}

// Export functions for use by HTTP APIs
export { 
  initWebSocketServer, 
  broadcastUpdate, 
  getCurrentState, 
  scoreboard 
};

// HTTP API handler for WebSocket status
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    const wsServer = initWebSocketServer();
    
    res.status(200).json({
      status: 'WebSocket server running',
      port: process.env.WS_PORT || 8080,
      connectedClients: connectedClients.size,
      clientTypes: Array.from(connectedClients).map(ws => ws.clientType),
      timestamp: Date.now()
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}