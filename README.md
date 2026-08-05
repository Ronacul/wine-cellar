# 🍷 La Cave — Personal Wine Cellar

A mobile-first web app for cataloguing and managing your wine collection. No install, no app store — just open `index.html` in your phone browser and bookmark it.

## Features

- **📷 Scan wine labels** — photograph a label and AI identifies the wine, fills in producer, vintage, region, drinking window, food pairings, and estimated market price
- **🗂️ Catalogue** — track producer, cuvée, vintage, type, region, drinking window, shelf section, bin code, source, price, quantity, and tasting notes
- **⏰ Drink Soon** — filtered view of wines approaching or past their drinking window
- **🔄 GitHub Sync** — push/pull your cellar data and label photos to a GitHub repo as backup
- **🏷️ Titi filter** — special toggle for bottles from Dad's cellar
- **💰 Price estimates** — AI-estimated market values on every bottle

## Quick start

1. Open `index.html` in your mobile browser (or any browser)
2. Tap **+ Bottle** to add your first wine
3. Photograph the label and tap **✨ Identify from label** to auto-fill fields
4. Review, adjust, and save

### Setting up sync (optional)

1. Go to the **Sync** tab
2. Open **Settings & API keys**
3. Enter your GitHub username, repo name (`wine-cellar`), branch (`main`), and a [fine-grained personal access token](https://github.com/settings/tokens?type=beta) with **Contents: read & write** on this repo
4. For label scanning, add a free [Gemini API key](https://aistudio.google.com/apikey)
5. Tap **Save settings**

## Data storage

- **On-device**: wines are stored in `localStorage` — they survive page refreshes and work offline
- **GitHub backup**: push syncs your data to `data/wines.json` and label photos to `images/`. Pull downloads the latest from the repo

⚠️ There's no merge — Push overwrites the repo, Pull overwrites local. If you add wines on multiple devices, pull on each before adding new ones.

## Tech stack

- Vanilla HTML/CSS/JS — single file, no build step, no dependencies
- Google Gemini API (free tier) for label scanning
- GitHub REST API for sync
- Mobile-first responsive design, dark theme

## File structure

```
index.html          # The entire app
data/wines.json     # Wine database (synced to GitHub)
images/             # Label photos ({wine-id}.jpg)
CLAUDE.md           # Project context for AI-assisted development
README.md           # This file
```

## Sources

The app includes a quick-pick dropdown for common wine sources:

| Source | Description |
|--------|------------|
| Charlie's Burgers | Monthly wine subscription (auto-stamps month/year) |
| Wine club | Generic monthly subscription |
| SAQ | Société des alcools du Québec |
| LCBO | Liquor Control Board of Ontario |
| Gift | Received as a gift |
| Winery | Purchased at cellar door |

## License

Personal project — not currently licensed for redistribution.
