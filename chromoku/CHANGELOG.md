# Chromoku — Changelog

Format: `[vMAJOR.MINOR.PATCH] YYYY-MM-DD — short title`
Entries newest-first. Add a new entry on every push to `main` (playtest).
Move an entry from **Playtest** to **Released** when it merges to `release`.

---

## Playtest (on `main`, not yet released)

### [v0.10.8] 2026-08-27 — Fit-one-screen pass: no scrolling on daily or win card

- **Root cause of the blank space:** `.play` had `justify-content:center` with `flex:1` — short content got centred, splitting the leftover height into dead bands above and below the stack. Now `flex-start`, and the `.play` gap drops from `clamp(10px,3.5vw,22px)` to `clamp(6px,1.8vw,12px)`.
- **Day chips — 4×2 grid:** `.day-nav` was a single `overflow-x:auto` flex row, so chips scrolled off. Now `grid-template-columns:repeat(4,1fr)` — all 8 chips visible in two rows, every chip the same width. "Today" gained a tier line so all cells are the same height.
- **Levels chip recoloured:** gold (`.lvl-chip`, `#c9a227`) instead of another grey day chip — it's a different destination, so it reads as one.
- **Board absorbs the reclaimed space:** `max-width:min(92vw,46vh,400px)` (was `min(84vw,340px)`) — the board grows into the freed height instead of leaving a gap. 328px → 359px on a 390×844 screen.
- **Admin view yields it back:** admin chrome adds ~100px, so `html.dev .board-wrap` caps at `34vh` and the admin bar is now one compact scrollable row (88px → 28px) instead of wrapping to three.
- **Win card no longer scrolls:** the share badge is capped by height (`max-height:30vh`), not just width — it was the tallest block at 340–358px. Modal padding 24px → 18px, stats margin 18px → 12px. Short screens get a further pass (badge 20vh, smaller win time) declared *after* the base rules so it actually wins the cascade.
- **Stale negative margins removed:** `.powerups` (`margin-top:-8px`) and `.tbarwrap` (`margin-top:-16px`) were compensating for the old 22px gap and had started over-pulling into the row above.
- **Verified:** 0px overflow on iPhone SE / 12 / 14 Pro Max / Pixel 7 / iPad Mini, in both player and admin views; win card fits without internal scroll on all of them, clean and hint-used states.

### [v0.10.7] 2026-08-26 — Level bar compact, admin controls tidy, day-nav to top, banner shorter

- **Level bar ~50% shorter:** `.lvl-l` is now `display:flex` so the ← ↶ ↻ buttons sit in a horizontal row instead of stacking vertically. Buttons shrink to 28×28 px. Right section uses `.lvl-r` (column-flex) — hearts sit above the countdown timer. Stage path preserved in `.lvl-c`.
- **Admin-only daily controls:** Size row (`#sizeRow`) and diff row (`#diffRow` — Latin/Double/Scramble/Levels) hidden by CSS for regular players; `html.dev` reveals them. `html.in-level` forces `#diffRow` visible so the level bar (which replaces `#diffs` inside it) still shows. `syncLvlToggle()` renamed to `syncAdminControls()`.
- **Day nav to top:** `#dayNav` moved above `.tiers` so the day chip strip is the first thing players see below the header. Admin-only **🏆 Levels** chip at the end of the strip (via `renderDailyNav()`); clicking it enters levels at the player's current level.
- **Banner shorter:** `.ad-banner` is now `width:100%` and `padding:12px 16px` (was 20px) — full-width, less tall, column layout kept.

### [v0.10.6] 2026-08-26 — Header cleanup, levels admin-only, win modal de-cluttered

- **💡 removed from header:** Lightbulb hint button gone — hints are in help (?) and the power-up bar below the board. `btnStats` (?) moved from left to right section so left is clean: logo · undo only.
- **Right header order:** timer · ? · ☆ · ↻ · ✕ · ⟳ (dev) · ⚙. `?` and `☆` are the visible "helper icons"; neither appears on the share canvas (correct — they're navigation aids, not solve data).
- **Levels → admin only:** `lvlToggle` button hidden for regular players; `syncLvlToggle()` helper keeps it in sync whenever admin mode is toggled. Levels remain fully functional for admins.
- **Levels win modal de-cluttered:** Level N heading, stars row, and theme·stage lede removed — the canvas badge already shows all of that (level, stars, theme, time). Modal now opens directly with the badge, stats row, and buttons.
- **Daily win modal:** Game info lede (Chromoku #N · size · diff) removed for same reason — badge shows it. Time stays large at the top as a quick reference.

### [v0.10.5] 2026-08-26 — Full-screen levels, stars on share tile, win banner, 15s add, bundle offer

- **Full-screen levels:** Header (logo, nav buttons) hides during active level play. The level bar takes over: ← Back, ↶ Undo, ↻ Reset now live in the level bar left section. Undo stays in sync (disabled when history is empty). Header restores on returning to daily.
- **Stars on share tile:** In levels mode the earned star rating (★★★) appears between the title and subtitle lines on the canvas badge — so the shared image shows your score without needing to annotate it.
- **Win banner:** A compact sponsored strip appears at the bottom of the win modal (both daily and levels). Natural break moment, non-intrusive, cycles through mock creatives.
- **Level add-time → 15s:** `LEVEL_ADD_SECS = 15`. Watching the quick ad in levels now gives 15s (was 30s — same as daily, felt too generous for shorter puzzles).
- **Premium bundle offer:** In the out-of-time modal, two ad tiers are shown side by side: ⏰ Watch 15s → +15s (N left), and 🎁 Watch 30s → +30s + 2 reveals. Bundle grants `BUNDLE_BONUS = 2` extra reveals via `state.bonusReveals`. Not aggressive — opt-in only at the natural fail-state moment.

### [v0.10.4] 2026-08-26 — Share tile redesign, 2-per-row win buttons, clock badge for time hints

- **Share tile — no swatches:** Removed the swatch-dot row from the canvas badge. The completed puzzle already shows every colour — the dots were redundant. Footer is now: `[gap] hint line (if any) [URL]`.
- **Share tile — symmetric spacing:** The gap between the subtitle and the board top now mirrors exactly below the board before the hint/URL block, giving the puzzle more visual breathing room.
- **Share tile — compact hint line:** Single mono line showing only the hint types actually used: `💡×N` (reveals), `⏱×N` (freeze/add-time), `🔦×N` (flash). Nothing shown for a clean solve.
- **Win modal — 2-per-row buttons:** Share / Copy text / ⚡ Challenge / Close arranged in a 2-column grid, roughly halving the modal height. Same layout in the levels win modal (Share / Next level / Replay / Done for now).
- **Win modal badge — clock icon for time hints:** Freeze and add-time hints now show ⏱️ in the modal badge instead of being lumped into 💡. Reveals show 💡, time hints show ⏱️, flash shows 🔦 — each type visually distinct.

### [v0.10.3] 2026-08-26 — Win modal compact, clean-win minimalism, 300×250 banner, day navigation

- **Win modal — stars inline (levels):** Stars moved next to the level title in a flex row instead of occupying their own full-height row. Saves ~40px of vertical space.
- **Clean win minimalism:** For a clean daily solve (no hints, no flash), the 🧠 badge icon is removed from the win modal entirely. The board canvas is the share — no annotation needed. Badge text is also removed from the canvas share for clean wins; swatch dots + URL remain.
- **Hint wins:** 💡 badge still shows in the modal; canvas still shows the hint count line. Flash-only (🔦) uses the same clean treatment as full clean.
- **Banner → 300×250 Medium Rectangle:** Replaced the 320×50 strip mockup with a 300×250 vertical rectangle — the format that earns 3–5× higher CPM on mobile. HTML + CSS updated.
- **Previous-days navigation strip:** Six day chips appear below the board in daily mode (Today highlighted + Mon–Sun going back 6 days, with tier label). Tapping any past chip loads that day's scheduled puzzle. Banner shows immediately for all past days.
- **Off-schedule banner trigger:** If a player changes the size or difficulty in daily mode away from today's scheduled config, the banner appears. Today's default puzzle stays clean.

### [v0.10.2] 2026-08-26 — Fix tutorial auto-flash bleeding, flash count in share, admin in About modal

- **Fix tutorial flash timer bleed:** Tutorial auto-hint interval was not cleared when entering daily mode — the timer kept calling `flashHint(false)`, which now runs in daily mode too (my v0.10.1 regression). Two-part fix: (1) `enterDaily()` now clears `_hintTimer` / `_hintInterval`; (2) auto-hint path in `flashHint()` guards against non-tutorial contexts.
- **Flash count in share:** `🔦×N` now appears in text share and canvas badge when flash hints were used. Flash is free (no star penalty) so it stays distinct from 💡 reveals. Win modal badge also shows `🔦×N` as a separate line below the main hint indicator.
- **Admin toggle in About modal:** Long-pressing the logo opens the About panel, which now has an Admin tools toggle at the bottom — much more discoverable than the buried Settings row. Toggling here also saves to localStorage correctly so OFF persists across reloads.

### [v0.10.1] 2026-08-26 — Fix game palette, admin off-persistence, flash hint in daily, tutorial UX

- **Game palette fix — no more Dark Olive:** HUES[7] was `#232c16` (near-black dark olive) — invisible on small cells, indistinguishable from Brown. Replaced with `#f6768e` (Purplish Pink), a clearly playable, highly distinct colour. The quilt logo uses its own `QUILT_PAL` and was unaffected.
- **Admin toggle persists OFF:** On playtest builds, admin defaulted ON every reload (playtest banner always present). Now an explicit "off" stored in localStorage survives reloads — long-press ⚙ or Settings toggle actually sticks.
- **Flash hint works in daily mode:** `flashHint()` was guarded by `if (!state.lvl) return` — but `state.lvl` is null in daily mode. Guard now only blocks levels mode with no loaded level. Flash counter and toast also appear in daily.
- **Share badge spacing:** Extra top margin between the difficulty subtitle and the canvas badge image in the win modal.
- **Tutorial entry toast:** A brief "📚 Tutorial · 7 levels · follow the flashing cells" toast fires when tutorial level 0 starts, so the player knows they've entered tutorial mode.
- **Tutorial intermediate button:** "Done for now" renamed to "Skip to daily puzzle" — clarifies where the button leads.

### [v0.10.0] 2026-08-26 — Advantages bar, context-aware banner, admin toggle, win badge

- **Advantages bar in daily mode:** Flash (🔦) and Reveal (💡) buttons now visible below the board during daily puzzles — no longer buried behind the 💡 modal. Counts shown inline.
- **Context-aware ad banner:** Banner now appears on: past dailies (any day before today), daily with 2+ real hints used, levels mode. Today's clean daily stays banner-free.
- **Hint 5+ interstitial:** Fifth real hint on daily triggers a 15-second soft overlay — puzzle state is preserved, timer pauses, skip unlocks after 15s. One-time per puzzle (`state.adShown`).
- **Win modal badge:** Clean solve shows 🧠 + "CLEAN SOLVE" in green; hints used shows 💡 (repeated, capped 3) + "N HINTS USED". More prominent than the old inline `💡×N` in the subtitle.
- **Admin long-press toggle:** Long-pressing ⚙ now toggles admin both on and off (was one-way on-only). Toast confirms state.

### [v0.9.9] 2026-08-26 — Share card: swatch dots, hint badge, game URL

- **Canvas badge footer:** Replaced bare "💡×N" text with a full footer section — a row of coloured swatch dots (one per mark), a hint badge (🧠 Solved clean or 💡💡💡), and the game URL at the bottom so recipients know where to play.
- **Text share (6×6 and smaller):** Now shows actual mark glyphs (`■ ● ▲ ◆ ★ ⬟`) instead of spoiler-free row-count emojis — far more interesting and gives a real preview of the puzzle. 9×9+ still uses row counts (too dense otherwise).
- **Hint badge in text share:** Title line now ends with 🧠 for a clean solve or 💡 (repeated, capped at 3) for hints used.
- **Game URL in text share:** `https://ronacul.github.io/wine-cellar/chromoku` appended so shareable text includes a link to play.

### [v0.9.8] 2026-08-26 — Fix palette swatch unevenness on 9×9 grid

- **Swatch sizing fix:** 9-mark palette was split 5+4 across two rows; `flex:1 1 0` made the 4-swatch row's swatches visibly wider than the 5-swatch row. Short rows are now padded with invisible `.swatch.spacer` elements so all rows divide the same width by the same count — uniform swatch sizes at every grid size.

### [v0.9.7] 2026-08-23 — Admin: → Next day button cycles through weekly schedule

- **Admin bar — "→ Next day" button:** Increments `state.day` by 1 and reloads the daily, so testers can walk Monday → Tuesday → … → Sunday → Monday without touching the date picker. The button's tooltip shows the date + day name + tier for the current day (e.g. *2026-08-23 · Sunday · Master*). `updateAdminBar()` keeps the tooltip in sync on every navigation.

### [v0.9.6] 2026-08-23 — Daily difficulty escalation: Mon (easiest) → Sun (hardest)

- **6×6 Sudoku added:** `s6` size with 2×3 boxes (`boxDims(6)` already handled this). Givens: Easy 20, Medium 15, Hard 11.
- **`DAILY_SCHEDULE[7]`:** One config per day of week. Each entry specifies `sizeId`, `diffId`, `dbl`, `latin`, `markSet`, `label`, and `tier`. Edit entries to tune without touching engine code.
  - Mon: 4×4 Hard (Compact)
  - Tue: 6×6 Easy — Shapes palette (Symbol)
  - Wed: 9×9 Easy (Grid)
  - Thu: 4×4 Hard Double (Double)
  - Fri: 6×6 Hard — Shapes palette (Symbol Hard)
  - Sat: 9×9 Hard (Expert)
  - Sun: 10×10 Latin Double (Master)
- **`dailyConfig()`:** Derives day-of-week from EPOCH + `state.day`, returns the schedule entry.
- **`enterDaily()`:** Now loads the day's scheduled config (size, diff, ruleset, mark set) instead of the player's last-used settings. Everyone plays the same board.
- **Sub-header:** Daily mode now shows *"Monday · Compact · #42"* instead of the raw size/diff labels.

### [v0.9.5] 2026-08-23 — Fix admin bar visibility; move level timer out of header

- **Fix A — Admin bar now visible:** Removed `display:none` from the admin bar's inline style (it was overriding the `.dev-only` CSS rule) and added an explicit `html.dev #adminBar{display:flex}` rule. The green 🛠 ADMIN strip now appears correctly in playtest builds.
- **Fix B — Timer moved to level bar:** In level mode the countdown timer now lives inside the level bar (right side, next to hearts) instead of the main header. This frees the header's right column in landscape orientation, so the ⚙ settings button is no longer clipped off-screen. The header timer is hidden while in level mode; it reappears in daily/practice mode. `pauseTimer()` and `resumeTimer()` also update the level-bar timer's frozen state.

### [v0.9.4] 2026-08-23 — Admin bar always visible on playtest build

- **Admin bar:** A green 🛠 ADMIN strip now appears between the header and the game board whenever admin mode is active (i.e. always on playtest). Controls directly on screen: level jump input + Go, date input + Today, Reset progress, Daily. No more hunting in Settings.

### [v0.9.3] 2026-08-23 — Fix admin always-on in playtest, fix level reset board

- **Fix A — Admin always visible in playtest:** `adminMode` now defaults to `true` when the playtest banner is present. No more hunting for the toggle or long-pressing ⚙ during playtesting.
- **Fix B — Level reset shows correct puzzle:** `resetPuzzle()` in level mode now calls `loadLevel()` to rebuild from the level's seed rather than manually clearing moves. This fixes a state-consistency bug where the board could render the wrong puzzle after reset. Power-up counts (hints used) are preserved across the reset — they are not refilled.
- **Fix C — Add-time modal text:** The "Watch to earn +Ns" line in the ad countdown modal now uses the `ADD_SECS` constant (30) instead of the old hardcoded "+15s".

### [v0.9.2] 2026-08-23 — Fix add-time, reset-in-levels, admin discoverability

- **Fix A — Admin panel discoverability:** Admin tools toggle moved to the top of the Settings modal. Long-press description added to the toggle row. `pointercancel` event now handled so iOS long-press doesn't silently fail. Level jump input now shows the current level when in level mode.
- **Fix B — Add time cost warning:** "Add time" button in the Out of Time modal now reads "Watch ad for +30s (N left)" so the limited-use cost is clear before tapping.
- **Fix C — Add time actually works:** `showAddTimeModal` now uses the `ADD_SECS = 30` constant (was hardcoded 15). After the countdown, `state.done` is reset to `false` and "won" CSS classes are stripped before `resumeTimer()` — previously the puzzle stayed locked because `failLevel()` sets `done = true` and `resumeTimer()` early-returns when `done` is true.
- **Fix D — Reset in levels:** `resetPuzzle()` now (1) costs 1 life with a preview in the confirmation dialog, (2) clears `state.done / elapsed / since / started / frozenUntil` so the board is actually playable after reset, (3) strips leftover "done/won" CSS, and (4) refreshes the heart display in the level bar.

### [v0.9.1] 2026-08-23 — Bug fixes: admin reset, admin access, logo crop

- **Fix A — Admin Reset confusion:** The "Reset" button in the admin panel (Settings → Admin tools) now shows a confirmation dialog before clearing progress. After clearing, it reloads the same level you were on rather than jumping to level 1.
- **Fix B — Admin mode shortcut restored:** Long-press (800 ms) the ⚙ settings button to enable admin mode directly. New sessions no longer lose admin access when localStorage is cleared.
- **Fix C — 4×4 logo in-game header:** The header logo now shows the top-left 4×4 corner of the quilt pattern (crisper at 40 px). Help and About pages still show the full 10×10 quilt.
- **Housekeeping:** `CHROMOKU_VERSION` constant added; version displayed in About modal.

---

## Released (on `release`)

### [v0.9.0] 2026-08-22 — Initial playtest branch

Branching convention established. `main` = playtest (banner), `release` = approved builds (no banner).

