# Chromoku — Backlog / Parking Lot

Ideas, bugs and improvements to consider. Nothing here is planned — it's a
capture list for future sessions.

---

## Bugs / polish needed

### Completion fade visual problem
The opacity-based fade (32%) makes completed colours look like lighter versions
of *other* palette colours. A faded blue looks like a light blue, which could be
confused with cyan or grey. The effect doesn't read as "done" — it reads as
"different colour."

**Possible fixes:**
- Desaturation (CSS `filter: saturate(0.2)`) instead of opacity
- Grey-wash overlay (a semi-transparent grey layer on top)
- Subtle checkmark or pattern overlay on completed cells
- Border/outline treatment instead of colour change
- Combination: slight opacity + desaturation + a small ✓ badge

The toggle exists (Settings → Fade completed). The visual treatment needs work.

### Hint reveal animation too subtle
The current `.revealed` class gives a pale gold background
(`rgba(241,196,15,.18)`) which barely registers. The player needs to
immediately *see* which cell was the hint.

**Possible fixes:**
- Pulsing glow animation (scale up + bright ring, then settle)
- Brief spotlight effect (everything else dims momentarily)
- Ripple animation from the revealed cell outward
- The cell's mark animates in with a distinct entrance (bounce/sparkle)
- Persistent subtle glow for the rest of the puzzle (so the player can
  always find which cells were hints)

---

## Colour palette — slots 10–16 need refinement

Switched to Kelly's 22 Colours of Maximum Contrast (1965, NBS) — a
research-backed set designed so no two colours can be confused.

**First 9 (solid):**

| # | Name | Hex | Kelly name |
|---|---|---|---|
| 1 | Red | #c10020 | Vivid Red |
| 2 | Green | #007d34 | Vivid Green |
| 3 | Blue | #00538a | Strong Blue |
| 4 | Yellow | #f4c800 | Greenish Yellow |
| 5 | Orange | #ff6800 | Vivid Orange |
| 6 | Purple | #803e75 | Strong Purple |
| 7 | Ice | #a6bdd7 | Very Light Blue |
| 8 | Dark Olive | #232c16 | Dark Olive Green |
| 9 | Brown | #593315 | Deep Yellowish Brown |

**Slots 10–16 (need work):**

| # | Name | Hex | Problem |
|---|---|---|---|
| 10 | Gold | #ffb300 | Close to Yellow (#f4c800) |
| 11 | Sand | #cea262 | Close to Brown at small sizes |
| 12 | Stone | #817066 | Low contrast, hard to see on dark bg |
| 13 | Rose | #f6768e | OK but close to Salmon |
| 14 | Salmon | #ff7a5c | Close to Orange and Rose |
| 15 | Violet | #53377a | OK — distinct from Purple |
| 16 | Amber | #ff8e00 | Close to Orange |

**What to try next:**
- Replace some Kelly 10–16 with neon/vivid variants that contrast the muted 1–9
- Or cherry-pick from Tableau 10, which was designed for screen legibility
- Test on actual 16×16 boards at phone screen sizes
- Consider pairing with shapes at 16×16 to carry the disambiguation load

---

## Separate controllers for size and difficulty

Currently size and difficulty are coupled (Easy = 4×4, Medium = 4×4 fewer
givens, Hard = 9×9, etc.). The user wants independent axes:

- **Size picker**: 4×4, 5×5, 6×6, 7×7, 9×9, 10×10, 12×12, 16×16
- **Difficulty picker**: how many givens / what technique tier is required

This is a significant UI change — the current `diffs` bar becomes two bars or
a 2D selector. Needs design thought.

**Considerations:**
- Not every size × difficulty combination is valid or interesting
- The daily puzzle might still be a curated pick rather than user-chosen
- Level mode already handles this via the progression curve
- This mainly affects practice / free-play mode

---

## Larger boards: always colour background

For 9×9 and above, the outer layer (background fill) should always use colour
marks — shapes and patterns are too small to read at that cell size.

The inner layer (Double mode) can be shapes, colours, or potentially both
(shape + colour as redundant encoding).

This might mean the mark-set picker becomes per-layer or auto-selects based on
board size.

---

## Other ideas (unsorted)

- **Friends / group comparison** — share a link showing your solve alongside the
  viewer's for the same daily puzzle
- **Tutorial** — 3-step interactive walkthrough instead of the text-heavy help modal
- **Daily notification** — PWA push notification at a chosen time
- **Cosmetic unlocks** — board themes (dark cellar, ocean, sunset) as
  willingness-to-pay test
- **Sound effects** — placement click, conflict shake, win fanfare (with mute toggle)
- **Pencil marks / notes** — candidate-style annotations on cells for harder puzzles
- **Replay / ghost** — watch your solve play back, or race against your best time
- **Colourblind simulation** — preview how the board looks under different
  colour vision types (deuteranopia, protanopia, tritanopia)

---

## Session log — 2026-08-23

Changes shipped in this session, with notes on how they work and where
to push them further.

### 1. Palette swatches scale to board width ✅

**What changed:** Swatches now `flex:1` inside a palette container that
shares the board's sizing (`width:100%; max-width:min(86vw,360px)`,
bumped to `400px` at `≥520px`). They divide the row evenly instead of
using a fixed `clamp()` width.

**CSS:**
- `.palette` gets `align-items:stretch` + board-width constraints
- `.prow` fills the palette; swatches flex to divide it
- Double mode just tightens gaps (`clamp(3px,0.8vw,5px)`)
- Media query bumps `.palette{max-width:400px}` alongside `.board-wrap`

**Still to do:**
- Eraser (✕) swatch was too big at full flex — now removed entirely
  (see item 2). If it comes back, give it a smaller fixed size so it
  doesn't eat colour-swatch space.

### 2. Eraser swatch removed ✅

**What changed:** The ✕ swatch is gone from the palette. Tapping the
same colour on a cell already clears it, making the eraser redundant.

**Keyboard erase still works:** Backspace / Delete keys toggle
`state.erase` mode (bulk-clears all unlocked layers on a tapped cell).
The CSS for `.swatch.erase` and `.swatch.spacer` is still in the file
as dead code — can be cleaned up later.

**Parking lot idea:** If a visual erase mode indicator is ever needed
(e.g. for touch-only users who want multi-layer bulk erase), consider a
small icon in the toolbar area rather than a palette swatch.

### 3. 9×9 and 16×16 split into two swatch rows ✅

**What changed:** For `n > 4`, swatches split into 2 rows via JS
(`nRows = 2`). Each row fills the board width, so individual swatches
are ~2× bigger than the old single-row layout.

**Row splits:**
- 9×9: 5 + 4 (first row slightly wider swatches)
- 16×16: 8 + 8 (even split)
- 4×4: stays single row (4 swatches)
- Double mode: 1 row per layer regardless of size

**Still to do:**
- On uneven splits (5+4), the second row's swatches are slightly wider.
  Could cap with `max-width` matching the first row, but the user hasn't
  flagged this as a problem.

### 4. Scramble fidelity on share badges ✅

**What changed:** `renderShareBadge()` now applies the same Stroop
interference that was on screen:
- Classic colours + scramble: real colour clipped to a decoy shape
  (via `scrambleDecoy()` → `SHAPES[fakeIdx].clip`)
- Shapes + scramble: real shape filled with a decoy colour
  (via `scrambleDecoy()` → `HUES[fakeIdx].hex`)
- Patterns are unaffected (scramble doesn't apply to ink mode)

The badge subtitle also includes " · Scramble" when active.

**Uses existing functions:** `scrambleDecoy(i, v, n)` and
`drawClipPath(ctx, clip, x, y, sz)` — no new helpers needed.

### 5. Donut marks always show holes (prior commit, same session) ✅

**What changed:** `.board.dbl .fill` gets the mask (was
`.board.dbl .cell.has-dot .fill`), so donut holes are always visible
on Double boards — not just when an inner mark is placed. Inner marks
at `inset:26%` fit snugly inside the holes.

Swatch donuts use `mask-size:46% 46%` instead of `padding:22%` to
avoid CSS %-of-parent inflation in the prow.

### 6. Mechanic explainer pages (prior commit, same session) ✅

Modals shown the first time a new mechanic appears (Double, Latin,
Scramble, Rotated boxes). Tracked in localStorage
(`chromoku.seen-mech.v1`). Chained via `showExplainers(ids, next)`.

### 7. Quit button during puzzle (prior commit, same session) ✅

Close/quit button appears after the first cell is placed (tracks
`state.started`). Saves progress and returns to the daily screen.

### 8. Admin level jump (prior commit, same session) ✅

Persistent toggle in Settings to jump to any level number in Levels
mode.

---

## Further integration ideas

- **Palette row count could be configurable** — some players might
  prefer 3 rows of 3 for 9×9, or a grid layout for 16×16
- **Swatch shapes on badges** — the badge already handles shapes and
  scramble; could add shape outlines to non-scramble shape-mode badges
  for extra fidelity
- **Deselect on second tap** — currently tapping a selected swatch
  deselects it (sets `state.sel = null`). With no eraser, this is the
  only way to "put down" a colour without placing it. Works fine, but
  could add a brief toast: "Tap a cell to place, or tap the colour
  again to deselect"
- **Eraser as toolbar icon** — if the multi-layer bulk-erase workflow
  is missed, a small eraser icon in the header bar (next to quit)
  would be less intrusive than a full swatch
