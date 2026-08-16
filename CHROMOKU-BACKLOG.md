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
