# Chromoku Mark Picker

## What it is

An interactive browser tool for selecting and ranking the 16 marks used in Chromoku puzzles. Tabs for **Patterns**, **Shapes**, and **Colours**. Outputs a ranked list that maps directly to grid sizes (first 4 for 4×4, first 9 for 9×9, etc.).

**Artifact URL:** https://claude.ai/code/artifact/e2310ed1-2856-404d-8470-b76748e37cbd

Features:
- 35 patterns across 10 groups (Diagonal /, Diagonal \, Horizontal, Vertical, H+V Grid, Diag. Grid, Dots, Rings, Checker, Zigzag)
- 16 shapes (clip-path polygons, from the game's `SHAPES` array)
- 16 colours (Kelly's max-contrast palette, from the game's `HUES` array)
- In-game cell sizes in preview (4×4 at 70px, 6×6 at 50px, 9×9 at 38px, 16×16 at 24px)
- Drag-to-reorder ranked list
- Export outputs ranked list + per-grid-size breakdown

## How grid sizes use the marks

| Grid | Marks used |
|------|-----------|
| 4×4  | Ranks 1–4  |
| 6×6  | Ranks 1–6  |
| 9×9  | Ranks 1–9  |
| 10×10| Ranks 1–10 |
| 16×16| Ranks 1–16 |

So the order matters: most-distinctive marks go first, since they appear in every grid size.

## How to implement a new selection

After exporting from the picker, update the relevant array in `index.html`:

- **Patterns** → `const WEAVES = [...]`  
- **Shapes** → `const SHAPES = [...]`  
- **Colours** → `const HUES = [...]`

Each entry in WEAVES needs:
```js
{ label:"Name", glyph:"▨",
  bg:"repeating-linear-gradient(45deg,var(--ink) 0 1.5px,transparent 1.5px 10px)" }
```
Note: swap the hardcoded `#17172b` from the picker back to `var(--ink)` so it respects dark mode.

Background size is set globally via `const TILE = "12px 12px"`.

---

## Parking lot — future mark sets

### Special / Seasonal Palettes

These would use the same picker tool (Colours tab), with a custom HUES swap for a themed set:

| Name | Concept | Notes |
|------|---------|-------|
| **Christmas** | Red, green, gold, white, navy, silver | 6 colours for 6×6 seasonal puzzles |
| **Pride** | Rainbow: red, orange, yellow, green, blue, violet | Full 6-spectrum order |
| **Pastel** | Muted spring tones | Easier on the eyes, good for beginners |
| **High contrast** | Pure black/white/primary for colourblind accessibility | |
| **Flag** | A specific country's flag colours | Could be a daily "country of the day" theme |
| **Sports** | Team colours for a given league/event | Tie-in to sports events |
| **Halloween** | Orange, black, purple, lime green | |

### Themed Pattern Sets

| Name | Concept |
|------|---------|
| **Winter** | Snowflake-like cross-hatch and ring combos |
| **Botanical** | Organic curves — scallop, wave, petal shapes |
| **Retro** | High-contrast checkerboard + bold diagonal combos |
| **Minimal** | Single dots, single lines only — maximum legibility |

### How to build a themed set

1. Open the picker: https://claude.ai/code/artifact/e2310ed1-2856-404d-8470-b76748e37cbd
2. Go to the relevant tab (Colours / Patterns / Shapes)
3. Select and rank your themed 16
4. Export and paste into `index.html`
5. Gate it behind a level range or a daily calendar date in `levelConfig()`

### How to add a new tab/mark type to the picker

The picker is designed for extension. Each tab drives one array. To add e.g. "Emojis":

```js
// In picker.html:
const EMOJIS = [
  { id:'em0', label:'Star',  emoji:'⭐', type:'emoji' },
  { id:'em1', label:'Heart', emoji:'❤️', type:'emoji' },
  // ...
];
```

Add a tab button, handle the tab in `renderPicker()`, add a case to `applyMark()` and `makeCard()`.

---

## Picker maintenance

The picker lives in the Claude Code scratchpad and is published as an Artifact. To update it:
- Edit `picker.html` in scratchpad
- Re-publish to the same artifact URL
- No need to commit to the Chromoku repo — it's a dev tool, not game code
