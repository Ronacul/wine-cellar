# La Cave — Wine Cellar App

## Project overview

A single-file progressive web app (`index.html`) for cataloguing a personal wine cellar. No build step, no frameworks — vanilla HTML/CSS/JS. Designed as a mobile-first PWA served via GitHub Pages.

## Architecture

- **`index.html`** — the entire app: styles, markup, and JS in one file
- **`data/wines.json`** — canonical wine data (array of wine objects)
- **`images/`** — label photos, named `{wine.id}.jpg`
- **No server** — data lives in localStorage; GitHub is the sync/backup target via its REST API (authenticated with a personal access token stored in the browser)

## Data model

Each wine object in `wines.json`:

```json
{
  "id": "unique-string",
  "added": "YYYY-MM-DD",
  "producer": "Château Example",
  "name": "Cuvée Name",
  "vintage": "2019",
  "type": "Red|White|Rosé|Sparkling|Dessert",
  "qty": 1,
  "region": "Appellation, Country",
  "drinkFrom": "2024",
  "drinkTo": "2032",
  "shelfSection": "Keep|Soon|White|Sparkling",
  "binCode": "K01",
  "titi": false,
  "fire": 0,
  "pairings": "comma-separated food pairings",
  "source": "CB (08/26) or SAQ or Wine club (08/26)",
  "price": "~$50 CAD (est.) or $37.95",
  "location": "",
  "notes": "Tasting notes, grape varieties",
  "drankDate": null,
  "rating": null,
  "drinkNotes": null,
  "buyAgain": null,
  "giftedTo": null,
  "marketValue": "~$55 CAD (est.)",
  "lastValueCheck": "2026-08-09",
  "tastingHistory": [],
  "imagePath": "images/{id}.jpg"
}
```

### Field semantics

- `titi: true` = from Dad's cellar (origin flag + filter in the UI)
- `fire: 0–3` = fire tier (integer). `0` = no flag, `1` = Notable (above-average quality/reputation), `2` = Prestige (collectible, special-occasion — e.g. top cru Bordeaux, premium Super Tuscans), `3` = Icon (legendary bottles — Sassicaia, Penfolds Grange, Cheval Blanc, Ornellaia, Romanée-Conti, Opus One). Backward compat: `true` → 1, `false`/absent → 0. Manual picker in detail + form views; AI auto-assigns on label scan.
- `qty: 0` + `drankDate` = consumed or gifted bottle — kept in history, hidden from default cellar view
- `rating` (1–5 or null) = user's star rating after drinking. Shown as ★/☆ on cards and detail view.
- `drinkNotes` (string or null) = tasting notes recorded when the bottle was drunk
- `buyAgain` (boolean or null) = would buy again toggle, recorded during drink review
- `giftedTo` (string or null) = if set, bottle was given as a gift rather than drunk. Value is the recipient/occasion. Gifts get 🎁 badge instead of drank styling.
- `price` uses `~$XX CAD (est.)` for AI-estimated prices vs actual purchase prices (always CAD)
- `marketValue` (string or null) = AI-estimated current retail market value in CAD, from the Value tab's "Update market values" feature. Compared against `price` for appreciation tracking.
- `lastValueCheck` (ISO date or null) = when `marketValue` was last updated
- `tastingHistory` (array or null) = maturity tracking entries for multi-bottle wines. Each entry: `{date, rating, notes, buyAgain, bottleNum}`. Added when opening a bottle from a multi-bottle wine. Last bottle's review also adds an entry.
- `source` uses `CB (mm/yy)` format for Charlie's Burgers shipments. Gift source uses `Gift - Name (mm/yy)` format. The form splits these into text input + separate mm/yy date fields, then recombines on save.

### Origins (derived, not stored)

Origins are computed from `source` + `titi` fields by `getOrigin(w)`:
- `titi: true` → "Titi"
- Source starting with "CB" → "CB"
- Source starting with "SAQ", "LCBO", "Wine club", "Gift", "Winery" → that label
- Otherwise the first word of source, or "Unknown"

## Key subsystems

### Label identification (Gemini AI)
- Uses Google Gemini API (free tier, key stored in browser config)
- Prompt is in `AI_PROMPT` constant — asks for all wine fields including price estimate and `fire` tier (0–3 integer)
- **Model fallback chain**: `gemini-3.5-flash` → `gemini-2.5-flash` → `gemini-3.1-flash-lite-preview`
- Retries 3× per model on 429/503 with 2s/4s/6s backoff
- Skips to next model on 404 (model retired/unavailable)
- After identification, empty fields get gold pulse animation + dot marker (`needs-att` CSS class)
- Detail view "Identify / re-check price" uses canvas-based `imgToBase64()` to extract photo data from the already-loaded `<img>` element (avoids CORS issues with raw.githubusercontent.com)
- If wine has <2 fields filled, runs full AI identification; otherwise price-only check

### GitHub sync
- Push = upload dirty label photos + write `wines.json` to repo
- Pull = fetch `wines.json` from repo raw URL, replace localStorage
- Sync history logged to `cave.synchistory.v1` in localStorage (last 30 entries)
- Pull is the safe/common action (top of page); Push is further down to prevent accidents
- Bulk price re-check on sync page processes all wines sequentially with stop button

### Navigation
- SPA with tab-based routing: cellar, soon, add, stats, value, sync
- Detail view pushes browser `history.pushState` so phone back button works
- `cellarScrollY` saves/restores scroll position when entering/leaving detail view

### Display helpers (top-level functions)
- `fmtSource(s)` — formats "CB (02/23)" → "CB · Feb '23" and "Gift - Lisa (10/24)" → "Gift - Lisa · Oct '24" for display
- `parseGiftSource(s)` — parses "Gift - Name (mm/yy)" into `{name, mm, yy}` components
- `parsePrice(p)` — extracts numeric value from price string (e.g. "$37.95" → 37.95)
- `addTastingEntry(w, rating, notes, buyAgain)` — adds a timestamped entry to `w.tastingHistory` for maturity tracking
- `fireLevel(w)` — returns integer 0–3 from `w.fire` (handles `true` → 1 backward compat)
- `isFire(w)` — checks `fireLevel(w) > 0`
- `fireEmoji(w)` — returns "🔥" repeated by tier (e.g. "🔥🔥🔥" for Icon)
- `fireLabel(w)` — returns tier name: "Notable", "Prestige", or "Icon"
- `isPeak(w)` — checks if wine is approaching or past drink window (urgency): `overdue`, `urgent`, or `soon`
- `isCB(w)` — checks if source starts with "CB"
- `isDrank(w)` — checks if qty <= 0
- `isGifted(w)` — checks if `giftedTo` is set (bottle was a gift, not drunk)
- `getOrigin(w)` — derives origin label from source + titi fields
- `monthsRemaining(w)` — calculates approximate months until `drinkTo` for countdown
- `countdownText(mo)` — formats months into "X yr left", "X mo left", "X mo over", "X yr over"
- `starsHTML(rating, size)` — renders ★/☆ star display for a given 1–5 rating
- `peakChipHTML(w)` — renders the graduated peak chip(s) with countdown text
- `windowStatus(w)` — returns `{cls, label, countdown}` with graduated statuses
- `filterCounts(baseItems)` — counts how many wines match each filter chip (before chip filters applied)
- `shelfCounts(baseItems)` — counts wines per shelf letter from `binCode` first char

### Drink-window graduation (peak countdown)
The `windowStatus()` function returns graduated statuses based on months remaining:
- **`hold`** — before `drinkFrom` year (grey, "Hold · from YYYY")
- **`window`** — in window, >12 months left (green, "In window", countdown)
- **`soon`** — 3–12 months left (gold/amber, "Drink soon", countdown)
- **`urgent`** — 1–3 months left (orange `--orange:#d4842a`, "Last call", countdown)
- **`overdue`** — past `drinkTo` (red/urgent, "Past peak", countdown)
- Countdown text: "X yr left" if >24 months, "X mo left" if 1–24, "X mo/yr over" if past
- Drink Soon tab sorts by urgency (most urgent first) and groups into sections

### Drink review flow
When qty decreases via the minus button:
- **Multi-bottle (qty > 1)**: Tasting note review sheet appears — rate, note, buy-again. Saves to `tastingHistory` array for maturity tracking. "Skip — just remove bottle" option.
- **Last bottle (qty → 0)**: Full review sheet with choice:
  - **🍷 Drank it**: 5-star rating (tappable ★/☆), tasting notes textarea, "Would buy again?" yes/no. Also adds to `tastingHistory`.
  - **🎁 Gave as gift**: optional "To whom / occasion" input
  - Both options have "Skip — just mark as gone" to bypass review
- Review data stored in `rating`, `drinkNotes`, `buyAgain`, `giftedTo` fields (last bottle) plus `tastingHistory` (all bottles)

### Unrated bottles nudge
- Appears as a collapsible `<details>` section at the top of the Drank view
- Shows bottles with `drankDate` set + no `rating` + no `giftedTo` (drunk but not reviewed)
- Sorted most-recently-drunk first; tapping opens the detail view
- Auto-hides when all drunk bottles are rated
- Gold border to draw attention

### Unified filter bar
The toolbar uses a chip-based filter system instead of discrete toggle buttons:
- **Search**: full-text search across producer, name, region, vintage, source, pairings, binCode, notes
- **Type dropdown**: Red/White/Rosé/Sparkling/Dessert
- **Shelf chips**: scrollable row of physical shelf letters (A–R) derived from first char of `binCode`. Multiple can be active. Each shows a bottle count badge. Only letters with bottles are rendered.
- **Filter chips**: scrollable row of toggleable pill chips — each shows a match count:
  - 🔥 Fire (`#e8a020`) — `isFire(w)`
  - Titi (`var(--titi)`) — `w.titi`
  - CB (`var(--ok)`) — `isCB(w)`
  - ⛰️ Peak (`var(--warn)`) — `isPeak(w)` (overdue, urgent, or soon)
  - ⏰ Soon (`var(--orange)`) — windowStatus soon or urgent
  - 🔴 Past (`var(--urgent)`) — windowStatus overdue
- **View toggle**: In cave (default, hides drank) / Drank (only qty=0) / All
- **Sort**: producer, vintage (asc/desc), recently added, drink window
- Counts are computed before applying chip filters so they reflect the base filtered set
- State: `filters = {fire, titi, cb, peak, soon, past}` object + `shelfFilters = Set()` of letters

### Cellar view features
- **Cards show**: fire 🔥 emoji (repeated by tier) + tier label chip, graduated peak chips with countdown, CB badge, Titi chip, drank styling (faded/greyscale), gift 🎁 chip, star rating on drank cards

### Stats page
- Summary pills: wines, bottles, estimated value (CAD), fire tiers (🔥🔥🔥 icon / 🔥🔥 prestige / 🔥 notable), peak count, drank count + consumed value, gifted count
- 🎲 Random bottle picker ("What should I drink tonight?") — picks from in-cave wines, tappable to detail
- Bottle-shaped SVG charts by wine type (proportional height)
- Origin breakdown bar chart (CB, Titi, SAQ, LCBO, etc.)
- Price distribution (CAD buckets: $0–20, $20–40, $40–60, $60–100, $100+)
- Vintage spread bar chart
- CB by shipment: collapsible by year (current year open, older collapsed), at bottom of page

### Value tab (📈)
- Summary pills: acquisition cost, current market value, overall appreciation %
- Consumed value pill for drank wines
- AI market value update button: batch-checks all wines via Gemini for current retail prices
- Wine ticker: stock-ticker-style list with ▲/▼ % change, color-coded (green = up, red = down)
- Sort: gainers, losers, total value, A–Z
- "Hide past peak" toggle: filters out overdue wines to avoid depressing valuations
- Data: `marketValue` (AI estimate), `lastValueCheck` (date)
- Detail view: shows market value + appreciation % inline below purchase price

### Maturity tracking
- `tastingHistory` array on wine object stores timestamped tasting entries
- Multi-bottle wines: removing a bottle (qty > 1) prompts for tasting notes instead of silently decrementing
- Maturity timeline on detail view: vertical timeline showing all tastings with date, rating, notes
- Maturity nudge: gold-bordered prompt on multi-bottle wines suggesting periodic tasting
  - "You have N bottles — consider opening one to start tracking…" (if never tasted)
  - "Last tasted X months ago — time to open another?" (if ≥6 months since last tasting)

### Duplicate detection
- After AI label identification, checks existing wines for matching producer + name + vintage
- If duplicate found, offers "Add another bottle" button to increment qty instead of creating a new entry
- User can still save as a separate entry via the form

### Fire tier criteria
For manual assignment or AI identification from labels:
- **Tier 3 — Icon** 🔥🔥🔥: Legendary, globally recognized bottles — Sassicaia, Penfolds Grange, Cheval Blanc, Ornellaia, Pétrus, Latour, Lafite, Margaux, Haut-Brion, Romanée-Conti, Opus One, Screaming Eagle, Harlan. Typically $200+ CAD.
- **Tier 2 — Prestige** 🔥🔥: Collectible, special-occasion wines — top cru Bordeaux, premium Super Tuscans (Guado al Tasso, Tignanello, Solaia), great vintages of respected producers. Typically $150–300 CAD.
- **Tier 1 — Notable** 🔥: Above-average quality or reputation — aged classified Bordeaux, well-known single-vineyard bottlings, wines with historical significance. May be under $100 but have collector interest.
- **Tier 0 — None**: Everything else. Most wines are tier 0. Mid-tier classified Bordeaux (e.g. St-Émilion Grand Cru at ~$50) are not fire. Be conservative — the tiers should feel earned.

## Lessons learned

### Gemini API models retire fast
- `gemini-2.0-flash` shut down June 1, 2026; `gemini-2.0-flash-lite` also retired
- Always use a fallback chain, not a single model
- The model that was current at code-write time may be dead within months
- Check https://ai.google.dev/gemini-api/docs/changelog for current model list

### Free-tier Gemini rate limits
- Google slashed free-tier quotas ~92% in Dec 2025 (250 → 20 RPD for some models)
- Retry with backoff is essential, not optional
- Status messages during retry keep the user informed vs a silent hang

### Single-file app considerations
- All changes go in one `index.html` — easy to deploy but diffs are noisy
- Data lives in localStorage AND GitHub — they can diverge
- Pull overwrites local; Push overwrites remote — no merge, last write wins
- Price data added to the repo needs a Pull to reach the browser

### CORS and label photos
- `fetch()` on `raw.githubusercontent.com` URLs is blocked by CORS, even though `<img>` tags load fine
- Solution: use `imgToBase64()` to draw the already-loaded `<img>` to a canvas and extract base64
- Requires `crossorigin="anonymous"` on the detail photo `<img>` element

### UI/UX patterns that worked well
- Collapsible `<details>` sections for settings/keys — prevents accidental edits on mobile
- Source quick-pick dropdown that resets after selection (acts as quick-fill, not a permanent select)
- Gold pulse animation for "needs attention" fields — draws eye without blocking
- Separating Pull (safe) from Push (destructive) with visual hierarchy
- CB source split into text + mm/yy date fields to avoid manual date formatting
- Segmented toggle (In cave / Drank / All) only appears when drank wines exist
- Fire toggle on detail view for quick flagging without opening edit form
- Review sheet on last-bottle removal — captures rating data at the natural moment
- Gift vs drank choice — different paths for different outcomes, no rating needed for gifts
- Unrated bottles nudge with gold border — draws eye to bottles awaiting review
- Graduated peak countdown — color escalation (green → gold → orange → red) communicates urgency at a glance
- Search select-all on focus — tapping search selects existing text so typing replaces it instantly
- Gift source with name + date fields — like CB, "Gift" gets split into name input + mm/yy date, auto-capitalizes first letter
- Stock ticker UI for value tracking — familiar metaphor, color-coded ▲/▼ changes at a glance
- Multi-bottle tasting prompt — captures maturity data at the natural bottle-opening moment
- "Hide past peak" toggle — avoids depressing valuations of over-the-hill wines

### Template literal gotcha
- `\d{2}` regex inside template `${}` — the `}` is interpreted as closing the template expression
- Fix: extract regex matching to variables before the template literal

## Common sources

- **CB** — Charlie's Burgers, monthly wine subscription, stored as `CB (mm/yy)`
- **Gift** — wines received as gifts, stored as `Gift - Name (mm/yy)`, e.g. `Gift - Lisa and Phil (10/24)`
- **Wine club (monthly)** — generic subscription
- **SAQ** — Société des alcools du Québec
- **LCBO** — Liquor Control Board of Ontario

## Style conventions

- **Canadian spelling throughout** — colour, grey, centre, behaviour — in UI copy,
  comments, identifiers and commit messages. CSS keywords (`color`, `background-color`,
  `prefers-color-scheme`) are language syntax and stay as they are.

- Dark theme with wine-cellar aesthetic (`--bg:#1c1518`, `--claret:#a03040`, `--gold:#c9a227`)
- Fire color: `#e8a020` (warm amber gold, distinct from urgent red)
- Peak color graduated: `var(--ok)` green (in window) → `var(--warn)` gold (drink soon) → `var(--orange)` / `#d4842a` (last call) → `var(--urgent)` red (past peak)
- Titi color: `var(--titi)` / `#8a7dc9` (purple)
- CB color: `var(--ok)` / `#7da87b` (green)
- Gift color: `var(--rose)` / `#c98a8a` (rose)
- Fonts: Cormorant Garamond (headings), IBM Plex Mono (labels/data), system sans-serif (body)
- Mobile-first, bottom tab nav with safe-area-inset padding
- Status messages in mono font, bordered boxes (`.sync-status`)
- Drank wines: faded opacity (0.45) + greyscale thumbnails
- Gifted wines: slightly less faded (0.55) + subtle sepia filter instead of full greyscale

## Changelog location

The "What's new" section is hardcoded in `renderSync()` in `index.html`. Add new entries as `<li>` elements at the top of the `.changelog` list.

## Chromoku (colour puzzle game)

Chromoku lives in **this repo** at `chromoku/index.html`. There is no separate
`Ronacul/Chromoku` repo — that note was wrong. All Chromoku development happens
here in `wine-cellar/chromoku/`.

- Game: `chromoku/index.html` (single-file SPA, vanilla JS)
- Design doc: `chromoku/CHROMOKU.md`
- Mark picker tool: `chromoku/MARK_PICKER.md`
- Tutorial: `chromoku/TUTORIAL.md`

### Chromoku links

| Link | Branch | Purpose |
|---|---|---|
| 🎮 **https://ronacul.github.io/wine-cellar/chromoku/** | `main` | **Playtest / playtest** — always the live testable version |

GitHub Pages serves only `main`, so `main` IS the playtest link. There is no second link yet (Cloudflare Pages is a future step for a separate stable/prod URL).

### Chromoku push workflow

Claude always develops on a task branch (`claude/chromoku-*`). To get changes live:

- **"Push to playtest"** or **"Push to main"** → Claude merges the task branch into `main` and pushes. GitHub Pages updates in ~1 min.
- Task branches are invisible to you (not served anywhere) — always ask Claude to push to main when you want to test.
- Claude must include both links in every Chromoku response:
  - 🔧 **Branch** (current dev, not yet live): `https://github.com/Ronacul/wine-cellar/blob/BRANCH/chromoku/index.html`
  - 🎮 **Playtest** (live now): `https://ronacul.github.io/wine-cellar/chromoku/`

Always push at the end of every Chromoku session so phone/other devices can play the latest version.
