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
  "fire": false,
  "pairings": "comma-separated food pairings",
  "source": "CB (08/26) or SAQ or Wine club (08/26)",
  "price": "~$50 CAD (est.) or $37.95",
  "location": "",
  "notes": "Tasting notes, grape varieties",
  "drankDate": null,
  "imagePath": "images/{id}.jpg"
}
```

### Field semantics

- `titi: true` = from Dad's cellar (origin flag + filter in the UI)
- `fire: true` = icon/prestige/collectible wine (Sassicaia, Cheval Blanc, Penfolds Grange, Grand Cru Burgundy, cult Napa, etc.). Manual toggle + AI auto-detect on label scan.
- `qty: 0` + `drankDate` = consumed bottle — kept in history, hidden from default cellar view
- `price` uses `~$XX CAD (est.)` for AI-estimated prices vs actual purchase prices (always CAD)
- `source` uses `CB (mm/yy)` format for Charlie's Burgers shipments. The form splits this into a "CB" text input + separate mm/yy date fields, then recombines on save.

### Origins (derived, not stored)

Origins are computed from `source` + `titi` fields by `getOrigin(w)`:
- `titi: true` → "Titi"
- Source starting with "CB" → "CB"
- Source starting with "SAQ", "LCBO", "Wine club", "Gift", "Winery" → that label
- Otherwise the first word of source, or "Unknown"

## Key subsystems

### Label identification (Gemini AI)
- Uses Google Gemini API (free tier, key stored in browser config)
- Prompt is in `AI_PROMPT` constant — asks for all wine fields including price estimate and `fire` boolean
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
- SPA with tab-based routing: cellar, soon, add, stats, sync
- Detail view pushes browser `history.pushState` so phone back button works
- `cellarScrollY` saves/restores scroll position when entering/leaving detail view

### Display helpers (top-level functions)
- `fmtSource(s)` — formats "CB (02/23)" → "CB · Feb '23" for display
- `isFire(w)` — checks `w.fire` boolean (prestige/collectible)
- `isPeak(w)` — checks if wine is approaching or past drink window (urgency)
- `isCB(w)` — checks if source starts with "CB"
- `isDrank(w)` — checks if qty <= 0
- `getOrigin(w)` — derives origin label from source + titi fields

### Cellar view features
- **Filters**: search, type, shelf, Titi toggle, 🔥 fire toggle
- **View toggle**: In cave (default, hides drank) / Drank (only qty=0) / All
- **Sort**: producer, vintage (asc/desc), recently added, drink window
- **Cards show**: fire 🔥 emoji + chip, peak ⛰️ chip, CB badge, Titi chip, drank styling (faded/greyscale)

### Stats page
- Summary pills: wines, bottles, estimated value (CAD), fire count, peak count, drank count + consumed value
- 🎲 Random bottle picker ("What should I drink tonight?") — picks from in-cave wines, tappable to detail
- Bottle-shaped SVG charts by wine type (proportional height)
- Origin breakdown bar chart (CB, Titi, SAQ, LCBO, etc.)
- CB by shipment month sub-chart
- Price distribution (CAD buckets: $0–20, $20–40, $40–60, $60–100, $100+)
- Vintage spread bar chart

### Fire wine identification criteria
For flagging existing wines or when AI identifies from labels:
- **Known icon producers**: Tenuta San Guido, Château Cheval Blanc, Ornellaia, Château Pétrus, Château Latour, Château Lafite, Château Margaux, Château Haut-Brion, Domaine de la Romanée-Conti, Penfolds (Grange)
- **Prestige keywords**: Super Tuscan, 1er Grand Cru Classé, Premier Grand Cru, Sassicaia, Masseto, Solaia, Tignanello, Opus One, Screaming Eagle, Harlan
- **Price threshold**: ~$150+ CAD typically qualifies
- Mid-tier classified Bordeaux (e.g. St-Émilion Grand Cru at ~$50) are **not** fire — that designation is reserved for truly iconic/collectible bottles

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

### Template literal gotcha
- `\d{2}` regex inside template `${}` — the `}` is interpreted as closing the template expression
- Fix: extract regex matching to variables before the template literal

## Common sources

- **CB** — Charlie's Burgers, monthly wine subscription, stored as `CB (mm/yy)`
- **Wine club (monthly)** — generic subscription
- **SAQ** — Société des alcools du Québec
- **LCBO** — Liquor Control Board of Ontario

## Style conventions

- Dark theme with wine-cellar aesthetic (`--bg:#1c1518`, `--claret:#a03040`, `--gold:#c9a227`)
- Fire color: `#e8a020` (warm amber gold, distinct from urgent red)
- Peak color: `var(--warn)` / `#c9a227`
- Titi color: `var(--titi)` / `#8a7dc9` (purple)
- CB color: `var(--ok)` / `#7da87b` (green)
- Fonts: Cormorant Garamond (headings), IBM Plex Mono (labels/data), system sans-serif (body)
- Mobile-first, bottom tab nav with safe-area-inset padding
- Status messages in mono font, bordered boxes (`.sync-status`)
- Drank wines: faded opacity (0.45) + greyscale thumbnails

## Changelog location

The "What's new" section is hardcoded in `renderSync()` in `index.html`. Add new entries as `<li>` elements at the top of the `.changelog` list.
