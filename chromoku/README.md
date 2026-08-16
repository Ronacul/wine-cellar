# Chromoku

A daily colour-logic puzzle. Fill every row, column and box so no mark repeats.
Marks are colours, shapes or patterns — the rule never mentions numbers.

Working title.

## Running it

There is no build step and no dependencies. `index.html` is the whole game.

Opening the file directly works for a quick look, but the service worker and the
install prompt need a real origin:

```
python3 -m http.server 8000    # then visit http://localhost:8000
```

## Deploying

Static hosting, no build command, output directory `/`.

**Cloudflare Pages** is the recommended target: it deploys from a *private*
GitHub repo for free, which GitHub Pages does not (that needs Pro). Connect the
repo, leave the build settings empty, done.

Bump `CACHE` in `sw.js` on every deploy or returning players keep the old page.

## Two modes

- **Daily** — one date-seeded puzzle per tier, the same for everyone, free.
- **Levels** — a 500-level ladder across five worlds, with a countdown, five
  lives and stars for beating par.

## Developer tools

Append `?dev=1` to the URL to reveal the practice re-roll (⟳ in the header) and
the puzzle-date picker in Settings. The choice persists; `?dev=0` clears it.
Both are hidden from players, since either one lets you sidestep the daily.

## Tester feedback

Settings → **Copy my stats** puts a plain-text summary on the clipboard: level
reached, stars, per-level times. There is no analytics and nothing is sent
anywhere — testers paste it back manually.

Those times are the point. Every timing constant in the `TUNE` block in
`index.html` is currently an estimate; par was derived from work, not from
anyone actually playing. The curve's *shape* is verified across all 500 levels
(`scratchpad/curve.js` in the development repo), but the *absolute times* are
not.

## Design record

`CHROMOKU.md` holds the architecture, the measured findings, the decisions that
are easy to reverse by accident, and the distribution and revenue analysis.
Read it before changing the generator or the difficulty curve — several of the
non-obvious choices in there cost real measurement to arrive at.
