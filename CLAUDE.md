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
  "pairings": "comma-separated food pairings",
  "source": "e.g. Charlie's Burgers (Aug 2026)",
  "price": "~$50 (est.) or $37.95 + HST",
  "location": "",
  "notes": "Tasting notes, grape varieties",
  "imagePath": "images/{id}.jpg"
}
```

- `titi: true` = from Dad's cellar (special filter in the UI)
- `price` uses `~$XX (est.)` for AI-estimated prices vs actual purchase prices
- `source` supports subscriptions with date stamps: `"Charlie's Burgers (Aug 2026)"`

## Key subsystems

### Label identification (Gemini AI)
- Uses Google Gemini API (free tier, key stored in browser config)
- Prompt is in `AI_PROMPT` constant — asks for all wine fields including price estimate
- **Model fallback chain**: `gemini-3.5-flash` → `gemini-2.5-flash` → `gemini-3.1-flash-lite-preview`
- Retries 3× per model on 429/503 with 2s/4s/6s backoff
- Skips to next model on 404 (model retired/unavailable)
- After identification, empty fields get gold pulse animation + dot marker (`needs-att` CSS class)

### GitHub sync
- Push = upload dirty label photos + write `wines.json` to repo
- Pull = fetch `wines.json` from repo raw URL, replace localStorage
- Sync history logged to `cave.synchistory.v1` in localStorage (last 30 entries)
- Pull is the safe/common action (top of page); Push is further down to prevent accidents

### Navigation
- SPA with tab-based routing: cellar, soon, add, sync
- Detail view pushes browser `history.pushState` so phone back button works
- `cellarScrollY` saves/restores scroll position when entering/leaving detail view

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

### UI/UX patterns that worked well
- Collapsible `<details>` sections for settings/keys — prevents accidental edits on mobile
- Source quick-pick dropdown that resets after selection (acts as quick-fill, not a permanent select)
- Gold pulse animation for "needs attention" fields — draws eye without blocking
- Separating Pull (safe) from Push (destructive) with visual hierarchy

## Common sources

- **Charlie's Burgers** — monthly wine subscription, auto-stamped with month/year
- **Wine club (monthly)** — generic subscription
- **SAQ** — Société des alcools du Québec
- **LCBO** — Liquor Control Board of Ontario

## Style conventions

- Dark theme with wine-cellar aesthetic (`--bg:#1c1518`, `--claret:#a03040`, `--gold:#c9a227`)
- Fonts: Cormorant Garamond (headings), IBM Plex Mono (labels/data), system sans-serif (body)
- Mobile-first, bottom tab nav with safe-area-inset padding
- Status messages in mono font, bordered boxes (`.sync-status`)

## Changelog location

The "What's new" section is hardcoded in `renderSync()` in `index.html`. Add new entries as `<li>` elements at the top of the `.changelog` list.
