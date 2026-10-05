2026-10-05T16:08:05Z team-lead -> pm: research visual refresh (cleaner, more modern style) and draft docs/product/brief.md
2026-10-05T16:12:37Z pm -> team-lead: brief draft ready (options A/B/C, recommend B; map tiles broken in prod)
2026-10-05T16:21:08Z team-lead -> pm: CEO decisions recorded in brief (B, map fix first, keep badge, no dark mode v1, keep voice/cut labels, km+miles); write v1 scope and acceptance
2026-10-05T16:21:38Z pm -> team-lead: v1 scope and acceptance written (M1 map fix, M2 refresh); no open questions; 6 PM-added items listed for CEO
2026-10-05T16:22:21Z team-lead -> dev: CEO approved docs/product/brief.md (v1 incl. pm additions); write docs/plan.md and tickets
2026-10-05T16:23:03Z dev -> reviewer: plan + tickets T-001..T-007 for review (round 1)
2026-10-05T16:23:12Z dev -> team-lead: plan + 7 tickets with reviewer (round 1), not yet approved
2026-10-05T16:23:34Z reviewer -> dev: plan review round 1: changes (card-nesting acceptance only in T-003; 2 nits)
2026-10-05T16:23:47Z dev -> reviewer: round 1 fixes in (nesting in T-004/5/6/7, unpkg css, OSM URL notes)
2026-10-05T16:23:54Z reviewer -> team-lead: plan review round 2: approved
2026-10-05T16:24:52Z team-lead -> dev: CEO go on plan; build ready tickets in order, M1 (T-001) then M2
2026-10-05T16:24:56Z dev -> team-lead: go received; waiting on reviewer round-2 approval before marking tickets ready
2026-10-05T16:25:19Z dev -> reviewer: T-001 plan for review (round 1)
2026-10-05T16:25:33Z reviewer -> dev: T-001 plan review round 1: approved (1 nit)
2026-10-05T16:26:15Z dev -> reviewer: T-001 code for review (round 1)
2026-10-05T16:26:38Z reviewer -> dev: T-001 code review round 1: approved (browser check still open for qa)
2026-10-05T16:26:41Z dev: T-001 done, committing (reviewer approved code round 1)
2026-10-05T16:26:46Z dev -> team-lead: M1 done (05a0e4b); browser check open; starting T-002
2026-10-05T16:26:53Z team-lead -> qa: QA M1 (T-001 map fix, 05a0e4b) incl. browser tile check
2026-10-05T16:27:13Z dev -> reviewer: T-002 plan for review (round 1)
2026-10-05T16:27:34Z reviewer -> dev: T-002 plan review round 1: approved (2 nits)
2026-10-05T16:28:34Z dev -> reviewer: T-002 code for review (round 1)
2026-10-05T16:29:02Z reviewer -> dev: T-002 code review round 1: approved (2 nits)
2026-10-05T16:29:12Z dev: T-002 done, committing (reviewer approved code round 1)
2026-10-05T16:29:36Z dev -> reviewer: T-002 committed (52fee18); T-003 plan for review (round 1)
2026-10-05T16:29:59Z reviewer -> dev: T-003 plan review round 1: changes (Privacy link not visible outside modal)
2026-10-05T16:30:03Z dev -> reviewer: T-003 plan round 2 (footer Privacy link added)
2026-10-05T16:30:10Z reviewer -> dev: T-003 plan review round 2: approved
2026-10-05T16:30:49Z dev -> reviewer: T-003 code for review (round 1)
2026-10-05T16:31:16Z reviewer -> dev: T-003 code review round 1: approved (1 nit; browser check open for qa)
2026-10-05T16:31:21Z dev: T-003 done, committing (reviewer approved code round 1)
2026-10-05T16:31:43Z dev -> reviewer: T-003 committed (1966958); T-004 plan for review (round 1)
2026-10-05T16:32:07Z reviewer -> dev: T-004 plan review round 1: approved (1 nit: Challenge label contrast)
2026-10-05T16:33:00Z dev -> reviewer: T-004 code for review (round 1)
2026-10-05T16:33:22Z reviewer -> dev: T-004 code review round 1: approved
2026-10-05T16:33:26Z dev: T-004 done, committing (reviewer approved code round 1)
2026-10-05T16:33:43Z qa -> team-lead: M1 QA done, browser check passed, no tickets filed (note: unpkg.com marker icons)
2026-10-05T16:33:48Z team-lead: M1 QA passed, no tickets; unpkg pins already covered by T-005
2026-10-05T16:33:52Z dev -> reviewer: T-004 committed (d9f04c3); T-005 plan for review (round 1)
2026-10-05T16:34:28Z reviewer -> dev: T-005 plan review round 1: changes (dateline wrap in distance helper)
2026-10-05T16:34:37Z dev -> reviewer: T-005 plan round 2 (dateline wrap in distance helper)
2026-10-05T16:34:47Z reviewer -> dev: T-005 plan review round 2: approved
2026-10-05T16:35:36Z dev -> reviewer: T-005 code for review (round 1)
2026-10-05T16:36:02Z reviewer -> dev: T-005 code review round 1: approved
2026-10-05T16:36:05Z dev: T-005 done, committing (reviewer approved code round 1)
2026-10-05T16:36:29Z dev -> reviewer: T-005 committed (113f6a9); T-006 plan for review (round 1)
2026-10-05T16:36:53Z reviewer -> dev: T-006 plan review round 1: approved (scroll-on-complete recommended)
2026-10-05T16:37:42Z dev -> reviewer: T-006 code for review (round 1)
2026-10-05T16:38:01Z reviewer -> dev: T-006 code review round 1: approved
2026-10-05T16:38:05Z dev: T-006 done, committing (reviewer approved code round 1)
2026-10-05T16:40:01Z dev -> reviewer: T-006 committed (006c925); T-007 plan for review (round 1)
2026-10-05T16:40:31Z reviewer -> dev: T-007 plan review round 1: approved (2 nits)
2026-10-05T16:44:06Z dev -> reviewer: T-007 code for review (round 1)
2026-10-05T16:44:33Z reviewer -> dev: T-007 code review round 1: approved (M2 code-complete)
2026-10-05T16:44:37Z dev: T-007 done, committing (reviewer approved code round 1)
2026-10-05T16:44:43Z dev -> team-lead: DONE, T-001..T-007 committed (72d039d last)
2026-10-05T16:44:48Z team-lead -> qa: QA M2 (T-002..T-007, 52fee18..72d039d)
2026-10-05T16:48:05Z qa -> team-lead: M2 QA done, all checked items pass, no tickets; note on About modal keyboard behaviour
2026-10-05T16:48:09Z team-lead: M2 QA passed, no tickets; visual refresh v1 complete (not deployed)
2026-10-05T16:57:24Z team-lead -> dev: CEO confirmed requesting copy edits; send to reviewer, then commit
2026-10-05T16:57:29Z dev -> reviewer: copy edits (README, web/README, index.html, Home, ScoreScreen) for review
2026-10-05T16:57:49Z reviewer -> dev: copy edit review: approved (README fact verified; Home body voice flagged as pm call)
2026-10-05T16:57:53Z dev -> pm: Home body copy voice check before committing copy edits
2026-10-05T16:57:59Z team-lead -> dev: Home copy line covered by CEO's request; commit copy edits (reviewer approved)
2026-10-05T16:58:03Z dev: copy edits committing (reviewer approved; team-lead says CEO asked for them incl. Home line)
2026-10-05T16:58:11Z pm -> dev: keep shortened Home body copy (covered by CEO copy-edit request via team-lead); recorded in Decisions
2026-10-05T16:58:16Z dev -> pm: ack, copy edits already committed (f5e42a5)
2026-10-05T16:58:21Z pm -> team-lead: ack; Home copy decision recorded in brief, nothing open from pm
2026-10-05T17:02:46Z dev -> reviewer: Dependabot PR #40 for review (checked in temp worktree: ci/test/lint/build pass); merge left to CEO
2026-10-05T17:03:21Z reviewer -> dev: PR #40 review: approved (bumps verified against local main f5e42a5: 54 tests, lint, build pass)
2026-10-05T17:03:27Z dev -> team-lead: PR #40 approved by reviewer; order: push main (CEO), @dependabot rebase, merge on green
2026-10-05T17:03:58Z team-lead -> dev: CEO go: push local main, then @dependabot rebase on #40, merge once CI green
2026-10-05T17:04:08Z dev -> team-lead: not pushing on a relayed approval; asked the user directly
2026-10-05T17:06:42Z dev: pushed main (user approved in chat); commented @dependabot rebase on #40
2026-10-05T17:10:13Z dev -> team-lead: PR #40 merged (7937255); post-merge CI running; local checkout not synced
2026-10-05T17:10:18Z team-lead -> dev: #40 merged (7937255); sync local main + npm install once CI green
2026-10-05T17:10:48Z dev -> team-lead: CI green on 7937255; local main synced, npm install, 54 tests pass
2026-10-05T17:11:25Z team-lead -> pm: CEO wants follow-up milestone: About modal a11y (focus, Escape, dialog role) + map accuracy (dateline route line, latitude-aware E-W km); add to brief
2026-10-05T17:12:06Z pm -> team-lead: M3 follow-up milestone added (items 16-22); one product question (E-W distance definition), recommendation included
2026-10-05T17:27:56Z team-lead -> dev: CEO approved M3 scope (brief items 16-22); plan M3 into docs/plan.md + tickets
2026-10-05T17:28:39Z dev -> reviewer: M3 plan + T-008..T-010 for review (round 1)
2026-10-05T17:28:48Z dev -> team-lead: M3 plan drafted (T-008..T-010), in review with reviewer
2026-10-05T17:29:03Z reviewer -> dev: M3 plan review round 1: changes (T-008 shim must not do the app's focus work)
2026-10-05T17:29:15Z dev -> reviewer: M3 plan revised (T-008 shim stays dumb), round 2
2026-10-05T17:29:23Z reviewer -> dev: M3 plan review round 2: approved
2026-10-05T17:29:27Z dev -> team-lead: M3 plan approved (round 2), T-008..T-010 ready, awaiting go
2026-10-05T17:32:20Z team-lead -> dev: CEO go for T-008 only; hold T-009 and T-010
2026-10-05T17:32:59Z dev -> reviewer: T-008 plan (native dialog already ok; one test only)
2026-10-05T17:33:08Z reviewer -> dev: T-008 plan review round 1: approved
2026-10-05T17:33:31Z dev -> reviewer: T-008 code-review (one regression test, tests green, break check done)
2026-10-05T17:33:40Z reviewer -> dev: T-008 code review round 1: approved
2026-10-05T17:33:44Z dev -> team-lead: T-008 approved and committed; holding T-009/T-010 per CEO
2026-10-05T17:33:52Z reviewer -> dev: correction: T-009/T-010 on hold per team-lead, do not start
2026-10-05T17:49:13Z team-lead -> dev: resumed after restart; T-008 done, T-009/T-010 at ready (on hold per CEO)
2026-10-05T17:49:27Z team-lead -> dev: CEO go for T-009 only; keep holding T-010
2026-10-05T17:49:45Z dev -> reviewer: T-009 plan for review
2026-10-05T17:49:54Z reviewer -> dev: T-009 plan approved (round 1), nit on speculative wrapLongitudeDiff export
2026-10-05T17:50:24Z dev -> reviewer: T-009 code for review
2026-10-05T17:50:36Z reviewer -> dev: T-009 code approved (round 1), two nits
2026-10-05T17:50:45Z dev -> team-lead: T-009 done, committed
2026-10-05T17:51:08Z team-lead -> qa: CEO wants QA now on M3 so far (T-008, T-009 at 2ffe442); T-010 stays on hold
2026-10-05T17:51:43Z qa -> team-lead: M3 QA at 2ffe442: filed T-011
2026-10-05T17:51:49Z team-lead -> dev: work QA ticket T-011 (East/West km component test); T-010 still on hold
2026-10-05T17:52:05Z dev -> reviewer: T-011 plan for review
2026-10-05T17:52:17Z reviewer -> dev: T-011 plan approved (round 1)
2026-10-05T17:52:35Z dev -> reviewer: T-011 code for review
2026-10-05T17:52:44Z reviewer -> dev: T-011 code approved (round 1), one nit
2026-10-05T17:52:54Z dev -> team-lead: T-011 done, committed
2026-10-05T17:52:57Z team-lead -> qa: re-run M3 QA (T-008, T-009, T-011) at bbe6b80; T-010 on hold
2026-10-05T17:53:47Z qa -> team-lead: M3 QA re-run at bbe6b80, no new tickets
2026-10-05T17:53:51Z qa -> team-lead: M3 QA re-run at bbe6b80 clean (T-008, T-009, T-011); T-010 on hold
2026-10-05T17:54:05Z team-lead -> dev: CEO says keep holding T-010; team stands down
2026-10-05T18:03:54Z team-lead -> dev: resumed after restart; T-010 at ready (on hold per CEO), M1-M3 otherwise done
2026-10-05T18:04:03Z team-lead -> dev: CEO go for T-010
2026-10-05T18:04:27Z dev -> reviewer: T-010 plan for review
2026-10-05T18:04:40Z reviewer -> dev: T-010 plan approved
2026-10-05T18:06:18Z dev -> reviewer: T-010 code for review
2026-10-05T18:06:30Z reviewer -> dev: T-010 code approved (round 1), one nit
2026-10-05T18:06:36Z dev: T-010 done, committing
