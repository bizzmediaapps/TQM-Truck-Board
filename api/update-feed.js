import { Octokit } from "octokit";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const {
    teamA, logoA, scoreA,
    teamB, logoB, scoreB,
    timer, status
  } = req.body;

  const content = `
<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Live Soccer Scoreboard</title>
    <link>https://github.com/bizzmediaapps/TQM-Truck-Board/public/rss_feed_scoreboard.xml/link>
    <description>Real-time updates for the ongoing soccer match.</description>
    <item>
      <title>${teamA} vs ${teamB}</title>
      <description>
        <![CDATA[
          <scoreboard>
            <teamA>${teamA}</teamA>
            <teamB>${teamB}</teamB>
            <scoreA>${scoreA}</scoreA>
            <scoreB>${scoreB}</scoreB>
            <logoA>${logoA}</logoA>
            <logoB>${logoB}</logoB>
            <timer>${timer}</timer>
            <status>${status}</status>
          </scoreboard>
        ]]>
      </description>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <guid>match-${Date.now()}</guid>
    </item>
  </channel>
</rss>`.trim();

  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  const owner = process.env.GITHUB_USERNAME;
  const repo = process.env.GITHUB_REPO;
  const path = process.env.RSS_FILE_PATH;

  const { data: { sha } } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    owner, repo, path
  });

  await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
    owner, repo, path,
    message: `Update scoreboard at ${new Date().toISOString()}`,
    content: Buffer.from(content).toString('base64'),
    sha
  });

  res.status(200).json({ message: "Scoreboard updated on GitHub!" });
}
