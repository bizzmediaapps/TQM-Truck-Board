let scoreboard = {
  teamA: "Team A",
  teamB: "Team B",
  scoreA: 0,
  scoreB: 0,
  logoA: "",
  logoB: "",
  status: "Not Started",
  welcomeMessage: "",
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

function validateScoreboardData(data) {
  const errors = [];
  
  if (data.scoreA !== undefined && (typeof data.scoreA !== 'number' || data.scoreA < 0 || data.scoreA > 999)) {
    errors.push('Score A must be a number between 0 and 999');
  }
  
  if (data.scoreB !== undefined && (typeof data.scoreB !== 'number' || data.scoreB < 0 || data.scoreB > 999)) {
    errors.push('Score B must be a number between 0 and 999');
  }
  
  if (data.teamA !== undefined && (typeof data.teamA !== 'string' || data.teamA.length > 20)) {
    errors.push('Team A name must be a string with max 20 characters');
  }
  
  if (data.teamB !== undefined && (typeof data.teamB !== 'string' || data.teamB.length > 20)) {
    errors.push('Team B name must be a string with max 20 characters');
  }
  
  return errors;
}

function validateDisplaySettings(settings) {
  const errors = [];
  
  if (settings.brightness !== undefined && (typeof settings.brightness !== 'number' || settings.brightness < 10 || settings.brightness > 100)) {
    errors.push('Brightness must be a number between 10 and 100');
  }
  
  if (settings.contrast !== undefined && (typeof settings.contrast !== 'number' || settings.contrast < 50 || settings.contrast > 150)) {
    errors.push('Contrast must be a number between 50 and 150');
  }
  
  if (settings.refreshRate !== undefined && ![60, 120, 240].includes(settings.refreshRate)) {
    errors.push('Refresh rate must be 60, 120, or 240 Hz');
  }
  
  return errors;
}

export default function handler(req, res) {
  // Set CORS headers for LED display compatibility
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === "POST") {
    try {
      const { 
        teamA, teamB, scoreA, scoreB, logoA, logoB, status, welcomeMessage, action, triggers,
        displaySettings
      } = req.body;

      // Validate scoreboard data
      const scoreboardErrors = validateScoreboardData(req.body);
      if (scoreboardErrors.length > 0) {
        return res.status(400).json({
          error: 'Validation failed',
          messages: scoreboardErrors,
          timestamp: Date.now()
        });
      }

      // Handle timer actions
      if (action === "start") {
        if (scoreboard.paused) {
          scoreboard.startTime = Date.now() - scoreboard.pausedTime;
          scoreboard.paused = false;
          scoreboard.status = "1st Half"; // Auto-update status
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
        if (welcomeMessage !== undefined) scoreboard.welcomeMessage = String(welcomeMessage).substring(0, 100);
      }

      // Handle media triggers
      if (triggers && typeof triggers === 'object') {
        // Validate trigger URLs
        Object.keys(triggers).forEach(key => {
          if (triggers[key] && typeof triggers[key] === 'string') {
            try {
              new URL(triggers[key]); // Validate URL format
              scoreboard.triggers[key] = triggers[key];
            } catch (e) {
              console.warn(`Invalid trigger URL for key ${key}:`, triggers[key]);
            }
          }
        });
      }

      // Handle LED display settings
      if (displaySettings && typeof displaySettings === 'object') {
        const displayErrors = validateDisplaySettings(displaySettings);
        if (displayErrors.length > 0) {
          return res.status(400).json({
            error: 'Display settings validation failed',
            messages: displayErrors,
            timestamp: Date.now()
          });
        }

        // Update display settings
        if (displaySettings.brightness !== undefined) {
          scoreboard.displaySettings.brightness = displaySettings.brightness;
        }
        if (displaySettings.contrast !== undefined) {
          scoreboard.displaySettings.contrast = displaySettings.contrast;
        }
        if (displaySettings.refreshRate !== undefined) {
          scoreboard.displaySettings.refreshRate = displaySettings.refreshRate;
        }
        if (displaySettings.resolution !== undefined) {
          scoreboard.displaySettings.resolution = displaySettings.resolution;
        }
      }

      // Update timestamp
      scoreboard.displaySettings.lastUpdate = new Date().toISOString();

      return res.status(200).json({ 
        message: "Scoreboard updated successfully",
        timestamp: Date.now(),
        updated: {
          scoreboard: !action,
          timer: !!action,
          triggers: !!triggers,
          displaySettings: !!displaySettings
        }
      });

    } catch (error) {
      console.error('Error updating scoreboard:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to update scoreboard',
        timestamp: Date.now()
      });
    }
  }

  res.status(405).json({ 
    error: 'Method not allowed',
    message: 'Only POST requests are supported',
    timestamp: Date.now()
  });
}
