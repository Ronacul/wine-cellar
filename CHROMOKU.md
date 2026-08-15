# Chromoku — daily colour-logic puzzle

Working title. Lives in `game.html`, a single self-contained page with no build
step, no dependencies and no backend — same architecture as the wine app.

**Not yet moved to its own repo.** `wine-cellar` is public, so this source is
public. Fine for an unknown prototype; do it before the game gets a name, a
domain or an audience.

## The game

Fill a grid so no mark repeats in any row, column or box. Marks are colours,
shapes or patterns — the rule never mentions numbers, which is the whole point.

Three axes, all independent and all composable:

| Axis | Values |
|---|---|
| **Size** | 4×4 (Easy/Medium/Hard by given count), 9×9, 16×16 |
| **Layers** | Single, or Double — a second, unrelated puzzle on the inner squares |
| **Ruleset** | Sudoku (with boxes), or Latin (rows and columns only) |

Latin unlocks 5×5 and 7×7. Each combination is its own daily puzzle, own seed
and own record slot.

## Architecture

`<style>` → minimal `<body>` → `<script>`, in that order. Rendering is template
strings into `innerHTML`, then bind listeners — the repo's existing pattern.

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
  `.debug-day.v1`, `.seen-help.v1`.

Dev affordances currently shipped and **not meant for players**: the ⟳ practice
re-roll and the debug date field in Settings.

## Findings worth not rediscovering

**Shuffling one grid does not reach the whole space.** Permuting rows, columns
and symbols of a canonical grid looks like it explores everything. It reaches
96 of the 288 valid 4×4 grids — one of three orbits. Randomised backtracking on
an empty board reaches all 288, is faster, and is less code. This tripled daily
puzzle variety and was invisible without measuring.

**Carve down, don't carve out.** Generating by removing cells from a solved
board and keeping each removal that preserves uniqueness beats picking random
givens and retrying. 9×9 at 25 givens: ~7.6s → ~4ms.

**The solver is the bottleneck at scale.** Bitmask candidates plus
most-constrained-cell branching, short-circuiting at two solutions. Without it
nothing above 9×9 is viable.

**Uniqueness is not optional.** An ambiguous puzzle is an unwinnable puzzle.
Every generated puzzle is verified to have exactly one solution before serving.

**Measured minimum givens for a unique solve:**

| Size | With boxes | Latin (no boxes) |
|---|---|---|
| 4×4 | 4.3 | 5.0 |
| 5×5 | — (cannot box) | 8.0 |
| 7×7 | — (cannot box) | 17.5 |
| 9×9 | 24.2 | 32.8 |
| 10×10 | 32.3 (5×2) | 41.6 |
| 12×12 | 47.7 (4×3) | 63.6 |

Shipped counts sit a little above these; minimum-clue puzzles are solvable but
unpleasant.

**Sudoku requires the size to factorise.** 5, 7, 11, 13 can never be Sudoku.
Dropping the box rule costs ~30% more givens but makes every size legal — that,
not the missing rule, is why Latin earns its place.

**Generation cost climbs a cliff.** 16×16 at 140 givens is ~190ms; at 110 it is
~52s. 12×12 Latin is ~465ms against ~15ms for 10×10. Both are held at the safe
side of their cliff.

**16×16 is a desktop tier.** Cells land around 20px on a phone, below the 44px
tap-target minimum. It generates fine and is unplayable on mobile. 16×16 Double
(512 marks) is worse — kept only as proof the axes are orthogonal.

**Marks must vary along one dimension.** Crossing colour with shape gives more
marks but a board holding a red triangle, a blue triangle and a red circle costs
more to read than to solve. Colour tops out at ~9 genuinely distinct hues;
Shapes is the strongest set at 9×9 and the right answer at 16×16.

**Patterns are the accessibility answer**, not a cosmetic. A colour-only board
is unplayable with red-green colour deficiency (~8% of men). Monochrome pattern
and shape sets depend on no colour discrimination. Keep them free.

**Orthogonal (Graeco-Latin) layering was considered and rejected.** Coupling the
layers so every mark pair is unique makes the puzzle far denser — unique from ~6
marks of 32 rather than ~12 — but turns Double into a deduction exercise instead
of the visual one intended. Also: **no orthogonal pair exists at 6×6** (Euler's
36 officers, proven by Tarry 1901), so a 4→6→9 ladder would break. 9×9 pairs do
exist but need construction; random search will not find them.

## Design decisions

- **Conflicts are advisory.** An illegal placement lands and shakes. The game
  has no fail state — worth remembering before designing anything around lives.
- **Givens are bolder than your own marks**: flush to the cell edge versus inset,
  and larger versus smaller on the inner layer. One rule, learned once.
- **The inner layer is a square inside a square** and always uses colour —
  patterns turn to mush at a third of a cell's width. Varying inner shape is
  held back as a reward lever.
- **The solved view is one nested grid**, not a stack of separate grids.
- Box gaps must be roughly 3× the gaps inside a box or the boxes vanish. This
  was missed twice: once at 4×4, again at 9×9.

## Progression (phase 1 — engine only, no level UI yet)

Levels sit alongside the daily, which is unchanged. A level's configuration is a
pure function of its number, so level N is identical for everyone and there is
no table to maintain.

**The rater** grades a puzzle by the cheapest technique that cracks it: T0 naked
singles, T1 hidden singles, T2 locked candidates (boxes only), T3 needs
guessing. This is the real difficulty signal — given count is a poor proxy, and
below 9×9 it measures nothing at all.

**Par time** is estimated from work — cells to fill × seconds per cell × a tier
factor — and the time limit is par × a generosity that decays from 2.6× at level
1 toward a 1.25× floor, with a small sawtooth so each stage opens kinder than it
ends. All of it lives in one `TUNE` block. **Those constants are guesses until
real play data exists.**

**Measured over levels 1–500** (`scratchpad/curve.js`):

| World | Levels | Unlock | Mean par | Peak (p90) |
|---|---|---|---|---|
| Sunrise | 1–100 | 4×4 up to 9×9 | 34s | 67s |
| Tide | 101–200 | 9×9, shape marks | 73s | 87s |
| Lattice | 201–300 | Latin | 73s | 107s |
| Echo | 301–400 | Double | 98s | 152s |
| Prism | 401–500 | combinations | 156s | 203s |

**Rhythm.** Step 5 of every stage is a *peek*: a deliberately gentle taste of
what the next world brings, drawn from that world's declared `preview`. Step 10
is a boss borrowing the next entry from the current world's own pool. The clock
tightens in visible steps at every stage boundary rather than sliding
imperceptibly per level, so "the timer got tighter" is something a player can
notice.

A preview must advertise what is *new*, not merely what is bigger. Pulling the
next world's first configuration blindly put a 9×9 at level 5, four levels after
the player's first 4×4 — a wall dressed as an invitation. Tide's preview is now
a 4×4 in shape marks: same size, new idea.

Par trends up at 0.27 s/level, generosity trends down, world peaks rise
monotonically, no level takes over 35ms to build, and every level of all 500 is
uniquely solvable.

**Known bias in the rater.** The technique ladder is box-centric — locked
candidates need boxes, so a Latin board can never rate above T1 however hard it
is. Measured, Latin needs deeper reasoning far more often at equal size (85% vs
100% solvable by singles at 9×9). `TUNE.latinFactor` carries that measurement
until the rater grows a technique that works without boxes; naked and hidden
pairs would be the natural addition.

**World peaks are compared at the 90th percentile, not the maximum.** A max over
100 levels is decided by a single outlier tier bump and says little about how
hard a world actually gets.

**Three things the curve got wrong**, all invisible until measured:

- Worlds 3 and 4 *regressed* — introducing a mechanic on a small board dropped
  difficulty below the previous world and left it there. Fixed by giving each
  world an explicit stage→config `ramp` rather than spreading its pool evenly.
  The assertion that caught it is world-peak monotonicity plus "must climb back
  past the previous world's mean within 40 levels"; a plain positive overall
  slope passed happily while two worlds sagged.
- The opening was flat: levels 1–20 were one identical 4×4, in exactly the
  window where a player decides whether to continue. World 1 now changes
  configuration every ten levels and reaches 9×9 by level 71; par at level 30 is
  2.7× par at level 1.
- 39 of 500 levels needed guessing. A tier-3 board is uniquely solvable but only
  by trial, which reads as unfair rather than hard. `buildLevel` now tries up to
  six alternative seeds for a logic-solvable puzzle: 39 → 1.

Still to build: lives and the timer fail state (5 lives, one per 20 minutes,
expiry costs a life, retry replays the same level), and the level UI.

## Open

- **Share badge.** Text sharing spoils the answer, and emoji cannot nest a mark
  inside a mark so Double only shares its outer layer. Wants rendering to an
  image. Worldle handles this better; deliberately parked.
- **Difficulty algorithm.** Given count is a crude proxy. The real measure is
  which solving technique a puzzle requires: run a solver that only applies
  forced moves and score by how many cells it cannot resolve, then generate by
  rejection sampling to hit a target. Works across every size and ruleset.
- **Monetisation and progression** — undecided.
- Move to its own repo before launch.

## Conventions

Canadian spelling throughout — colour, grey, centre — in copy, comments,
identifiers and commit messages. CSS keywords (`color`, `background-color`,
`prefers-color-scheme`) are language syntax and stay as they are.

Verify in a real browser, not by reading the diff. Every layout bug in this
project's history was found by screenshotting and none by reading the code.
