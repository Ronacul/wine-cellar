# Chromoku — Changelog

Format: `[vMAJOR.MINOR.PATCH] YYYY-MM-DD — short title`
Entries newest-first. Add a new entry on every push to `main` (playtest).
Move an entry from **Playtest** to **Released** when it merges to `release`.

---

## Playtest (on `main`, not yet released)

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

