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
  // LED Display specific settings
  displaySettings: {
    brightness: 100,
    contrast: 100,
    refreshRate: 60,
    resolution: "1920x1080",
    lastUpdate: new Date().toISOString()
  }
};

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const mins = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const secs = String(totalSeconds % 60).padStart(2, '0');
  return `${mins}:${secs}`;
}

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
    let now = Date.now();
    let elapsed = scoreboard.paused ? scoreboard.pausedTime : now - scoreboard.startTime;
    
    // Cap timer at 120 minutes (7200000 ms)
    elapsed = Math.max(0, Math.min(elapsed, 120 * 60 * 1000));
    
    const response = {
      ...scoreboard,
      time: formatTime(elapsed),
      timestamp: now,
      systemStatus: getSystemStatus(),
      // LED Display optimizations
      displayOptimized: true,
      responseTime: Date.now()
    };

    // Update display settings timestamp
    response.displaySettings.lastUpdate = new Date().toISOString();

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
