// Normalizes Yahoo's nested JSON roster response into the compact player shape
// used by the Dedham MCP. Designed to tolerate the array/object structure seen
// in Yahoo's current browser-session Fantasy v2 responses.

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function walk(value, visitor) {
  if (value === null || typeof value !== "object") return;
  visitor(value);
  if (Array.isArray(value)) {
    for (const child of value) walk(child, visitor);
    return;
  }
  for (const child of Object.values(value)) walk(child, visitor);
}

function mergeObjectFragments(value) {
  const out = {};
  const fragments = Array.isArray(value) ? value : [value];
  for (const fragment of fragments) {
    if (isPlainObject(fragment)) Object.assign(out, fragment);
  }
  return out;
}

function normalizeSelectedPosition(value) {
  if (!value) return null;
  const merged = mergeObjectFragments(value);
  return merged.position || null;
}

function normalizeEligiblePositions(value) {
  if (!value) return [];
  const positions = [];
  const add = (candidate) => {
    if (typeof candidate === "string") positions.push(candidate);
    else if (isPlainObject(candidate) && typeof candidate.position === "string") {
      positions.push(candidate.position);
    }
  };
  if (Array.isArray(value)) value.forEach(add);
  else add(value);
  return [...new Set(positions)];
}

export function normalizeYahooPlayerWrapper(wrapper) {
  if (!isPlainObject(wrapper) || !Array.isArray(wrapper.player)) return null;

  const parts = wrapper.player;
  const metadataSource = Array.isArray(parts[0]) ? parts[0] : parts;
  const meta = mergeObjectFragments(metadataSource);
  if (typeof meta.player_key !== "string") return null;

  let selectedPosition = null;
  for (const part of parts) {
    if (isPlainObject(part) && part.selected_position) {
      selectedPosition = normalizeSelectedPosition(part.selected_position);
      break;
    }
  }

  const fullName =
    (isPlainObject(meta.name) && (meta.name.full || [meta.name.first, meta.name.last].filter(Boolean).join(" "))) ||
    null;

  return {
    player_key: meta.player_key,
    player_id: meta.player_id ? String(meta.player_id) : null,
    name: fullName,
    position: meta.display_position || meta.primary_position || null,
    primary_position: meta.primary_position || meta.display_position || null,
    nfl_team: meta.editorial_team_abbr || null,
    nfl_team_name: meta.editorial_team_full_name || null,
    status: meta.status || null,
    status_full: meta.status_full || null,
    injury_note: meta.injury_note || null,
    bye_week: isPlainObject(meta.bye_weeks) ? meta.bye_weeks.week || null : null,
    lineup_slot: selectedPosition,
    eligible_positions: normalizeEligiblePositions(meta.eligible_positions),
    is_undroppable:
      meta.is_undroppable === "1" || meta.is_undroppable === 1 || meta.is_undroppable === true,
  };
}

export function normalizeYahooRosterPayload(rawRoster) {
  const byKey = new Map();
  walk(rawRoster, (node) => {
    if (!isPlainObject(node) || !Array.isArray(node.player)) return;
    const normalized = normalizeYahooPlayerWrapper(node);
    if (normalized?.player_key) byKey.set(normalized.player_key, normalized);
  });
  return [...byKey.values()];
}

export function normalizeRosterBundle(bundle) {
  const rawRosters = bundle?.yahooRostersRaw || bundle?.rosters || {};
  const normalized = {};
  for (const [teamKey, rawRoster] of Object.entries(rawRosters)) {
    normalized[teamKey] = normalizeYahooRosterPayload(rawRoster);
  }
  return normalized;
}

export function assertCompleteDedhamRosters(normalizedByTeam) {
  const expectedTeamKeys = Array.from(
    { length: 11 },
    (_, i) => `470.l.121502.t.${i + 1}`,
  );
  const missing = expectedTeamKeys.filter(
    (teamKey) => !Array.isArray(normalizedByTeam?.[teamKey]) || normalizedByTeam[teamKey].length === 0,
  );
  if (missing.length) {
    throw new Error(`Dedham roster normalization incomplete: ${missing.join(", ")}`);
  }
  return true;
}

// This helper is intended to replace the existing `roster: []` assignment in
// get_rosters/get_team normalization. It preserves team metadata verbatim and
// attaches the normalized roster matching each concrete Yahoo team key.
export function attachNormalizedRosters(teams, normalizedByTeam) {
  return (teams || []).map((team) => ({
    ...team,
    roster: normalizedByTeam?.[team.team_key] || [],
  }));
}
