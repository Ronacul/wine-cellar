# Chromoku — daily colour-logic puzzle

A single-file PWA puzzle game. Lives in `chromoku/index.html` — no build step,
no dependencies, no backend. Deployable package in `chromoku/` with manifest,
service worker, icons. Installable, works offline.

**Not yet in its own repo.** `wine-cellar` is public. Package is ready; creating
the private repo needs account-level permission.

## The game

Fill a grid so no mark repeats in any row, column or box. Marks are colours,
shapes or patterns — the rule never mentions numbers.

Three axes, all independent and composable:

| Axis | Values |
|---|---|
| **Size** | 4×4 (Easy/Medium/Hard by given count), 9×9, 16×16 |
| **Layers** | Single, or Double — a second puzzle on the inner squares |
| **Ruleset** | Sudoku (with boxes), or Latin (rows and columns only) |

Latin unlocks 5×5 and 7×7. Each combination is its own daily puzzle, own seed
and own record slot.

## Feature inventory

| Feature | Status |
|---|---|
| Core puzzle engine (4–16×16, Latin, Double) | ✅ |
| 500-level progression across 5 worlds | ✅ |
| Three mark sets (colour, shapes, patterns) | ✅ |
| Daily puzzles (seeded from date) | ✅ |
| Lives system (5 lives, 20-min regen, timer fail) | ✅ |
| Hints (reveal, freeze, add time, star penalty) | ✅ |
| Share badge (canvas image, Web Share API) | ✅ |
| Difficulty rater (T0–T3 with naked/hidden pairs) | ✅ |
| Per-technique timing model | ✅ |
| Undo, bookmark, crash recovery | ✅ |
| Fade completed units (rows/columns/boxes) | ✅ |
| Rounded-marks toggle (sharp vs round guesses) | ✅ |
| Settings toggles (fade, rounded, theme, marks) | ✅ |
| Win screen with share badge + share button | ✅ |
| Streak in share badge | ✅ |
| PWA packaging (offline, installable) | ✅ |
| Accessibility (patterns, shapes, no colour-only) | ✅ |
| Deployment (Cloudflare Pages, custom domain) | 🔲 ready, not wired |
| Own repo (private) | 🔲 needs account permission |
| Accounts / backend | 🔲 not started |
| Monetisation | 🔲 not started |
| Analytics | 🔲 not started |

## Architecture

`<style>` → minimal `<body>` → `<script>`, in that order. Rendering is template
strings into `innerHTML`, then bind listeners.

- **Daily puzzles** are seeded from the date: `day*1000 + latin*500 + tier*2 + double`.
  Epoch 15 Aug 2026 = puzzle #1. Day is captured at init, so a session spanning
  midnight stays on the day it started.
- **Marks** are built by set, sized to the grid (`MARKSETS[id].build(n)`).
  A set returns `null` when it cannot produce `n` marks and the picker hides it.
- **State** is per-layer: `state.layers[] = {grid, solution, givens}`.
- **All placements** route through `placeColour()`, and `state.mistakes` counts
  rule violations — the single attach point for any future lives or ad gate.
- **localStorage**, versioned keys: `chromoku.daily.v2`, `.stats.v1`,
  `.palette.v1`, `.theme.v1`, `.double.v1`, `.latin.v1`, `.last-diff.v1`,
  `.debug-day.v1`, `.seen-help.v1`, `.progress.v1`, `.fade-done.v1`,
  `.round-marks.v1`.

Dev affordances shipped and **not meant for players**: the ⟳ practice
re-roll and the debug date field in Settings. Gated behind `?dev=1`.

## Key subsystems

### Completion fade

After each placement, every unit (row, column, box) is checked per layer. Cells
belonging to a fully-filled, conflict-free unit get a CSS class that dims their
marks to 32% opacity. In Double mode, outer (layer 0) and inner (layer 1) fade
independently — a row can be complete on the outer fill while the inner dot is
still bright, so the player always sees what still needs work.

The fade resets on undo, erase, and bookmark restore. On win, all cells light
back up for the victory animation. Controlled by the **Fade completed** toggle
in Settings (default: on). Stored in `chromoku.fade-done.v1`.

### Rounded marks toggle

By default, player guesses have visibly rounded corners while givens are
near-square — that's the visual cue telling them apart. The **Rounded marks**
toggle (Settings, default: on) lets the player switch to sharp corners on
guesses too, making all marks uniform. The setting also applies to the share
badge canvas, so the shared image matches what the player sees.

Class `board.sharp` applies `border-radius:2px` to `.cell:not(.given) .fill`
and `border-radius:0` to `.cell:not(.given) .dot`. Stored in
`chromoku.round-marks.v1`.

### Share badge

Canvas-rendered image of the solved board. Supports Double mode (inner dots),
streak count for daily puzzles, hint count disclosure. Uses Web Share API →
clipboard → text fallback chain.

Badge respects the rounded-marks setting: given fills always use `radius:1`,
guess fills use `radius:6` when rounded, `radius:1` when sharp. Same for
inner dots: `radius:4` vs `radius:0`.

Shown in the win modal for both daily and level modes, with a **Share badge**
button. Level win also shows stars, time vs par, and lives count.

### Hints system

Three types, each with per-puzzle limits:
- **Reveal** (💡×3): fills one empty cell with the correct value, gold glow
- **Freeze clock** (❄️×2): pauses timer for 15 seconds, blue timer display
- **Add time** (⏰×2): adds 30 seconds to the countdown (levels only)

Each hint used reduces the maximum star rating by one. Three hints = capped at
one star. Available in both daily and level modes (freeze/add time only in
levels since daily has no timer pressure).

### Difficulty rater

Grades a puzzle by the cheapest technique that cracks it:
- T0: naked singles — a cell with one candidate left
- T1: hidden singles — a value with only one home in a unit
- T2: naked pairs, hidden pairs, locked candidates (boxes only)
- T3: needs guessing

Naked and hidden pairs work on rows and columns alone, so Latin puzzles properly
rate above T1.

### Progression (500 levels)

Five worlds: Sunrise (1–100), Tide (101–200), Lattice (201–300),
Echo (301–400), Prism (401–500). Each world introduces new mechanics. Step 5 of
every stage is a peek (gentle preview of next world), step 10 is a boss.

Lives system: 5 lives, one regained every 20 minutes. Timer expiry costs a
life. Zero lives = wait for regen.

Stars reward beating par: ≤ par = 3★, ≤ par×1.4 = 2★, else 1★, minus hints.

### Win screen

Both daily and level wins show:
- Solved confirmation with puzzle details
- **Canvas share badge** rendered inline
- Stats (streak/solved/best for daily; time/par/lives for levels)
- **Share badge** button (Web Share API → clipboard → text fallback)
- Level mode adds stars display and Next/Replay buttons

## Settings

| Setting | Key | Default | Notes |
|---|---|---|---|
| Mark set | `palette.v1` | Colour | Colour, Shapes, Patterns |
| Theme | `theme.v1` | Auto | Auto, Light, Dark |
| Fade completed | `fade-done.v1` | On | Dim completed rows/cols/boxes |
| Rounded marks | `round-marks.v1` | On | Rounded corners on guesses |

## Conventions

Canadian spelling throughout — colour, grey, centre — in copy, comments,
identifiers and commit messages. CSS keywords (`color`, `background-color`,
`prefers-color-scheme`) are language syntax and stay as they are.

Verify in a real browser, not by reading the diff. Every layout bug in this
project's history was found by screenshotting and none by reading the code.

## Open

- **Monetisation and progression** — see `CHROMOKU-PLAN.md` for strategy.
- Move to its own repo before launch.

---

## Reference: technical details

<details>
<summary>Puzzle generation and solver internals</summary>

### Generation

**Shuffling one grid does not reach the whole space.** Permuting rows, columns
and symbols of a canonical grid reaches 96 of the 288 valid 4×4 grids — one of
three orbits. Randomised backtracking on an empty board reaches all 288, is
faster, and is less code.

**Carve down, don't carve out.** Removing cells from a solved board and keeping
each removal that preserves uniqueness beats picking random givens and retrying.
9×9 at 25 givens: ~7.6s → ~4ms.

**The solver is the bottleneck at scale.** Bitmask candidates plus
most-constrained-cell branching, short-circuiting at two solutions.

**Uniqueness is not optional.** Every generated puzzle is verified to have
exactly one solution.

### Minimum givens for a unique solve

| Size | With boxes | Latin (no boxes) |
|---|---|---|
| 4×4 | 4.3 | 5.0 |
| 5×5 | — | 8.0 |
| 7×7 | — | 17.5 |
| 9×9 | 24.2 | 32.8 |
| 10×10 | 32.3 | 41.6 |
| 12×12 | 47.7 | 63.6 |

### Generation cost

16×16 at 140 givens is ~190ms; at 110 it is ~52s. 12×12 Latin is ~465ms
against ~15ms for 10×10. Both are held at the safe side of their cliff.

16×16 is a desktop tier — cells land around 20px on a phone, below the 44px
tap-target minimum.

### Timing model

Per-technique seconds-per-cell: T0 0.80s, T1 1.40s, T2 2.20s, T3 3.00s, plus
0.04s/cell/n for size. Generosity decays from 2.6× at level 1 toward a 1.25×
floor, with sawtooth relief at stage boundaries.

### Progression curve stats (levels 1–500)

| World | Levels | Mean par | Peak (p90) |
|---|---|---|---|
| Sunrise | 1–100 | 34s | 67s |
| Tide | 101–200 | 73s | 87s |
| Lattice | 201–300 | 73s | 107s |
| Echo | 301–400 | 98s | 152s |
| Prism | 401–500 | 156s | 203s |

Par trends up at 0.27s/level; every level of all 500 is uniquely solvable and
logic-solvable (only 1 of 500 needs guessing after seed retries).

</details>

<details>
<summary>Design decisions and findings</summary>

- **Conflicts are advisory.** An illegal placement lands and shakes. No fail
  state from wrong guesses — the timer is the only way to lose.
- **Givens vs guesses**: corner shape is the cue. Givens are near-square,
  guesses are rounded (configurable via toggle).
- **Inner layer is a square inside a square**, always colour. Patterns turn to
  mush at a third of a cell's width.
- **Box gaps must be 3× the gaps inside a box** or the boxes vanish.
- **Marks must vary along one dimension.** Crossing colour with shape costs more
  to read than to solve. Colour tops out at ~9 distinct hues; Shapes is
  strongest at 9×9+.
- **Patterns are the accessibility answer**, not cosmetic. Colour-only boards are
  unplayable with red-green deficiency (~8% of men).
- **Orthogonal (Graeco-Latin) layering was rejected** — no pair exists at 6×6
  (Euler's 36 officers), and the density makes it a deduction exercise.

</details>

<details>
<summary>Distribution and revenue notes</summary>

See `CHROMOKU-PLAN.md` for the full strategy. Key points:

- **Private GitHub repos are free** — Cloudflare Pages deploys from private repos
  for nothing on a faster CDN than GitHub Pages.
- **Web first for growth** (URL sharing, zero friction), native app wrapper later
  for rewarded video revenue (5–10× the web rate).
- **Sell helpers, not lives** — hints, reveal, freeze, add time. They help a
  player *win* rather than merely *continue*.
- **The sequence keeps every door open**: PWA now → accounts + backend if
  retention holds → app store wrappers (TWA/Capacitor) if traction.

</details>
