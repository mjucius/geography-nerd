# Plan: difficulty progression

Source: `docs/product/brief.md` (approved, option A). The previous plan is at `docs/plan-visual-refresh.md` (done).

## Stack (unchanged)
React 19 + Vite + TypeScript, vitest (`npm test`), `npm run lint`. No new runtime dependencies. The only new thing is a one-time Node script (Node >= 24, global `fetch`) that calls the public Wikidata API (CC0, no key, no account) to count sitelinks. Its output is committed, so the game makes no network calls for it. Nothing for the CEO to supply.

## How it works
- **Data.** `data/cities-import.sql` stays the source of the ~1,000 cities. `data/city-sitelinks.json` (new, committed) maps `name|country` to `{qid, sitelinks}`. `scripts/generate-local-cities.mjs` merges the two and writes a compact `web/src/data/cities.json`: one row per city `[name, countryCode, population, lat, lon, sitelinks]`, plus a country-code to name/region map. About 60 bytes per city against about 430 today. A small loader (`cityDataService.ts`) expands rows into the existing `City` shape, so components are untouched. `is_capital` and the capitals list stay through T-015 (the old filters still use them) and are removed in T-016 together with those filters.
- **One level table** (`web/src/services/levels.ts`), one row per level 1-10: `pool` (the N most familiar cities by sitelinks, ties broken by population), and the trickiness band in km: `askedMin`, `askedMax`, `otherMin`. The asked gap is the smaller of the two gaps and the other gap the larger, both from `getDistanceInfo` (the same km the reveal shows). A pair is valid for a level when both cities are in the pool and `askedMin <= asked <= askedMax` and `other >= otherMin`. Starting values: pool 40, 60, 90, 130, 190, 270, 400, 560, 760, 1000; level 1 asked >= 1,500 km, ending at level 10 asked <= 100 km with other >= 3,000 km. These are tuned in T-017 against the real data, since the test needs 200+ pairs per level.
- **Pairs.** Valid pairs are enumerated once per level (at most about 500k pair checks at level 10) and cached. A quiz samples without repeats, so no pair appears twice. This replaces the 100-attempt random search that cannot find rare pairs at the hard levels. 8 current + 2 next-level preview (10 at level 10), the 8/10 pass bar and the level names are untouched.

## Milestones
**M1. Familiarity ladder** (usable alone: levels now differ by how well known the cities are).
1. T-014 Fetch sitelinks script and committed `city-sitelinks.json`.
2. T-015 Compact city data and loader. `is_capital` stays for now so the old level filters keep working.
3. T-016 Level table with pools by familiarity, replacing the population and capital filters, `is_capital` and the capitals list removed with them, plus Wikidata credit (ATTRIBUTION.md and in-app Credits).

**M2. Trickiness ladder.**
4. T-017 Trickiness in km: band columns in the level table, pair enumeration, no repeats, question axis chosen in km, old ratio code deleted, monotonic and 200-pair tests.
5. T-018 Ladder verification: tests for the ends of the ladder and for the unchanged behaviour, a no-network-at-runtime check, size check.

## M3. Cleaner data and questions (added after the brief grew: Decisions 8 to 10, acceptance 10 and 11)
Nothing new for the CEO to supply: the sub-city script reads the public Wikidata API once, like `fetch:sitelinks`, and commits its output.
- **T-019 Duplicate places** (filed by QA). `data/excluded-cities.json` (`{ "Name|CC": "reason" }`) is the one removal mechanism: the generator drops every key on it, and the sitelinks file and the SQL stay untouched. T-019 builds the mechanism and its first six entries (Benito Juárez, Benito Juarez, Fuencarral and Fuencarral-El Pardo as sub-city entries with no row kept; Jaboatão and Lexington-Fayette as "duplicate of ..." with Lexington and Jaboatão dos Guararapes kept once), per pm. Tests: no two cities share a QID, every excluded key is a real SQL row with a reason, the shipped count is the SQL count minus the exclusions.
- **T-020 No same-name pairs** (acceptance 10). `validPairs` skips a pair whose displayed names match ignoring case and accents (the display includes the Washington D.C. rule). In the data this affects London (GB, CA), Cordoba (AR, ES), Cartagena (CO, ES), Hamilton (CA, NZ) and Newcastle (AU, ZA). Test over all pools and levels, plus quizzes.
- **T-021 Sub-city flag script** (acceptance 11, how the list is built). `scripts/flag-subcity.mjs` reads the instance-of (P31) classes of every committed QID and the class labels from Wikidata, flags a city when all its classes are on a sub-city/admin-area class list in the script, and writes the report `data/subcity-flags.json` (committed, so the review needs no network). No app change.
- **T-022 Reviewed exclusion list** (acceptance 11, done when). I review the flagged cities and the unflagged ones whose names look like districts by hand, add each real sub-city entry to `data/excluded-cities.json` with reason `part of <city>`, and regenerate. Tests: every example from the brief is gone (Eixample, Hamburg-Nord, Sector 1 to 6 of Bucharest, Gustavo A. Madero, South Boston, Tuggeranong Administrative District) and separate municipalities stay (Brampton, Yokohama, Giza, Quezon City); every excluded entry has a reason; every level still has 200+ valid pairs. The count then falls below 1,000, which pm confirmed (Decision 10).
Order: T-018, T-019, T-020, T-021, T-022. Tickets T-019 and T-020 to T-022 are in `.juicebots/tickets/`.

## Testing
- `npm test` and `npm run lint` in the foreground, exit status read directly.
- Every new test is proven able to fail by breaking the code on a copy outside the repo (for example loosening a level's band, shrinking a pool, dropping the repeat check).
- Data tests run against the committed data: the shipped count is the SQL row count minus the entries in `data/excluded-cities.json` (1,000 before M3), every city has a sitelink count, no `is_capital`.
- The level table tests (monotonic, 200+ pairs per level, ends of the ladder) read the real table and the real cities, so a tuning change that breaks the ladder goes red.
- The fetch script is checked by running it: a coverage report lists unmatched cities, which are fixed through a small `data/wikidata-overrides.json` (name|country to QID). It needs network, so it runs by hand and is not part of `npm test`.
- The reveal and results screens are not changed, so no browser pass is needed. I play levels 1, 5 and 10 in the browser once in T-018 as a sanity check.

## Review notes
### project plan review, round 1: changes
- [blocking] docs/plan.md:16 T-015 removes is_capital before T-016 replaces its consumers (cityDataService filters levels 1-5 on it), so levels 1-5 would have empty pools and the game would not play as before: keep the flag and capitals list through T-015, remove them in T-016 with the capital filters, and update both tickets' acceptance and the plan accordingly.
- by codex:gpt-6.1-sol

### project plan review, round 2: approved
- by codex:gpt-6.1-sol

### project plan review (M3 additions), round 1: changes
- [blocking] .juicebots/tickets/T-019.md:26 Acceptance requires all four duplicate pairs present once, but Decision 10 and the ticket's plan require both Benito Juarez rows and both Fuencarral rows absent: require zero shipped rows for the Benito Juarez and Fuencarral pairs, and exactly one retained row each for Lexington and Jaboatao dos Guararapes.
- [nit] docs/plan.md:25 The plan says T-019 creates four exclusion entries but lists six, and the Testing section still specifies exactly 1,000 shipped cities: say six initial exclusions and change the shipped-count requirement to SQL row count minus exclusions.
- by codex:gpt-6.1-sol

### project plan review (M3 additions), round 2: approved
- by codex:gpt-6.1-sol
