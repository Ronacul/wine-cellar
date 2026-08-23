# Chromoku — Changelog

Format: `[vMAJOR.MINOR.PATCH] YYYY-MM-DD — short title`
Entries newest-first. Add a new entry on every push to `main` (playtest).
Move an entry from **Playtest** to **Released** when it merges to `release`.

---

## Playtest (on `main`, not yet released)

### [v0.9.1] 2026-08-23 — Bug fixes: admin reset, admin access, logo crop

- **Fix A — Admin Reset confusion:** The "Reset" button in the admin panel (Settings → Admin tools) now shows a confirmation dialog before clearing progress. After clearing, it reloads the same level you were on rather than jumping to level 1.
- **Fix B — Admin mode shortcut restored:** Long-press (800 ms) the ⚙ settings button to enable admin mode directly. New sessions no longer lose admin access when localStorage is cleared.
- **Fix C — 4×4 logo in-game header:** The header logo now shows the top-left 4×4 corner of the quilt pattern (crisper at 40 px). Help and About pages still show the full 10×10 quilt.
- **Housekeeping:** `CHROMOKU_VERSION` constant added; version displayed in About modal.

---

## Released (on `release`)

### [v0.9.0] 2026-08-22 — Initial playtest branch

Branching convention established. `main` = playtest (banner), `release` = approved builds (no banner).

