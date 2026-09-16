// Browser-session roster capture for Yahoo Fantasy league 121502.
// Run this from the existing authenticated Yahoo-page sync path.
// It never exports Yahoo cookies; only the returned fantasy JSON should be sent to the bridge.

export const DEDHAM_LEAGUE_KEY = "470.l.121502";
export const YAHOO_FANTASY_BASE =
  "https://pub-api-ro.fantasysports.yahoo.com/fantasy/v2";

function isObject(value) {
  return value !== null && typeof value === "object";
}

function walk(value, visitor) {
  if (!isObject(value)) return;
  visitor(value);
  if (Array.isArray(value)) {
    for (const child of value) walk(child, visitor);
    return;
  }
  for (const child of Object.values(value)) walk(child, visitor);
}

export function extractTeamKeys(payload) {
  const found = new Set();
  walk(payload, (node) => {
    if (
      !Array.isArray(node) &&
      typeof node.team_key === "string" &&
      /^470\.l\.121502\.t\.\d+$/.test(node.team_key)
    ) {
      found.add(node.team_key);
    }
  });

  return [...found].sort((a, b) => {
    const ai = Number(a.split(".").at(-1));
    const bi = Number(b.split(".").at(-1));
    return ai - bi;
  });
}

export function countPlayerKeys(payload) {
  const found = new Set();
  walk(payload, (node) => {
    if (!Array.isArray(node) && typeof node.player_key === "string") {
      found.add(node.player_key);
    }
  });
  return found.size;
}

export async function yahooFantasyJson(path, fetchImpl = fetch) {
  const joiner = path.includes("?") ? "&" : "?";
  const url = `${YAHOO_FANTASY_BASE}${path}${joiner}format=json`;
  const response = await fetchImpl(url, {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Yahoo Fantasy request failed (${response.status}) ${url}`);
  }

  return response.json();
}

async function fetchOneRoster(teamKey, fetchImpl) {
  // Yahoo documents roster as a Team subresource. /roster normally includes
  // the player collection. Keep /roster/players as a fallback because Yahoo's
  // JSON shape has varied between transports.
  const roster = await yahooFantasyJson(`/team/${teamKey}/roster`, fetchImpl);
  if (countPlayerKeys(roster) > 0) return roster;

  const players = await yahooFantasyJson(
    `/team/${teamKey}/roster/players`,
    fetchImpl,
  );
  if (countPlayerKeys(players) === 0) {
    throw new Error(`Yahoo returned zero roster players for ${teamKey}`);
  }
  return players;
}

export async function fetchDedhamRosterBundle(fetchImpl = fetch) {
  const teams = await yahooFantasyJson(
    `/league/${DEDHAM_LEAGUE_KEY}/teams`,
    fetchImpl,
  );
  const teamKeys = extractTeamKeys(teams);

  if (teamKeys.length !== 11) {
    throw new Error(
      `Expected 11 Dedham team keys, found ${teamKeys.length}: ${teamKeys.join(", ")}`,
    );
  }

  const rosters = {};
  // Yahoo roster is explicitly a one-team-at-a-time resource. Sequential calls
  // are intentional: they are gentler on the logged-in browser session and make
  // failures attributable to an exact team key.
  for (const teamKey of teamKeys) {
    rosters[teamKey] = await fetchOneRoster(teamKey, fetchImpl);
  }

  const rosterCounts = Object.fromEntries(
    teamKeys.map((teamKey) => [teamKey, countPlayerKeys(rosters[teamKey])]),
  );
  const empty = Object.entries(rosterCounts)
    .filter(([, count]) => count === 0)
    .map(([teamKey]) => teamKey);
  if (empty.length) {
    throw new Error(`Roster capture incomplete for: ${empty.join(", ")}`);
  }

  return {
    leagueKey: DEDHAM_LEAGUE_KEY,
    capturedAt: new Date().toISOString(),
    teams,
    rosters,
    rosterCounts,
  };
}

// Merge helper for the existing browser extension. Preserve every working
// payload family (settings, transactions, free agents, etc.) and add raw roster
// responses under a stable key for the bridge/MCP normalizer.
export function mergeRosterBundleIntoSnapshot(existingSnapshot, rosterBundle) {
  return {
    ...(existingSnapshot || {}),
    leagueKey: DEDHAM_LEAGUE_KEY,
    capturedAt: rosterBundle.capturedAt,
    yahooTeamsRaw: rosterBundle.teams,
    yahooRostersRaw: rosterBundle.rosters,
    rosterCounts: rosterBundle.rosterCounts,
  };
}
