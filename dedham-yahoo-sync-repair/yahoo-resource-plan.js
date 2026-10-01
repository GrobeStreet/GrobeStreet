// Reference helper for the Dedham browser-session sync repair.
// Integrate these request targets into the existing authenticated Yahoo fetch path.

export const LEAGUE_KEY = "470.l.121502";
export const TEAM_IDS = Array.from({ length: 11 }, (_, i) => i + 1);

export function rosterUrls() {
  return TEAM_IDS.map(
    (id) =>
      `https://pub-api-ro.fantasysports.yahoo.com/fantasy/v2/team/${LEAGUE_KEY}.t.${id}/roster/players?format=json`
  );
}

export function draftUrl() {
  return `https://pub-api-ro.fantasysports.yahoo.com/fantasy/v2/league/${LEAGUE_KEY}/draftresults?format=json`;
}

export function defenseUrl() {
  return `https://pub-api-ro.fantasysports.yahoo.com/fantasy/v2/league/${LEAGUE_KEY}/players;status=A;position=DEF?format=json`;
}

export function scoreboardUrl() {
  return `https://pub-api-ro.fantasysports.yahoo.com/fantasy/v2/league/${LEAGUE_KEY}/scoreboard?format=json`;
}

export async function fetchYahooJson(url, fetchImpl = fetch) {
  const response = await fetchImpl(url, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Yahoo request failed ${response.status}: ${url}`);
  }

  return response.json();
}

export async function fetchDedhamRepairPayload(fetchImpl = fetch) {
  const rosters = [];
  for (const url of rosterUrls()) {
    rosters.push(await fetchYahooJson(url, fetchImpl));
  }

  const [draft, defenses, scoreboard] = await Promise.all([
    fetchYahooJson(draftUrl(), fetchImpl),
    fetchYahooJson(defenseUrl(), fetchImpl),
    fetchYahooJson(scoreboardUrl(), fetchImpl),
  ]);

  return {
    leagueKey: LEAGUE_KEY,
    capturedAt: new Date().toISOString(),
    rosters,
    draft,
    defenses,
    scoreboard,
  };
}
