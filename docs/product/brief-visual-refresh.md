---
status: approved         # draft | approved (only team-lead sets approved)
---
# Geography Nerd: visual refresh

## Problem and who it's for
Geography Nerd is a 10-question direction quiz ("Is Tokyo north or south of Sydney?") that reveals a map after each answer. It's for casual players on phones and desktops who want a quick game with no accounts. The CEO says it is "not great to look at" and wants it cleaner and more modern.

**What it looks like today** (checked by running the app at 1280px and 390px):
- **Too much decoration, all competing.** There is a graph-paper grid behind every page, cream on cream cards nested three deep, near-black `font-black` text everywhere, and tracked uppercase pills that carry no meaning ("Atlas mode", "World direction challenge", "Sample route").
- **Repeated status.** The question card shows progress four times: "Question 1 of 10", "0%", "1/10" and a progress bar.
- **The map is broken in production.** The CARTO Voyager tiles now return an "API KEY REQUIRED" image, so every answer reveal and every "Show map" on the results screen shows watermarked blank tiles with default blue Leaflet pins. I confirmed this directly against the tile server, with and without the production referer. The map is the reward moment, so this is the biggest visual problem, and it is a bug, not a matter of taste.
- **Mobile layout.** On the home page a decorative mock-up card sits above the headline, which pushes "Start Quiz" below the fold. The quiz then opens still scrolled, with the top of the question card hidden under the sticky header.
- **The results screen is a wall.** It lists ten tinted cards, each with a dense distance box (degrees + km + mi, on two lines).
- **The logo** is a detailed raster cartoon badge. It looks out of place next to the flat UI at 44px.
- **No design system.** The code has 28 different hardcoded hex colours spread across the components. `tailwind.config.js` defines a `geo-*` palette, but Tailwind v4 never loads it and nothing uses it. Inter is named in the CSS but never loaded, so the app falls back to system fonts.

**Comparables.** Worldle, Globle and Travle are daily geo games with flat, bright, minimal UIs where the map or globe is the visual. NYT Games (Wordle, Connections) set the "clean modern game" bar: one typeface, lots of white space, one accent colour, no chrome. Seterra and GeoGuessr are busier and focused on the map.

## Baseline (in every option)
- Fix the basemap. Constraints: no API key committed to the public repo, no tracking (the README promises none), attribution stays visible, and the provider's usage policy must allow a low-traffic hobby site. Dev picks the provider and verifies it.
- Move colours, radii and fonts into Tailwind v4 `@theme` tokens in `index.css`. Delete the dead `tailwind.config.js`. Actually load the chosen font.
- Show progress once on the question card. Put "Start Quiz" above the fold on mobile. Start the quiz at the top of the page.
- Keep the repo link, MIT licence, Credits/About modal and map attribution visible in the UI.

## Options
### A. Clean slate: neutral, NYT Games-style minimalism
- **What it is:** a white or very light grey background, one accent colour (teal), Inter, flat cards with hairline borders and no nesting, and no grid paper or pills. Answer buttons become large, plain tap targets. The results screen becomes a compact list (✓/✕, the question, and the correct answer), with each map tucked behind a tap.
- **v1:** restyle all five screens (home, question, reveal, results, About), plus the baseline.
- **Trade-off:** this is the fastest route to "clean and modern" and the lowest risk. It loses most of the app's personality, and it can feel generic. The cartoon logo will clash even more.

### B. Modern atlas: keep the warm cartographic identity, remove the clutter
- **What it is:** it keeps the cream and teal palette and the "atlas" feel, but strips it back. The grid paper becomes a single subtle texture (or goes). It uses one surface colour instead of three, keeps a single level of cards, and pairs a display serif for headings (e.g. Fraunces) with Inter for body text. Map tiles and pins get a muted style that matches the palette, and the uppercase pills go.
- **v1:** the same screens as A, plus the baseline. Copy and layout stay mostly the same.
- **Trade-off:** it keeps the brand and the existing logo colours and changes the least about how the app feels, so it's the safest with existing players. It's less of a visible "new look", and it still depends on getting a warm palette right, which is where the current design went wrong.

### C. Map-first: the map is the stage
- **What it is:** a different layout. A full-width world map (unlabelled, with no pins before you answer, so it gives nothing away) sits behind the game. The question and the answer buttons sit in a card or bottom sheet over it. When you answer, the two cities drop in, a route line draws between them, and the map zooms to fit. The home page is the map with a single "Start" call to action.
- **v1:** a new question/reveal layout, a new home page and the baseline. The results screen gets a lighter restyle.
- **Trade-off:** this is the most "modern game" look and turns the map, which is the app's real asset, into the hero. It is the largest change and needs the most testing on small screens, it loads more map tiles per session (which matters for the tile provider's usage policy), and the reveal animation needs care on low-end phones.

## Recommendation
**B, with A's discipline.** Most of the problem is clutter and a broken map, not the palette. Removing the noise, setting up one token system and fixing the map will deliver "cleaner and more modern" without throwing away the identity. C is the most exciting, but it is a redesign rather than a refresh, and it is better done later on a clean, tokenised base. Separately, I suggest the basemap fix ships first as its own ticket, because it is a live production bug whichever option the CEO chooses. Prod deploys are manual, so merging the fix will not ship it on its own.

## Open questions
_None. All six answered on 2026-10-05; see Decisions._

## Decisions
- 2026-10-05 CEO: Direction is B, Modern atlas.
- 2026-10-05 CEO: The map tile fix ships first as its own ticket, ahead of the refresh.
- 2026-10-05 CEO: Keep the cartoon badge logo as is.
- 2026-10-05 CEO: No dark mode in v1.
- 2026-10-05 CEO: Copy keeps its playful voice, but labels that mean nothing (e.g. "Atlas mode") are removed.
- 2026-10-05 CEO: Distances show km + miles; degrees are dropped.
- 2026-10-05 CEO (via team-lead): Copy edits requested. The Home body becomes "Ten quick questions, no accounts. Trust your instinct." The how-to-play sentence is dropped because the Compare/Choose/Reveal tiles cover it, and the result still counts as the playful voice for acceptance 8.
- 2026-10-05 CEO: East–west distance is measured along the midpoint latitude: km = shortest longitude gap × 111.32 × cos(mean latitude).
- 2026-10-05 CEO: M3 follow-up scope (items 16-22) approved.
- 2026-10-05 CEO: When two cities share a longitude, the east-west line reads "Same longitude" instead of "West by 0 km".
- 2026-10-05 CEO: "Same longitude" applies only to an exact 0° gap; gaps that round to 0 km keep their direction. Two cities on the same latitude read "Same latitude" the same way (exact 0° only).

## v1 scope and acceptance
Two milestones, shipped in order. Prod deploys are manual, so each one is live only after a manual deploy.

### M1. Map fix (own ticket, ships first)
1. On the answer reveal and on every results-screen "Show map", the map shows real tiles. There is no "API KEY REQUIRED" watermark at any zoom level.
2. No API key or secret is committed to the repo. The tile provider adds no tracking or cookies, and its usage policy allows a low-traffic hobby site. Dev names the provider and the policy link in the PR.
3. Map attribution is visible on the map. The About/Credits modal names the new provider and drops CARTO if CARTO is no longer used.

### M2. Modern atlas refresh
**System**
4. Colours, radii and fonts are defined once as Tailwind v4 `@theme` tokens in `web/src/index.css`. Components use the tokens, with no hardcoded hex colours left in `web/src`. `web/tailwind.config.js` is deleted.
5. Two typefaces: a display serif for headings (Fraunces or similar) and Inter for everything else. Both are self-hosted, with no request to Google Fonts or any other font CDN.
6. One page background with no graph-paper grid. Cards are never nested more than one level deep.
7. No dark mode. The cartoon badge logo is unchanged.

**Screens**
8. Home: at 390x844 the headline and "Start Quiz" are visible without scrolling. Meaningless labels ("Atlas mode", "World direction challenge", "Sample route") are gone, and the playful voice in the headline and body copy stays.
9. Question card: progress appears once (a bar plus "3 of 10", or similar). The quiz always opens scrolled to the top, with the card fully visible below the header on mobile.
10. Answer reveal: the result, the distance and the map, with pins and a route line in palette colours. Distances show km and miles, with no degrees. Only the Next or Complete button moves on. Today a click anywhere in the panel does, which is easy to trigger by accident.
11. Results: the score summary, plus one compact row per question (✓/✕, the question, your answer and the correct answer if you missed it). The map and distance open per row on tap. All ten rows fit in about two mobile screens when collapsed.
12. About/Credits modal and footer are restyled. The repo link, MIT licence, Credits and Privacy links all stay visible and work.

**Quality**
13. No horizontal scroll at 320, 390, 768 or 1280px wide.
14. Text contrast is at least WCAG AA (4.5:1 for body text, 3:1 for large text). Every interactive element has a visible focus style, and tap targets are at least 44px.
15. Quiz behaviour is unchanged (questions, scoring, levels), and `npm test` passes.

### M3. Follow-up fixes
**About modal accessibility**
16. When the About/Credits modal opens, keyboard focus moves inside it. Escape closes it, and focus then returns to the Credits button.
17. Assistive technology identifies the modal as a modal dialog with the name "About Geography Nerd". The native `<dialog>` opened with `showModal()` already provides this, so redundant `role`/`aria-modal` attributes are not needed. While the modal is open, Tab cannot reach the page behind it.

**Route across the date line**
18. The route line takes the shorter way around, so for Auckland and Honolulu it crosses the Pacific over the date line rather than spanning the whole map. Both pins and the full line are visible in the first view, on the answer reveal and in the results-screen map.
19. The map, the answer key and the distance text all agree on which way is east or west. The answer key and the distance text already wrap at the date line, so this milestone does not change them.

**Latitude-aware east–west distance**
20. The east–west distance is measured along the parallel at the two cities' mean latitude: km = |Δlongitude, taken the short way| × 111.32 × cos(mean latitude). Examples: 10° apart on the equator is about 1,113 km, and 10° apart at 60°N is about 557 km. North–south distance does not change.
21. The answer reveal and the results screen show the same numbers, because both use `web/src/services/distance.ts`. Tests cover the equator, a high-latitude pair and a date-line pair.
22. Out of scope: question selection and difficulty tiers keep using raw degree differences, and no total straight-line distance is added.

**Same longitude or latitude**
23. When two cities have exactly the same longitude (a gap of 0° taken the short way), the east–west line reads "Same longitude", with no direction and no km or mi. When they have exactly the same latitude, the north–south line reads "Same latitude" in the same way. Neither reads "West by 0 km / 0 mi" or "South by 0 km / 0 mi" any more. This applies to the answer reveal and the results screen.
24. Only an exact 0° gap counts. A non-zero gap that rounds to 0 km keeps its direction (e.g. "East by 0 km / 0 mi"), and every other pair shows both lines as before. Tests cover a same-longitude pair, a same-latitude pair and a tiny non-zero gap.
