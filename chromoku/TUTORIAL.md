# Chromoku 7-Day Tutorial — Development Guide

**Last updated**: This is the canonical guide. If you're reading it, we're in sync.

---

## 📍 Where Everything Lives

### Repository Structure
```
Ronacul/wine-cellar (PUBLIC GitHub)
├── chromoku/
│   ├── index.html          ← Main game (canonical)
│   ├── dev.html            ← Tutorial dev version (with admin panel)
│   ├── 7day-tutorial.html  ← Tutorial clean version (no admin)
│   ├── TUTORIAL.md         ← THIS FILE (canonical docs)
│   ├── manifest.webmanifest
│   ├── icons/
│   └── ...
└── CLAUDE.md               ← Main project docs
```

### Why Public?
- HTML pages need to be served for testing
- Private repos can't use GitHub Pages without Pro
- Cloudflare Pages will handle deployment (no cost)
- Development iteration requires easy access

### Private Repo (Reference Only)
- `Ronacul/Chromoku` exists for the main game
- Tutorial is new work, lives in wine-cellar for now

---

## 🎮 Tutorial Architecture

### Files
| File | Purpose | Access |
|------|---------|--------|
| `dev.html` | Dev version with admin controls | Raw: https://raw.githubusercontent.com/Ronacul/wine-cellar/claude/chromoku-monetization-vpbvnj/chromoku/dev.html |
| `7day-tutorial.html` | Clean version for players | Raw: Same branch, file name |

### Branch
- **Development**: `claude/chromoku-monetization-vpbvnj`
- All work goes here
- Once tested, can merge to `main` or deploy to Cloudflare

---

## 🎯 Game Mechanics

### 7 Days (Tutorial Levels)
1. **4×4 Sudoku** — Learn rows/cols/boxes with 4 colours, 12 givens
2. **4×4 Latin** — Remove boxes, just rows/cols, 12 givens
3. **6×6 Sudoku** — Scale up to 6 colours, 3×2 boxes, 24 givens
4. **6×6 Symbols** — Same puzzle, shapes instead of colours (shaped swatches)
5. **4×4 Double** — Two independent 4×4 Sudokus on same board
   - Outer layer: Donut swatches (rings) 🍩
   - Inner layer: Inner swatches (small dots) 🎯
6. **9×9 Sudoku** — Classic, 50 givens (very easy for tutorial)
7. **10×10 Latin** — Mastery level, no boxes, 50 givens

### First-Move Guide (easyFirst)
- All 7 days have `easyFirst: true`
- Shows animated pulsing cell + swatch on first load
- User taps correct move → confetti + celebration
- **Double puzzles**: Guides outer layer first, then inner layer sequentially

### Progression
- Complete level → Modal offers "Start [Next Level]"
- Or click "Jump to day N" in admin panel (dev version)

---

## 🛠️ Admin Panel (dev.html only)

### Controls
1. **Reset Tutorial** — Clears localStorage, restarts Day 1 (red button)
2. **Tutorial Variant** — Dropdown for future tutorials (Latin Double, etc.)
3. **Jump to Day** — Enter 1-7, skip directly
4. **Hearts/Time** — Manage game state (placeholder for lives system)
5. **Time Adjust** — Enter adjustment after level complete (for beta feedback)
6. **Ad Toggles**:
   - Banner Ad (bottom of screen, 728×90 / 320×50)
   - Video Ad (15-sec countdown, "earn hearts" mechanic)
7. **Live Status** — Shows current day, hearts, time

### Ad Placeholders
- **Banner**: Bottom of screen, toggle on/off in admin
- **Video**: Full-screen mockup with 15-sec timer + skip button (5s skip delay)
- For testing monetization UI/impact before real ads

---

## 📱 How to Use

### On Computer
```bash
# Clone the repo
git clone https://github.com/Ronacul/wine-cellar.git
cd wine-cellar
git checkout claude/chromoku-monetization-vpbvnj

# Open locally in browser
open chromoku/dev.html
# or
open chromoku/7day-tutorial.html
```

### On Phone (or Remote)
Use raw GitHub URLs (no build needed, instant):
```
https://raw.githubusercontent.com/Ronacul/wine-cellar/claude/chromoku-monetization-vpbvnj/chromoku/dev.html
https://raw.githubusercontent.com/Ronacul/wine-cellar/claude/chromoku-monetization-vpbvnj/chromoku/7day-tutorial.html
```

### In Claude Sessions
- All work in `claude/chromoku-monetization-vpbvnj` branch
- Push → GitHub
- Pull → latest from GitHub
- No regression: state lives in git, not session memory

---

## 🔄 Workflow (No Regression)

### Session Start
1. Read THIS FILE (you are here)
2. Check branch: `git branch -v`
3. Pull latest: `git pull origin claude/chromoku-monetization-vpbvnj`
4. You're in sync

### During Session
- Make changes
- Test on phone/computer (open raw URLs or local file)
- Commit: `git add ... && git commit -m "..."`
- Push: `git push origin claude/chromoku-monetization-vpbvnj`

### Session End
- All changes in git
- Next session: pull, you're current
- No lost work, no surprises

---

## 🌐 Deployment (Future: Cloudflare Pages)

When ready to beta test:
1. Connect Cloudflare to wine-cellar repo
2. Set Pages to build from `chromoku/` directory
3. Get `*.pages.dev` URL or custom domain
4. Every push → auto-deployed (30 sec)
5. Share URL with beta testers

**Cost**: $0 (Cloudflare free tier)

---

## 📊 Data Structures

### State Object
```javascript
const state = {
  day: 1,                    // Current tutorial day (1-7)
  n: 4,                      // Grid size (4, 6, 9, 10)
  boxless: false,            // Latin (true) or Sudoku (false)
  dbl: false,                // Double puzzle (two layers)
  layers: [],                // [{grid, solution, givens}, ...]
  done: false,               // Puzzle complete
  moveCount: 0,              // User moves
  hearts: 5,                 // Lives (for future system)
  currentTime: 0,            // Elapsed time (for future system)
  timeAdjust: 0,             // Admin: time adjustment feedback
  showAdBanner: true,        // Ad visibility
  showAdVideo: false,        // Ad visibility
  showingFirstMoveGuide: false,
  firstMoveTarget: null,     // { cell, value, layer }
  firstMoveLayer: 0,         // 0 = outer, 1 = inner (for Double)
  // ... more
};
```

### Tutorial Day Definition
```javascript
{
  day: 1,
  title: "4×4 Sudoku",
  icon: "🟨",
  givens: 12,                // Pre-filled cells (higher = easier)
  n: 4,                      // Grid size
  boxless: false,            // Use boxes?
  double: false,             // Two layers?
  easyFirst: true,           // Show first-move guide?
  description: "...",
  tutorial: {
    title: "Welcome to Chromoku!",
    body: "...",
    diagram: "<div>...</div>"
  }
}
```

### Future Tutorial Variants
```javascript
const TUTORIAL_VARIANTS = {
  main: { name: "Main Tutorial (7 days)", levels: ["1", "2", "3", "4", "5", "6", "7"] },
  "latin-double": { name: "Latin Double (planned)", levels: [] },
  "half-latin": { name: "Half Latin Double (planned)", levels: [] },
  "symbols": { name: "Symbols & Combos (planned)", levels: [] },
};
```

---

## 🎨 Styling

### Colors (Light Theme)
- Background: `#f7f7f8`
- Panel: `#fff`
- Text: `#17172b`
- Accent: `#c9a227` (gold)

### Colors (Dark Theme)
- Background: `#14141f`
- Panel: `#1e1e2e`
- Text: `#ececf4`
- Accent: Same gold

### Responsive
- Mobile-first, `max-width: 460px`
- `@media (min-width: 520px)` for desktop tweaks

---

## 🔧 Common Changes

### Add a New Tutorial Day
1. Add to `TUTORIAL_DAYS` array
2. Set `givens`, `n`, `boxless`, `double`, `easyFirst`
3. Add `tutorial.title`, `body`, `diagram`
4. Test with admin "Jump to day" button

### Change Difficulty
- Increase `givens` → more pre-filled → easier
- Day 6 (9×9): currently 50 givens (very easy for tutorial)

### Adjust Ad Placement
- Banner: Bottom of screen (HTML around line 317)
- Video: Below banner (HTML around line 323)
- Toggle visibility in admin panel

### Add Time Adjustment Logging
- Currently captures input in `state.timeAdjust`
- Connect to backend later (not implemented yet)

---

## 📝 Before You Start Each Session

- [ ] Read this file (ensures no context loss)
- [ ] `git pull origin claude/chromoku-monetization-vpbvnj`
- [ ] Open dev.html locally or via raw URL
- [ ] Test on device (computer/phone)
- [ ] Make changes
- [ ] Commit + push
- [ ] Next session reads this file again

---

## ❓ FAQ

**Q: Why is it public if we're building a game?**  
A: Development/testing needs easy HTML serving. Deploy to Cloudflare (private CDN) for launch. Open now, closed later.

**Q: Where do I work—computer or phone?**  
A: Either. Git is the source of truth. Clone locally or use raw GitHub URLs. Each session syncs via git pull.

**Q: What if I forget something?**  
A: This file. Read it every session. It's the canonical record.

**Q: How do I avoid losing progress between sessions?**  
A: Commit and push. Git is your backup. Clone/pull at the start of each session.

**Q: When do we move to Cloudflare?**  
A: When ready to beta test. One-time setup (5 min). Then every push auto-deploys.

---

## 🚀 Next Steps

1. **Today**: Playtest all 7 days, verify mechanics
2. **This week**: Iterate on difficulty, refine ad UI
3. **Beta phase**: Deploy to Cloudflare, share with testers
4. **Feedback loop**: Collect time adjustments, iterate
5. **Production**: Polish, add real ads, launch

---

**Remember**: This file is the single source of truth. If something changes, update it here first. Every session starts by reading this. No regression, no surprises.
