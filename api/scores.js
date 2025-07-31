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
  pausedTime: 0
};

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const mins = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const secs = String(totalSeconds % 60).padStart(2, '0');
  return `${mins}:${secs}`;
}

export default function handler(req, res) {
  let now = Date.now();
  let elapsed = scoreboard.paused ? scoreboard.pausedTime : now - scoreboard.startTime;
  scoreboard.time = formatTime(Math.min(elapsed, 120 * 60 * 1000));
  res.status(200).json(scoreboard);
}
