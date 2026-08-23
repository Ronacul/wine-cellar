# Chromoku — Changelog

Format: `[vMAJOR.MINOR.PATCH] YYYY-MM-DD — short title`
Entries newest-first. Add a new entry on every push to `main` (playtest).
Move an entry from **Playtest** to **Released** when it merges to `release`.

---

## Playtest (on `main`, not yet released)

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

