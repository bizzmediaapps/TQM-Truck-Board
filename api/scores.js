
import { IncomingMessage, ServerResponse } from "http";

let currentScore = {
  teamA: "Team A",
  teamB: "Team B",
  scoreA: 0,
  scoreB: 0,
  status: "Not Started"
};

export default function handler(req, res) {
  res.status(200).json(currentScore);
}
