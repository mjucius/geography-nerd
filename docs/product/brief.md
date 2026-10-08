---
status: approved          # draft | approved (only team-lead sets approved)
---
# Geography Nerd: difficulty progression

(The approved visual refresh brief now lives at `docs/product/brief-visual-refresh.md`.)

## Problem and who it's for
The players are the same casual phone and desktop players as before. Good players currently clear level 1 and then get no harder game. The CEO says the levels feel the same, that unfamiliar cities are harder, and that pairs close on the asked axis but far apart on the other axis are especially hard. The code bears out both points:

- **The game ships only 100 cities.** `scripts/generate-local-cities.mjs` keeps the 100 largest of the 1,000 in `data/cities-import.sql`. The smallest of them has 3.37M people. Every population filter for levels 6–10 (>1M, >500k, >250k, >100k, >50k) therefore returns the same 100 cities, and levels 1–5 all return the same 28 "capitals". About a third of those aren't capitals: the hand-written list includes Shanghai, Mumbai, Lagos, Istanbul, Karachi and others.
- **City familiarity never changes,** so the only thing that varies between levels is a lat/lon ratio gate in `quizService.ts`. That gate:
  - is not monotonic. Level 6 is looser than level 5, and levels 2, 3, 7 and 10 accept any pair.
  - ignores scale. A pair 1° apart one way and 1.3° the other passes as a level 1 "clear" pair.
  - allows few pairs. Level 1 has only 36 valid pairs and level 9 has 108, so questions repeat.
  - uses raw degrees, while the reveal shows km (T-009).
- **The level lives only in memory.** It resets to 1 on every visit, so most players never see level 6 or higher.

The CEO's two observations correspond to the two things the game doesn't control yet: **familiarity** (how well known the cities are) and **trickiness** (a small gap on the asked axis against a large gap on the other axis).

**Comparables.** Seterra and GeoGuessr make content harder by gating it, through region sets and map packs such as "Famous Places" versus "A Diverse World". Lichess rates each puzzle with Glicko-2 from player results, which needs a backend to collect those results. Worldle and Globle have no levels and offer one daily puzzle. We have no backend and promise no tracking, so only content gating (or a difficulty score computed at build time) is open to us. For familiarity, the usual proxy is the number of Wikipedia language editions with an article on the city (Wikidata sitelinks, CC0). It catches what population misses: Puyang has 3.6M people and few readers, while Geneva is small and famous.

## Baseline (in every option)
- Ship more of the 1,000 cities, and compact the record format. Today the data file runs 2,300 lines for just 100 cities.
- Give each city a familiarity score, computed once by a script at build time. Credit the source in `ATTRIBUTION.md` and in the in-app Credits.
- Give each pair a trickiness score in km: the gap on the asked axis and the gap on the other axis, using the same distances the reveal shows.
- Fix or drop the "capital" flag.

## Options
### A. Two-dial ladder: keep the levels, but make each one strictly harder
- **What it is:** each level is a band on both dials, for example "famous cities, asked gap > 1,500 km" up to "obscure cities, asked gap < 100 km, other gap > 3,000 km". No level is easier than the one before on either dial. The current flow stays: 8/10 to advance, 2 preview questions, the ScoreScreen and the level names.
- **v1:** the baseline, a new level table in place of the ratio and population switches, and a test that checks each level is at least as hard as the one before.
- **Trade-off:** this is the smallest UX change and fixes the root cause directly. The bands are hand-tuned guesses, not measured difficulty.

### B. Adaptive: no fixed levels, the game adjusts as you play
- **What it is:** combine the two dials into one difficulty score per pair. Each correct answer moves the next question up and each miss moves it down, like a staircase. The end screen shows a rating ("You reached 1,240") instead of a level.
- **v1:** the baseline, the score and staircase, and a redesigned results screen. The level buttons go away.
- **Trade-off:** every player is challenged at their own level, even within one game. It replaces the level UX and isn't honestly "calibrated", because the score is still our formula and not player data. The rating also resets each visit unless we store it.

### C. Player picks: two dials on the start screen, no progression
- **What it is:** the player chooses Cities (Famous, Well-known, Obscure) and Trickiness (Clear, Close, Brutal) before starting, much like choosing a map in GeoGuessr.
- **v1:** the baseline, the two selectors on the home page, and the results screen showing the chosen settings. Levels and names go away.
- **Trade-off:** it's transparent and easy to build, and it fits the CEO's framing well. It gives up the sense of progression, and new players have to make two choices before they can play.

## Recommendation
**A.** The levels already exist and players understand them. The problem is that the content under them is broken. A fixes the content directly with the least UI change, and B or C could later reuse the same scores. Ship it with the baseline, or the new level table will be choosing from the same 100 cities.

## Open questions
None. All 7 were answered by the CEO (see Decisions).

## Decisions
CEO, 2026-10-05:
1. Option A: two-dial ladder (familiarity × trickiness).
2. Familiarity comes from Wikidata sitelink counts via a one-time build script.
3. Keep 10 levels.
4. Don't persist the level. It resets each visit, and PRIVACY.md stays as is.
5. Drop "capitals". Early levels use the most familiar cities.
6. Keep the 8/10 pass bar and the 2 next-level preview questions as they are.
7. The hardest level stops at the ~1,000 cities already in the data.

## v1 scope and acceptance
**In scope:** a build script that fetches Wikidata sitelink counts once and bakes them into the city data, all ~1,000 cities in a compact data file, a trickiness measure in km, and one level table in place of the current population and ratio switches. **Out of scope:** any change to the UI flow or the level names, persisting the level, and new cities beyond the ~1,000.

Acceptance:
1. **Data.** The shipped data includes every city in `data/cities-import.sql` (~1,000), each with a sitelink count. The game makes no network calls for this at runtime; the counts are committed. The data file is no larger per city than today's.
2. **Credits.** Wikidata (CC0) is credited in `ATTRIBUTION.md` and in the in-app Credits.
3. **No capitals.** `is_capital` and the hand-written capitals list are gone. Level 1 uses only the most familiar cities.
4. **Two dials, km.** Each pair is scored by the gap on the asked axis and the gap on the other axis, in the same km the reveal shows. The asked axis is still the one with the smaller gap.
5. **Monotonic ladder.** Each level from 2 to 10 is at least as hard as the one before on both familiarity and trickiness, and strictly harder on at least one. A test enforces this from the level table.
6. **Ends of the ladder.** Level 1 uses famous cities with a clear gap on the asked axis. Level 10 draws from all ~1,000 cities and includes pairs close on the asked axis and far apart on the other.
7. **Enough pairs.** Every level has at least 200 valid pairs (a test checks this), and no pair appears twice in one quiz.
8. **Unchanged.** There are still 10 levels with the same names. 8/10 still unlocks the next level, and each quiz still has 8 current-level and 2 next-level preview questions (10 at level 10). The level resets each visit, and `PRIVACY.md` is unchanged.
9. `npm test` and `npm run lint` pass.
