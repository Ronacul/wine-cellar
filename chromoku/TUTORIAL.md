# Chromoku Tutorial — 7-Level Guided Onboarding

A carefully sequenced tutorial system that teaches the game mechanics through play, not explanation. Each level is **highly seeded** (80%+ filled) with interactive hints guiding the player's first moves.

## Design Philosophy

- **Learn by doing** — Players solve real puzzles, not abstract rules
- **Minimal text** — Visual hints (flashing cells/swatches) do the teaching
- **Progressive disclosure** — Each level introduces one concept
- **Homage** — The pattern is based on a quilt made by the developer's mother

## The 7 Levels

| Level | Grid | Mechanics | Concept | Givens | Notes |
|-------|------|-----------|---------|--------|-------|
| **0** | 4×4 | Classic | *"Tap a colour, tap a square"* | 12/16 (75%) | Intro: one empty row, guided placement |
| **1** | 4×4 | Classic | *"Every row uses all four"* | 11/16 (69%) | Fill a complete row; shows completion |
| **2** | 4×4 | Classic | *"Every column, too"* | 11/16 (69%) | Add column constraint; visual grid guides |
| **3** | 4×4 | Classic | *"Every 2×2 box"* | 10/16 (63%) | Add box constraint; 2×2 highlight |
| **4** | 4×4 | Shapes | *"Colours are just one option"* | 12/16 (75%) | Introduce shapes (squares, circles, etc.) |
| **5** | 4×4 | Double | *"Donut: the outer layer"* | Outer: 12/16, Inner: 14/16 | Double mode: solve the outer puzzle first |
| **6** | 4×4 | Double | *"Hole: the inner layer"* | Outer: 12/16, Inner: 12/16 | Double mode: both layers together |

After completing the tutorial, players unlock **Level 1** and the full progression system (500 levels).

## Interactive Hints

### Flash Guidance
When a player is stuck, the game automatically:
1. **Flash an empty cell** (0.5s blink, yellow border)
2. **Flash the matching swatch** (highlight + scale 1.1)
3. **Show which unit completes** (row/column/box fade for 1s after placement)

Flash triggers:
- On level load (show first move)
- After 3 seconds idle (show hint if cell is unplaced)
- On manual hint request (⏰ button shows hint immediately)

### Visual Cues

| Mechanic | Cue |
|----------|-----|
| **Row complete** | Row fades slightly; tone plays (optional) |
| **Column complete** | Column fades; same tone |
| **Box complete** | 2×2 box glows; same tone |
| **Double — outer done** | Donut swells; "Now the hole..." message |
| **Double — inner done** | Hole swells; "Puzzle complete!" message |

## Tutorial Flow

```
App Load
  ↓
Check: seen tutorial?
  ├─ No  → Show Level 0
  └─ Yes → Go to Daily/Levels
    ↓
Level 0: Interactive hints enabled
  ↓
Level 1: Hints remain but player leads
  ↓
Level 2-4: Same hint system
  ↓
Level 5-6: Double mode; hints guide inner/outer separation
  ↓
Tutorial Complete ✓
  ↓
Show: "Ready for the real thing!"
  ↓
Unlock Level 1 + Daily puzzles
```

## Implementation Details

### Storage
- `chromoku.tutorial.v1` — Tracks highest tutorial level completed (0-6 or "done")
- `chromoku.seen-tutorial.v1` — Boolean; skip intro if true

### Tutorial Levels Config
Special config added to `levelConfig()` to detect tutorial mode:
```javascript
if (level <= 6) {
  // Load tutorial config: highly seeded, no time limit
  cfg = TUTORIAL_CONFIGS[level];
  cfg.tutorial = true;
  cfg.noTimer = true;  // No clock; play at own pace
}
```

### Hint System
New function `showHint()` called via timer or button:
```javascript
function showHint() {
  const empty = findNextEmpty();  // First empty cell
  const suggestedColour = solveStep(empty);  // What goes there
  
  flashCell(empty);         // Yellow border pulse 0.5s
  flashSwatch(suggestedColour, 1.2);  // Swatch scale + highlight 1.2s
  
  // On placement: auto-fade completed row/col/box
}
```

### Tutorial-Only Features
- ✅ No timer (learn at own pace)
- ✅ Auto-hints every 3 seconds if stuck
- ✅ Completion messages per unit (row/col/box/layer)
- ✅ No mistake penalty (conflicts shake but don't count)
- ✅ "Skip tutorial" button (bottom-right, small)
- ✅ "Replay tutorial" in Help menu

## Future Enhancements

1. **Difficulty variants** — Easy/Medium/Hard tutorial tracks
2. **Replay tracking** — Count how many times tutorial was replayed
3. **Audio hints** — Tone on row complete (optional, can disable in settings)
4. **Gesture hints** — Animated hand showing tap sequence on very first move
5. **A/B testing** — Measure which hint frequency is most effective

## Mother's Quilt Tribute

The app logo and a future daily puzzle (Nov 8) are based on a quilt pattern created by the developer's mother. The nested-square design mirrors Chromoku's Double mechanic — two layers, one system. A living memorial to the art of puzzles and craft.

---

**Status:** Planned  
**Priority:** High (onboarding is critical for retention)  
**Effort:** Medium (7 levels × hint system + localStorage tracking)
