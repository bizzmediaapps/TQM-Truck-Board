export default function handler(req, res) {
  const data = {
    teamA: "Team A",
    teamB: "Team B",
    scoreA: 2,
    scoreB: 1,
    time: "75:30",
    status: "Second Half"
  };

  const rss = `
<rss version="2.0">
  <channel>
    <title>Live Soccer Score</title>
    <item>
      <title>${data.teamA} vs ${data.teamB}</title>
      <description>${data.teamA} ${data.scoreA} - ${data.scoreB} ${data.teamB} | ${data.time} (${data.status})</description>
    </item>
  </channel>
</rss>`.trim();

  res.setHeader('Content-Type', 'application/rss+xml');
  res.status(200).send(rss);
}
