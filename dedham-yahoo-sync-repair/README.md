# Dedham Yahoo Sync Repair

Production target: Netlify site `dedham-almanac` (`6d469ac5-0874-4f4d-9b97-fdcbb4a4efeb`), Yahoo league `470.l.121502` / league ID `121502`.

## Confirmed failure modes

The live bridge is healthy and current, but the normalized MCP output still returns:

- `roster: []` for all 11 teams
- `picks: []` for draft results
- an empty free-agent result for `DEF`
- no scoreboard point totals in the exposed standings payload

League metadata, transactions, and non-DEF free agents are working.

## Required Yahoo requests

### 1. Team rosters
Yahoo supports one team roster per request. Loop team IDs 1 through 11 and fetch each team individually:

```text
/fantasy/v2/team/470.l.121502.t.1/roster/players?format=json
...
/fantasy/v2/team/470.l.121502.t.11/roster/players?format=json
```

Do not rely on a league-wide teams request to populate player arrays.

### 2. Draft results

```text
/fantasy/v2/league/470.l.121502/draftresults?format=json
```

### 3. Available defenses

```text
/fantasy/v2/league/470.l.121502/players;status=A;position=DEF?format=json
```

If Yahoo rejects semicolon filters in the current wrapper, request the league players collection and filter `display_position === "DEF"` after parsing.

### 4. Scoreboard

```text
/fantasy/v2/league/470.l.121502/scoreboard?format=json
```

Capture team totals / weekly scoring so the MCP can expose actual scoreboard data instead of only team ordering.

## Acceptance checks

The repair is complete only when all of these are true:

1. `get_rosters(2026)` returns non-empty player arrays for all 11 teams.
2. `get_team(...Fentanyl Fold...)` includes the actual current player list.
3. `get_draft(2026)` returns draft picks instead of `picks: []`.
4. `get_free_agents(position="DEF")` returns available/waiver defenses when present.
5. Standings/scoreboard output exposes numeric fantasy-point totals.
6. Existing working resources remain intact: league settings, transactions, QB/RB/WR/TE free agents.

## Production safety

Do not replace the production bridge until the repaired payload is validated against a fresh Yahoo browser-session sync. Preserve current `BRIDGE_TOKEN`, `MCP_PATH_TOKEN`, league identity, and any existing Netlify Blobs namespace.