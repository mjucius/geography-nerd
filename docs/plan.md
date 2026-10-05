# Plan: Geography Nerd visual refresh

Source: `docs/product/brief.md` (approved). Two milestones, shipped in order. Each is usable alone. Prod deploys are manual.

## Stack (unchanged, no new services)
React 19 + Vite + Tailwind v4 + react-leaflet, tests with vitest + Testing Library (`npm test`). Only new dependencies: `@fontsource-variable/inter` and `@fontsource-variable/fraunces`, which Vite bundles so fonts are self-hosted with no CDN request. No API keys, accounts or services for the CEO to supply.

**Basemap: OpenStreetMap standard tiles** (`https://tile.openstreetmap.org/{z}/{x}/{y}.png`). Raster, so it drops into the existing Leaflet `TileLayer`. No key, no cookies, no tracking, and the tile usage policy (https://operations.osmfoundation.org/policies/tiles/) permits light use with visible attribution, which fits a low-traffic hobby site. Fallback if verification in T-001 fails: another keyless raster provider whose policy allows this use. T-001 re-verifies the policy and that real tiles load; the PR names the provider and policy link. The warm "muted" look is done in M2 with a CSS filter on the tile pane, with no extra provider.

## Milestones
**M1. Map fix** (T-001). Live tiles, no key, attribution, About/README/ATTRIBUTION/PRIVACY updated to drop CARTO. Standalone, shippable first.

**M2. Modern atlas refresh** (T-002 to T-007), in build order:
1. T-002 Tokens, fonts, plain page background, delete `tailwind.config.js`.
2. T-003 Shell: header/nav, footer, About modal, Home (above the fold on mobile, labels removed).
3. T-004 Question card (single progress, scroll to top).
4. T-005 Reveal and MapView (palette pins and route, km+miles, Next-only button).
5. T-006 Results (compact rows, per-row map and distance on tap).
6. T-007 Hex-colour guard test, contrast, focus, tap targets, no horizontal scroll (320/390/768/1280).

Each of T-003 to T-006 moves its files off hardcoded hex onto the tokens, so the app is coherent after each ticket.

## M3. Follow-up fixes (T-008 to T-010, T-013)
No new dependencies, services or accounts. Brief items 16-22, east-west formula per the brief's Decisions. Build order:
1. **T-008 About modal a11y.** `AboutModal.tsx` already uses a native `<dialog>` + `showModal()` and `aria-labelledby`, which gives modal semantics, Tab containment and Escape natively, so no `role`/`aria-modal`. First reproduce in a real browser (headless Chrome via playwright-core, outside the repo) what actually fails: focus on open, Escape, focus return, Tab containment. Then fix only what fails. If the native dialog already handles focus-in or focus-return, add no app code for that part and no jsdom test; record the browser result in the ticket. Any focus code I do add (for example saving `document.activeElement` before `showModal()` and restoring it on `close`, or `autoFocus` on Close) gets a test that goes red when that code is removed. The `test-setup.ts` shim stays dumb (unchanged), so tests cannot pass on shim behaviour alone. Tab containment and real Escape are verified in the browser and noted in the ticket.
2. **T-009 East-west distance** in `web/src/services/distance.ts` only (both screens already call `getDistanceInfo`): `ew.km = |lonDiff wrapped| * 111.32 * cos(mean lat)`; `ns` and the direction labels unchanged. Export the wrap helper (`wrapLongitudeDiff`) for T-010. Also update any reveal/results component tests that assert km strings. Tests in `distance.test.ts`: equator 10 deg = ~1113 km, 60N pair 10 deg = ~557 km, Auckland/Honolulu (wrapped, with cos factor), plus existing cases updated.
3. **T-010 Date-line route** in `MapView.tsx`: draw city2 at `city1.longitude + wrapLongitudeDiff(city2 - city1)` (so |dlon| <= 180); use those positions for markers, polyline and bounds. Leaflet renders longitudes beyond 180 on the repeated world copy, so tiles and pins show. Pure helper `routePositions(city1, city2)` is exported and unit-tested (Auckland/Honolulu span < 180 deg, ordinary pair unchanged, east/west of the shifted point matches `getDistanceInfo`). Browser check at 390 on reveal and results for Auckland/Honolulu: both pins and whole line in the first view.
4. **T-013 Same longitude / same latitude** (brief 23-24). In `distance.ts`: `offset()` returns `same: degrees === 0` (exact 0 only, after the date-line wrap, so 180 and -180 count as the same longitude). New export `formatOffset(offset, sameLabel)` returns `sameLabel` when `same`, else `${direction} by ${formatDistance(offset)}`. `QuestionCard.tsx` and `ScoreScreen.tsx` replace their two `{direction} by {formatDistance(...)}` lines with `formatOffset(ns, 'Same latitude')` and `formatOffset(ew, 'Same longitude')`, so reveal and results agree. Tests: `distance.test.ts` (same longitude, same latitude, tiny non-zero gap such as 0.0001 deg keeps its direction and `same` false, a normal pair), plus one reveal and one results component test with a same-longitude pair showing "Same longitude" and no "by 0 km". Prove tests can fail on a copy: change `=== 0` to `< 1` and see the tiny-gap test go red; make components ignore formatOffset and see the component tests go red.

Testing: `npm test` foreground; each new test proven able to fail by breaking the code on a copy outside the repo (drop the cos factor, drop the shift, drop focus restore). Browser checks as in M2.

## Testing
- `npm test` (vitest, jsdom) in the foreground; read the exit status.
- Component tests per ticket for behaviour that changed (Next-only advance, progress shown once, scroll-to-top call, km+miles with no degrees, results rows collapsed/expand, About text and links).
- T-007 adds a test that fails if any hex colour appears in `web/src` outside the `@theme` block, and that `web/tailwind.config.js` is gone.
- Each new test is proven able to fail by breaking the code on a copy outside the repo.
- jsdom has no layout, so visuals (390x844 fold, no horizontal scroll, contrast, focus rings, 44px targets, real tiles with no watermark) are checked by running the app in a browser at the four widths. I do that in the relevant ticket and note it in Review notes; qa re-checks per milestone.
- Quiz logic (`useQuiz`, `quizService`, scoring, levels) is not touched. Existing tests must keep passing (acceptance 15).

## Review notes

### plan review, round 1: changes
- Acceptance 6 (cards never nested more than one level) is only in T-003, but the three-deep nesting the brief describes is in the quiz screens. Add it to the acceptance of T-004, T-005 and T-006 (or to T-007 as a check across all screens).
- Nit, non-blocking: `web/index.html` still loads `leaflet.css` from unpkg. Since T-005 already drops the unpkg icon requests, importing `leaflet/dist/leaflet.css` there would remove the last third-party request apart from tiles.
- Nit, non-blocking: in T-001, use the plan's URL with no `{s}`/`{r}` (OSM asks clients not to use subdomains). Don't add `referrerpolicy=no-referrer` anywhere, because the OSM policy requires a Referer header.
- Otherwise approved. Milestone order matches the brief (map fix first, as its own ticket), acceptance 1-15 are all covered, nothing outside v1 was added, and the two @fontsource packages are justified by acceptance 5.

### plan review, round 2: approved
- All round 1 findings are fixed: the nesting acceptance is in T-004, T-005 and T-006 and checked across all screens in T-007, T-005 removes the unpkg leaflet.css link (MapView already imports it), and T-001 pins the OSM URL with no referrer policy.

### M3 plan review, round 1: changes
- T-008 test approach (blocking): if the `test-setup.ts` shim moves focus on `showModal()` and restores it on `close()`, the tests only exercise the shim and pass even if `AboutModal` has no focus code. Keep the shim dumb. If the browser repro shows the native dialog already does focus-in or focus-return, don't add app code for that part: record the browser result in the ticket and skip the jsdom test. For any focus code you do add to `AboutModal` (for example, saving `document.activeElement` and restoring it on `close`), write a test that goes red when that code is removed, with the shim not helping.
- T-009, T-010: approved. The formula and test cases match brief 20-21. Exporting `wrapLongitudeDiff` from `distance.ts` and reusing it in `routePositions` keeps the map and the text on one wrap rule (19). The east/west agreement test is the right one. Nit: when you update existing cases, check the component tests that assert reveal or results km strings, not only `distance.test.ts`.
- The order is fine: T-008 is independent, and T-010 depends on T-009's helper. 16-22 are all covered, and nothing outside the brief was added.

### M3 plan review, round 2: approved
- The T-008 finding is fixed: the shim stays unchanged, native behaviour is verified in the browser and recorded in the ticket, and any added focus code gets a test that goes red without it. The T-009 nit is picked up.
