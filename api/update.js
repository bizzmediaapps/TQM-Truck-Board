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

export default function handler(req, res) {
  if (req.method === "POST") {
    const { teamA, teamB, scoreA, scoreB, logoA, logoB, status, action } = req.body;
    if (action === "start") {
      if (scoreboard.paused) {
        scoreboard.startTime = Date.now() - scoreboard.pausedTime;
        scoreboard.paused = false;
      }
    } else if (action === "pause") {
      if (!scoreboard.paused) {
        scoreboard.pausedTime = Date.now() - scoreboard.startTime;
        scoreboard.paused = true;
      }
    } else if (action === "stop") {
      scoreboard.pausedTime = 0;
      scoreboard.startTime = null;
      scoreboard.paused = true;
    } else {
      if (teamA) scoreboard.teamA = teamA;
      if (teamB) scoreboard.teamB = teamB;
      if (typeof scoreA === "number") scoreboard.scoreA = scoreA;
      if (typeof scoreB === "number") scoreboard.scoreB = scoreB;
      if (logoA) scoreboard.logoA = logoA;
      if (logoB) scoreboard.logoB = logoB;
      if (status) scoreboard.status = status;
    }
    return res.status(200).json({ message: "Scoreboard updated" });
  }
  res.status(405).json({ message: "Method not allowed" });
}
