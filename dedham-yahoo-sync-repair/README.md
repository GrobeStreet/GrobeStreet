# Dedham Yahoo Sync Repair

Production target: Netlify site `dedham-almanac` (`6d469ac5-0874-4f4d-9b97-fdcbb4a4efeb`), Yahoo league `470.l.121502` / league ID `121502`.

## Confirmed failure mode

The live browser-session bridge is authenticated and current. League/team discovery, transactions and non-DEF free agents work, but `get_rosters()` and `get_team()` currently expose `roster: []` for every team.

The key implementation fact is that Yahoo's roster is a **Team subresource** and only one roster can be requested at a time. A league `/teams` request supplies team metadata but is not sufficient to populate each team's players.

## Repair included in this branch

### Browser capture: `extension/sync-rosters.js`

This module:

1. Requests `/league/470.l.121502/teams` inside the already-authenticated Yahoo browser session.
2. Extracts the actual 11 concrete team keys returned by Yahoo instead of assuming them.
3. Requests each `/team/{team_key}/roster` sequentially, with `/roster/players` as a fallback.
4. Rejects a sync if any team returns zero player keys.
5. Merges the raw roster responses into the existing bridge snapshot as `yahooRostersRaw` without removing working settings/transaction/free-agent payloads.

The calls use `credentials: "include"`; cookies remain in Chrome. Only Yahoo fantasy JSON should be uploaded to the Dedham bridge.

### MCP normalization: `server/normalize-rosters.js`

This module tolerates Yahoo's nested array/object JSON shape and normalizes each player to:

- player key / id / full name
- NFL team
- fantasy position / primary position
- Yahoo injury/status fields
- bye week
- selected lineup slot
- eligible positions
- undroppable flag

`attachNormalizedRosters()` is the replacement for the existing code path that currently emits `roster: []` in `get_rosters()` and `get_team()`.

### Regression test: `tests/normalize-rosters.test.mjs`

The fixture reproduces the Yahoo roster structure seen in a functioning browser-session Yahoo connector. It asserts that all 11 team keys normalize to non-empty rosters and that lineup-slot metadata survives.

Run from the repair directory with a Node version that supports ES modules:

```bash
node tests/normalize-rosters.test.mjs
```

## Integration hook

In the existing Chrome extension/helper's Sync Now handler, after the working league/team capture and before sending the snapshot to `bridge-sync`:

```js
import {
  fetchDedhamRosterBundle,
  mergeRosterBundleIntoSnapshot,
} from "./sync-rosters.js";

const rosterBundle = await fetchDedhamRosterBundle();
const snapshotWithRosters = mergeRosterBundleIntoSnapshot(
  existingSnapshot,
  rosterBundle,
);

// Send snapshotWithRosters through the EXISTING authenticated bridge-sync path.
```

In the existing MCP/bridge reader, normalize once and attach by concrete `team_key`:

```js
import {
  normalizeRosterBundle,
  assertCompleteDedhamRosters,
  attachNormalizedRosters,
} from "./normalize-rosters.js";

const normalizedByTeam = normalizeRosterBundle(snapshot);
assertCompleteDedhamRosters(normalizedByTeam);
const teamsWithRosters = attachNormalizedRosters(existingNormalizedTeams, normalizedByTeam);
```

Both `get_rosters()` and `get_team()` should read from `teamsWithRosters`. Do not maintain a second roster parser for `get_team()`.

## Other Yahoo resources still queued

After live rosters are verified, the same browser-session capture layer can add:

```text
/fantasy/v2/league/470.l.121502/draftresults?format=json
/fantasy/v2/league/470.l.121502/players;status=A;position=DEF?format=json
/fantasy/v2/league/470.l.121502/scoreboard?format=json
```

These are secondary to restoring live rosters.

## Acceptance gate

Do not call this fixed until a **fresh** browser-session sync passes all of these:

1. `check_connection()` says connected and league ID `121502`.
2. `get_rosters(2026)` returns 11 teams and every `roster` is non-empty.
3. `get_team({ team_id: "1", year: 2026 })` returns Fentanyl Fold with the same live player list as team 1 in `get_rosters()`.
4. No regression to settings, transactions or QB/RB/WR/TE free-agent data.

## Production constraint discovered

The active `dedham-almanac` Netlify deploy was created from the CLI and has no source ZIP or linked Git repository. Therefore this branch can hold the tested repair, but it cannot automatically overwrite the currently deployed Chrome-extension/server source until the local Dedham source tree is recovered or this code is integrated into that tree.

Preserve the current `BRIDGE_TOKEN`, `MCP_PATH_TOKEN`, league identity, and existing Netlify Blobs namespace when deploying.