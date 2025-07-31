
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
  res.status(200).json(currentScore);
}
