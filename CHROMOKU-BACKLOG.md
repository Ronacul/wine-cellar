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

## Colour palette — needs rework for 16

Current HUES array has too many blues:

| # | Name | Hex | Family |
|---|---|---|---|
| 1 | Red | #e74c3c | Red |
| 2 | Blue | #3498db | **Blue** |
| 3 | Green | #27ae60 | Green |
| 4 | Yellow | #f1c40f | Yellow |
| 5 | Purple | #9b59b6 | Purple |
| 6 | Orange | #e67e22 | Orange |
| 7 | Cyan | #00b8d4 | **Blue** |
| 8 | Grey | #8d99ae | Neutral |
| 9 | Brown | #6d4c41 | Brown |
| 10 | Pink | #ec7ab5 | Pink |
| 11 | Lime | #a3c72e | Green-ish |
| 12 | Navy | #1f3a93 | **Blue** |
| 13 | Teal | #16a085 | **Blue-green** |
| 14 | Olive | #7d6608 | Yellow-brown |
| 15 | Maroon | #c0392b | Red-ish |
| 16 | Slate | #2c3e50 | Dark neutral |

**Problems:**
- 4 blues (Blue, Cyan, Navy, Teal) — too many, especially when faded
- 2 reds (Red, Maroon) — close together
- 2 greens (Green, Lime) — manageable but tight
- Olive and Brown are close
- Slate and Grey are close at small sizes

**Principles for a good 16:**
- Maximise perceptual distance (spread around the hue wheel)
- Each colour should be nameable in one word
- Must work on both light and dark backgrounds
- Must survive the completion fade (whatever treatment we pick)
- First 4 and first 9 should work great on their own (subsets matter)

**Draft replacement to evaluate:**
1. Red, 2. Blue, 3. Green, 4. Yellow, 5. Purple, 6. Orange,
7. Pink, 8. Brown, 9. Teal (shift greener, away from blue),
10. Lime, 11. Grey, 12. Coral/Salmon, 13. Indigo (distinct from blue),
14. Gold/Amber, 15. Magenta, 16. Slate/Charcoal

Needs visual testing on a real 16×16 board before committing.

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
