
let currentScore = {
  teamA: "Team A",
  teamB: "Team B",
  scoreA: 0,
  scoreB: 0,
  time: "00:00",
  status: "Not Started",
  logoA: "",
  logoB: ""
};

export default function handler(req, res) {
  if (req.method === "POST") {
    const { teamA, teamB, scoreA, scoreB, status, time, logoA, logoB } = req.body;
    currentScore = { teamA, teamB, scoreA, scoreB, status, time, logoA, logoB };
    return res.status(200).json({ message: "Score updated" });
  }
  res.status(405).json({ message: "Only POST allowed" });
}
