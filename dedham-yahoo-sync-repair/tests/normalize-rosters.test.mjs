import assert from "node:assert/strict";
import {
  normalizeYahooRosterPayload,
  normalizeRosterBundle,
  assertCompleteDedhamRosters,
  attachNormalizedRosters,
} from "../server/normalize-rosters.js";

function yahooRosterFixture(teamId, playerId, name, position, lineupSlot) {
  const teamKey = `470.l.121502.t.${teamId}`;
  return {
    team: [
      [
        { team_key: teamKey },
        { team_id: String(teamId) },
        { name: `Team ${teamId}` },
      ],
      {
        roster: {
          0: {
            players: {
              0: {
                player: [
                  [
                    { player_key: `470.p.${playerId}` },
                    { player_id: String(playerId) },
                    { name: { first: name.split(" ")[0], last: name.split(" ").slice(1).join(" "), full: name } },
                    { editorial_team_full_name: "Test NFL Team" },
                    { editorial_team_abbr: "TST" },
                    { display_position: position },
                    { primary_position: position },
                    { eligible_positions: [{ position }] },
                    { bye_weeks: { week: "7" } },
                    { is_undroppable: "0" },
                  ],
                  {
                    selected_position: [
                      { coverage_type: "week" },
                      { week: "2" },
                      { position: lineupSlot },
                      { is_flex: lineupSlot === "BN" ? 0 : 1 },
                    ],
                  },
                ],
              },
              count: 1,
            },
          },
          week: 2,
        },
      },
    ],
  };
}

const one = yahooRosterFixture(1, 40001, "Test Runner", "RB", "RB");
const parsed = normalizeYahooRosterPayload(one);
assert.equal(parsed.length, 1);
assert.deepEqual(parsed[0], {
  player_key: "470.p.40001",
  player_id: "40001",
  name: "Test Runner",
  position: "RB",
  primary_position: "RB",
  nfl_team: "TST",
  nfl_team_name: "Test NFL Team",
  status: null,
  status_full: null,
  injury_note: null,
  bye_week: "7",
  lineup_slot: "RB",
  eligible_positions: ["RB"],
  is_undroppable: false,
});

const raw = {};
const teams = [];
for (let teamId = 1; teamId <= 11; teamId += 1) {
  const key = `470.l.121502.t.${teamId}`;
  raw[key] = yahooRosterFixture(
    teamId,
    41000 + teamId,
    `Player ${teamId}`,
    teamId === 11 ? "QB" : "RB",
    teamId === 11 ? "BN" : "RB",
  );
  teams.push({ team_key: key, team_id: String(teamId), name: `Team ${teamId}`, roster: [] });
}

const normalized = normalizeRosterBundle({ yahooRostersRaw: raw });
assert.equal(Object.keys(normalized).length, 11);
assert.equal(normalized["470.l.121502.t.1"][0].name, "Player 1");
assert.equal(normalized["470.l.121502.t.11"][0].lineup_slot, "BN");
assert.equal(assertCompleteDedhamRosters(normalized), true);

const attached = attachNormalizedRosters(teams, normalized);
assert.equal(attached.length, 11);
assert.equal(attached[0].roster.length, 1);
assert.equal(attached[10].roster[0].position, "QB");

assert.throws(
  () => assertCompleteDedhamRosters({ "470.l.121502.t.1": parsed }),
  /normalization incomplete/,
);

console.log("Dedham roster normalizer regression tests passed");
