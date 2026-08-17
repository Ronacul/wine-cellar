# The Cave — Comic Book Vault

## Project overview

A single-file progressive web app (`index.html`) for cataloguing a personal comic book collection. No build step, no frameworks — vanilla HTML/CSS/JS. Designed as a mobile-first PWA. Lives inside the `comics/` directory of the wine-cellar repo and shares the same GitHub sync infrastructure.

## Architecture

- **`index.html`** — the entire app: styles, markup, and JS in one file
- **`data/comics.json`** — canonical comic data (array of comic objects)
- **`images/`** — cover photos, named `{comic.id}.jpg`
- **No server** — data lives in localStorage; GitHub is the sync/backup target via its REST API

## Data model

Each comic object in `comics.json`:

```json
{
  "id": "unique-string",
  "added": "YYYY-MM-DD",
  "publisher": "Marvel",
  "title": "The Amazing Spider-Man",
  "issueNumber": "300",
  "variant": "",
  "year": "1988",
  "era": "Copper",
  "condition": "VF",
  "graded": false,
  "grade": null,
  "gradingCompany": null,
  "keyStatus": "First full appearance of Venom",
  "fire": 2,
  "coverArtist": "Todd McFarlane",
  "writer": "David Michelinie",
  "characters": "Spider-Man, Venom",
  "price": "$400 CAD",
  "source": "LCS",
  "location": "A1",
  "qty": 1,
  "notes": "Copper Age key.",
  "marketValue": "~$650 CAD (est.)",
  "gradedValue": "~$1,800 CAD (est.)",
  "gradeCandidate": true,
  "gradeCandidateReason": "VF raw to CGC 8.0 would significantly increase value.",
  "lastValueCheck": "2026-08-16",
  "soldDate": null,
  "soldPrice": null,
  "soldTo": null,
  "giftedTo": null,
  "imagePath": "images/{id}.jpg"
}
```

### Field semantics

- `condition` — raw condition estimate: NM, VF, FN, VG, GD, FR, PR
- `graded` — whether it's been professionally graded (slabbed)
- `grade` — numeric CGC/CBCS grade (e.g. 9.6) if graded
- `gradingCompany` — CGC, CBCS, or PGX
- `keyStatus` — what makes it a key issue (first appearances, deaths, etc.)
- `fire: 0–3` = fire tier (integer). 0 = regular, 1 = Notable, 2 = Key Issue, 3 = Grail
- `era` — Golden, Silver, Bronze, Copper, or Modern
- `gradeCandidate` — flagged as worth considering for professional grading
- `gradeCandidateReason` — AI or manual explanation of grading ROI
- `marketValue` — estimated raw market value in CAD
- `gradedValue` — estimated value if graded at current condition, in CAD
- `qty: 0` + `soldDate` = sold book — kept in history
- `qty: 0` + `giftedTo` = gifted book
- `price` uses `~$XX CAD (est.)` for AI-estimated prices vs actual purchase prices

### Condition scale

- **NM** (Near Mint) — 9.2–9.8 CGC equivalent
- **VF** (Very Fine) — 8.0–9.0
- **FN** (Fine) — 6.0–7.5
- **VG** (Very Good) — 4.0–5.5
- **GD** (Good) — 2.0–3.5
- **FR** (Fair) — 1.0–1.5
- **PR** (Poor) — 0.5

### Fire tier criteria

- **Tier 3 — Grail** 🔥🔥🔥: Legendary books — Amazing Fantasy #15, Action Comics #1, Detective Comics #27, Incredible Hulk #181, Giant-Size X-Men #1
- **Tier 2 — Key Issue** 🔥🔥: Major first appearances, significant deaths/events — ASM #300, New Mutants #98, Batman #497
- **Tier 1 — Notable** 🔥: Minor keys, popular covers, sought-after variants, notable runs
- **Tier 0 — None**: Regular issues. Most comics are tier 0.

## Key subsystems

### Cover identification (Gemini AI)
- Uses Google Gemini API (free tier, key stored in browser config)
- Model fallback chain: gemini-3.5-flash → gemini-2.5-flash → gemini-3.1-flash-lite-preview
- Identifies publisher, title, issue, era, condition, key status, cover artist, writer
- Estimates raw value AND graded value — the grading angle is core
- Auto-flags grade candidates based on ROI analysis (~$50 CAD grading cost threshold)
- Duplicate detection after identification

### Grading ROI analysis
- Compares raw market value to estimated graded value
- Subtracts ~$50 CAD estimated grading cost
- Shows net gain and percentage on detail view
- "Top grading candidates" section on Value tab, sorted by ROI
- Grade candidate flag (💎) on cards and in filters

### GitHub sync
- Same pattern as wine cellar — Push/Pull with GitHub REST API
- Cover photos uploaded to `comics/images/`
- Data written to `comics/data/comics.json`

### Navigation
- Tabs: Collection, 🔥 Hot, + Add, Stats, 📈 Value, Sync
- Hot tab = fire books + key issues + grade candidates
- Detail view with browser history support

## Style conventions

- **Canadian spelling throughout** — colour, grey, centre, behaviour — in UI copy, comments, identifiers and commit messages
- Dark theme with comic-book aesthetic (`--bg:#14171c`, `--accent:#e8c840`, `--red:#c04040`)
- Fire colour: `#e8a020` (warm amber gold)
- Publisher colours: Marvel red, DC blue, Image orange
- Condition colours graduated: NM green → VF blue → FN gold → VG/GD/FR/PR red
- Fonts: Bangers (headings — comic book style), IBM Plex Mono (labels/data), system sans-serif (body)
- Mobile-first, bottom tab nav with safe-area-inset padding
