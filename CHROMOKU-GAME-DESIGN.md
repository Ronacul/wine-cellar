# Chromoku — Game Design & Daily System

**Last updated:** 2026-08-22  
**Status:** Design planning (pre-development)  
**Game Model:** Hybrid (Daily puzzles + Classic levels)

---

## Core Game Vision

**Chromoku** is a daily colour puzzle game with:
- **Daily challenges** with escalating weekly difficulty (NYT Crossword model)
- **Two puzzle types/sizes** staggered on different start dates (maximum coverage)
- **Streaks & stats** tracking (engagement hooks)
- **Shareable results** (social virality)
- **Optional Classic levels** (deeper engagement for power users)

**Target player:** Casual daily player (5 min/day) + power users who want more (20–60 min).

---

## Daily Puzzle System

### Two Puzzle Types with Staggered Schedules

#### Puzzle Type A: "Quick" (5x5 grid, Monday start)
```
Monday:    Easy   (2 min, simple color groups)
Tuesday:   Easy   (2 min, simple color groups)
Wednesday: Medium (3 min, more color varieties)
Thursday:  Medium (3 min, more color varieties)
Friday:    Hard   (4 min, complex color patterns)
Saturday:  Hard   (4 min, complex color patterns)
Sunday:    Extreme (5 min, 8+ colors, intricate)

Cycle: Repeats weekly
Start date: Monday (UTC)
Frequency: One per day
Replayability: No (new puzzle daily)
```

#### Puzzle Type B: "Extended" (7x7 grid, Thursday start)
```
Thursday:  Medium (4 min, larger grid, medium difficulty)
Friday:    Medium (4 min, larger grid, medium difficulty)
Saturday:  Hard   (5 min, complex patterns)
Sunday:    Hard   (5 min, complex patterns)
Monday:    Extreme (6 min, very complex, 10+ colors)
Tuesday:   Extreme (6 min, very complex, 10+ colors)
Wednesday: Insane (7 min, maximum difficulty, 12+ colors)

Cycle: Repeats weekly
Start date: Thursday (UTC)
Frequency: One per day
Replayability: No (new puzzle daily)
```

### Schedule Coverage

```
Any given day, user sees:
├─ One "Quick" puzzle (5x5)
├─ One "Extended" puzzle (7x7)
└─ Both active simultaneously (can play in any order)

This ensures:
├─ Always fresh content
├─ Casual players have an "easy out" (Quick mode)
├─ Power users have a challenge (Extended mode)
└─ Flexibility (choose size based on mood/time)
```

### Weekly Difficulty Curve

| Day | Quick (5x5) | Extended (7x7) | Overlap | Difficulty |
|-----|-------------|----------------|---------|-----------|
| Mon | Easy | — | Quick only | Low |
| Tue | Easy | — | Quick only | Low |
| Wed | Medium | — | Quick only | Medium |
| Thu | Medium | Medium | Both | Medium |
| Fri | Hard | Medium | Both | Medium–High |
| Sat | Hard | Hard | Both | High |
| Sun | Extreme | Extreme | Both | Very High |

**Pattern:** Difficulty ramps Thu–Sun (dual puzzles), then resets Mon–Wed (Quick only).

---

## Engagement System

### Streaks

#### Daily Streak (Core Hook)
```
Streak Definition:
├─ Consecutive days solving at least ONE puzzle
├─ Can solve Quick OR Extended (one is enough)
├─ Resets at 4 AM UTC (next day)
└─ Survives missed days? No (strict streak)

Display:
├─ Show on home screen: "🔥 7 Day Streak"
├─ Color gradient: 1–3 (gray), 4–7 (gold), 8–14 (🔥), 15+ (🌟)
└─ Motivational: "Don't break the chain"
```

#### Weekly Challenge Bonus
```
Complete all 7 days:
├─ Special badge: "Perfect Week ⭐"
├─ Achievement: unlock cosmetic (background, avatar theme)
└─ Streak milestone: every 4 weeks = unlock cosmetic tier
```

### Stats (Shareable)

#### Personal Stats (User Profile)
```
All-time:
├─ Total puzzles solved
├─ Completion rate (% of available puzzles)
├─ Best streak (longest consecutive days)
├─ Current streak
└─ Favorite puzzle type (Quick vs Extended)

This week:
├─ Days completed (visual week grid)
├─ Average time per puzzle
├─ Fastest solve (Quick + Extended separate)
└─ "On pace for X-day streak"

Monthly/Yearly:
├─ Heatmap of active days (GitHub-style)
├─ Solve count by type
└─ Trend (improving/declining)
```

#### Shareable Cards (Social)

**After solving a daily puzzle, user can share:**

```
Quick Puzzle Share Card:
┌─────────────────────┐
│  Chromoku Quick ✓   │
│  Mon, Aug 25 - Easy │
│  Time: 2m 15s       │
│  Streak: 🔥 7 days  │
│                     │
│  [Tap to compare]   │
│  chromoku.dev/...   │
└─────────────────────┘
```

```
Extended Puzzle Share Card:
┌─────────────────────┐
│ Chromoku Extended ✓ │
│ Thu, Aug 25 - Hard  │
│ Time: 4m 32s        │
│ Streak: 🔥 12 days  │
│                     │
│ [Tap to compare]    │
│ chromoku.dev/...    │
└─────────────────────┘
```

**Shareable content:**
- Emoji grid (like Wordle) showing attempt pattern
- Time to solve
- Current streak
- Link to compare results with friends
- No spoilers (emoji grid is abstract)

**Example emoji grid:**
```
🟨 🟩 🟩
🟨 🟩 🟩
🟨 🟨 🟩
```

(Pattern shows attempts/moves, not solution)

### Comparison Links

**User shares:** `chromoku.dev/compare/abc123def456`

**Friend opens link:** 
```
Side-by-side comparison:
├─ User A: 2m 15s (you are here)
├─ User B: 2m 18s
├─ User C: 3m 05s (slowest)
└─ User D: 1m 50s (fastest today)

See leaderboard for this puzzle
```

**Leaderboard (Optional, Per-Day):**
```
Mon Aug 25 - Quick Easy

🥇 User_B      1m 22s
🥈 User_A      2m 15s
🥉 User_C      2m 38s
   User_D      3m 05s
   User_E      4m 10s
```

(Top 5, but no personal data exposed unless shared voluntarily)

---

## Technical Implementation

### Daily Puzzle Generation/Storage

#### Pre-Generated (Recommended)
```
Approach: Pre-design/generate 52 weeks of puzzles (156 puzzles total)
├─ 52 Quick puzzles (Mon–Sun cycle × 52 weeks)
├─ 52 Extended puzzles (Thu–Wed cycle × 52 weeks)
└─ 52 bonus/seasonal puzzles (optional)

Storage:
├─ puzzles.json: Array of puzzle objects
├─ Each puzzle: {id, type, size, difficulty, colors, solution, created_date, ...}
└─ Deployed with app (no server needed)

Pros:
├─ No server required
├─ Consistent difficulty calibration
├─ No generation overhead
└─ Puzzles can be pre-tested

Cons:
├─ Requires design effort upfront
├─ Limited scalability (52 weeks repeats)
├─ Manual updates for new seasons
```

#### AI-Generated (Alternative)
```
Approach: Generate puzzles on-demand via Gemini API
├─ When user opens app, check if today's puzzle exists
├─ If not, generate via Gemini (seed by date + type)
├─ Cache in localStorage

Pros:
├─ Infinite variety (no repetition)
├─ Scales easily (just regenerate weekly)
└─ Can adjust difficulty dynamically

Cons:
├─ API cost (~$0.01–0.05 per puzzle)
├─ Generation delay (~2–5 sec on first load)
├─ Less consistent quality
└─ Requires Gemini API key
```

**Recommendation:** Start with **pre-generated** (simpler, more reliable). Can switch to AI-generated if you want infinite variety.

### Data Storage (Client-Side)

#### localStorage Structure
```javascript
{
  // User progress
  "chromoku.streaks": {
    current: 7,
    best: 21,
    lastPlay: "2026-08-25T04:00:00Z"
  },
  
  // Solved puzzles (by date)
  "chromoku.solved": {
    "2026-08-25": {
      quickEasy: {solved: true, time: 135, attempts: 1},
      extendedHard: {solved: true, time: 272, attempts: 3}
    },
    "2026-08-24": {
      quickMedium: {solved: true, time: 180, attempts: 2},
      extendedMedium: {solved: false, attempts: 5}  // incomplete
    }
  },
  
  // Stats
  "chromoku.stats": {
    totalSolved: 125,
    totalAttempts: 200,
    completionRate: 0.88,  // 88% of available puzzles
    fastestTime: 45  // seconds
  },
  
  // User profile
  "chromoku.profile": {
    id: "user-abc123",  // Anonymous ID (no email unless IAP)
    createdDate: "2026-01-15",
    favoriteType: "quick"
  }
}
```

#### Syncing to GitHub (Optional)
```
If user enables GitHub sync:
├─ Encrypt localStorage data
├─ Upload to GitHub gist (anonymous)
├─ On new device, download gist and restore
└─ Allows cross-device sync without backend

Opt-in, not default (privacy-first)
```

---

## Monetization Integration (Daily Puzzles)

### No Ads/IAP in Daily Puzzles (Pure)
```
Daily challenge mode:
├─ Completely ad-free
├─ No IAP (no "skip" button)
├─ No premium features
└─ Goal: build habit and trust

Why:
├─ Daily ritual should be pure (like Wordle)
├─ One puzzle/day = low ad opportunity anyway
├─ Streaks are the reward, not money
```

### Monetization Hooks (Subtle, Non-Intrusive)
```
After solving:
├─ Optional: "Try Classic Levels" (promo, leads to Level 1)
├─ Optional: "Share Your Time" (social, no ads)
├─ Optional: "View Leaderboard" (no ads)
└─ NO ads in daily mode

Banner (bottom of screen, always visible):
├─ "Classic Levels" button (leads to levels section)
├─ Shows: "50 levels to unlock" or "Beat your best time"
└─ Non-intrusive (not modal, not pop-up)
```

### Ads/IAP in Classic Levels (Separate)
```
Classic Levels Mode (separate tab):
├─ Ads: Yes (interstitial between levels, rewarded for hints)
├─ IAP: Yes (lives, boosters, remove ads)
├─ Monetization-heavy (this is the cash engine)
└─ Different feel from daily (expected to be monetized)
```

---

## User Flow

### First-Time User (Onboarding)

```
1. Open app
   └─ "Welcome to Chromoku!"

2. Choose mode:
   ├─ "Daily Puzzle" (headline)
   │  └─ "One new puzzle every 24 hours"
   └─ "Classic Levels" (secondary)
      └─ "Unlimited puzzles with progression"

3. Play today's daily
   ├─ Start with today's "Quick" puzzle (Monday = easy)
   ├─ After solving: "Try Extended?"
   └─ After both: See stats, streak, share options

4. Optional: Try Level 1
   └─ "Like it? Unlock all 50 levels"
```

### Returning User (Daily Ritual)

```
1. Open app
   └─ See streaks + "Today's Puzzles"

2. Play Quick (2 min)
   └─ "Streak: 🔥 7 days"

3. Play Extended (5 min, optional)
   └─ "Both solved! Perfect day."

4. Share results (optional)
   └─ "View leaderboard" or "Share with friends"

5. Done for the day
   └─ "See you tomorrow!"
```

### Power User (Daily + Levels)

```
1. Solve daily Quick + Extended (7 min)
2. Play 3–5 Classic Levels (20 min)
3. Buy hints/lives if needed (IAP, $1–3)
4. Progress through levels, build streak
5. Share daily results + compete on leaderboard
```

---

## Difficulty Calibration

### Color Difficulty Scale

**Easy (Monday):**
```
Grid: 5x5 (25 cells)
Colors: 3–4 distinct colors
Moves: ~5–8 optimal moves to solve
Visual complexity: Low (large color blocks)
Time: ~2 minutes
```

**Medium (Wed–Fri):**
```
Grid: 5x5 or 7x7
Colors: 5–6 colors
Moves: ~10–15 optimal moves
Visual complexity: Medium (mixed block sizes)
Time: ~3–5 minutes
```

**Hard (Sat):**
```
Grid: 7x7 (49 cells)
Colors: 6–8 colors
Moves: ~15–20 optimal moves
Visual complexity: High (intricate patterns)
Time: ~5–6 minutes
```

**Extreme/Insane (Sun/Wed in Extended):**
```
Grid: 7x7 or larger
Colors: 8–12+ colors
Moves: ~20–30+ optimal moves
Visual complexity: Very high (near-maximum)
Time: ~6–10 minutes
Strategy: Requires planning (not trial-and-error)
```

### Testing & Balance

Before launch:
```
[ ] Playtest each puzzle (Mon–Sun, both types)
[ ] Time each puzzle (ensure stated difficulty is accurate)
[ ] Verify no impossible puzzles
[ ] Get feedback from beta testers (average solve time)
[ ] Adjust color count / grid size if too hard/easy
```

---

## Analytics to Track

### For Design Feedback

```
Daily:
├─ Completion rate (% of users who solve each day)
├─ Average solve time (by difficulty)
├─ Abandoned rate (start but don't finish)
├─ Retry count (how many attempts before solve)
└─ Leaderboard engagement (% who view)

Trends:
├─ Weekday engagement (which days see most activity)
├─ Difficulty perception (which puzzles too hard?)
├─ Streak retention (% losing streaks after day 7)
└─ New vs returning (cohort analysis)
```

### For Business

```
├─ Daily active users (DAU)
├─ Retention (day 1, day 7, day 30)
├─ Conversion to Classic Levels (% clicking "Try Levels")
├─ IAP conversion rate (% buying "Remove Ads")
├─ Session time (avg min per day)
└─ Churn rate (% abandoned after N days)
```

---

## Seasonal Updates

### Quarterly Content Refresh

**Q1 (Jan–Mar):** Winter theme + holiday puzzles  
**Q2 (Apr–Jun):** Spring theme + pastel colors  
**Q3 (Jul–Sep):** Summer theme + bright colors  
**Q4 (Oct–Dec):** Autumn theme + special holiday events  

Each quarter:
```
[ ] Design 13 new weekly cycles (daily + extended)
[ ] Test difficulty calibration
[ ] Update UI theme / colors
[ ] Announce via email / social
```

### Special Events (Optional)

```
Holidays (Christmas, New Year, etc):
├─ Special daily puzzles (themed)
├─ Limited-time cosmetics (badges, avatars)
└─ Double XP / streak bonus

Milestone Events:
├─ "100 Days Solved" challenge
├─ Leaderboard competitions
├─ User-generated puzzles (community mode)
```

---

## UI/UX (High Level)

### Main Tabs

```
1. "Daily" (home, default)
   ├─ Today's Quick + Extended puzzles
   ├─ Current streak display
   ├─ Stats summary
   └─ Share buttons

2. "Classic" (levels)
   ├─ Level progression (1–50)
   ├─ Lives / boosters
   ├─ Ads
   └─ IAP prompt

3. "Profile" (stats)
   ├─ All-time stats
   ├─ Weekly heatmap
   ├─ Leaderboard
   └─ Settings

4. "Settings"
   ├─ Notifications (reminder at 9 AM?)
   ├─ Color theme (light/dark)
   ├─ Volume / accessibility
   └─ Privacy / data deletion
```

### Daily Puzzle UI (Post-Solve)

```
┌─────────────────────────┐
│  Daily Challenge ✓      │
├─────────────────────────┤
│  Monday - Quick - Easy  │
│                         │
│  ⏱️ 2m 15s             │
│  🎯 1 attempt           │
│  🔥 7-Day Streak       │
│                         │
│  [Share Result]         │
│  [Try Extended]         │
│  [View Leaderboard]     │
│                         │
│  — or —                │
│  [Play Classic Levels]  │
└─────────────────────────┘
```

---

## Success Metrics (Launch)

### Week 1
```
[ ] Daily completion rate > 50% (users finishing both)
[ ] Avg solve time matches designed difficulty
[ ] Sharing working (no bugs)
[ ] No crash on iOS/Android
```

### Month 1
```
[ ] DAU > 100
[ ] Day-7 retention > 30%
[ ] Avg streak length > 3 days
[ ] 5–10% converting to Classic Levels
```

### Month 3
```
[ ] DAU > 500
[ ] Day-30 retention > 20%
[ ] Avg streak length > 7 days
[ ] 10–15% converting to Classic Levels
[ ] Leaderboard generating social shares
```

---

## Ad & Monetization Integration

### Daily Mode: Light-Touch (No Forced Ads)

**Philosophy:** Daily should feel **pure** (like Wordle). Virality depends on users sharing, not being frustrated.

```
Banner ads:
├─ Location: Bottom of screen (subtle, always visible)
├─ Placement: Only on home/daily puzzle screens
├─ Frequency: Passive (not counted in ad load)
└─ Impact: ~$0.01/user/day in ad revenue

Rewarded video ads (optional, user-opted):
├─ Trigger: After 3+ failed attempts on a puzzle
├─ Popup: "Need help? Watch 15s for hint" (user chooses)
├─ Reward: Reveals one solution cell, gives undo move, or adds time
├─ Frequency: 0–1 per day (depends on difficulty)
└─ Impact: ~$0.04–0.07/user/day in ad revenue

Total daily revenue:
├─ Per user: $0.05–0.08/day
├─ At 700 daily players: ~$35–56/month
└─ High retention (users not ad-burdened)
```

### Levels Mode: Standard Monetization (Ads + IAP)

**Philosophy:** Levels players **expect** ads (trial ends with paywall). Monetization is transparent.

```
Banner ads:
├─ Location: Bottom (mobile) or right sidebar (desktop)
├─ Placement: Always visible, home/level select screens
├─ Frequency: Passive (1 per page load)
└─ Impact: ~$0.08/user/day in ad revenue

Interstitial ads (between levels):
├─ Trigger: After completing level (every 3rd level, not aggressive)
├─ Format: Full-screen, 10–30 sec
├─ Frequency: ~0.3 per session (spaced out)
├─ Impact: ~$0.12/user/day in ad revenue

Rewarded video ads (for power-ups):
├─ Trigger: User clicks "Hint", "Undo", "Extra Time" buttons
├─ Format: Optional (user chooses to watch)
├─ Reward: Instant power-up (hint, undo, time extension)
├─ Frequency: ~0.2 per session (user-driven)
└─ Impact: ~$0.04/user/day in ad revenue

In-App Purchases (IAP):
├─ Remove Ads ($2.99): Removes interstitials, keeps banner
├─ Boosters ($0.99–1.99): Time extension, hint packs, undo packs
├─ Lives refill ($1.99): Instantly refill 5 lives (if lives system added later)
├─ Conversion rate: 10–15% of levels players
└─ Impact: ~$0.10–0.15/user/day in IAP revenue

Total levels revenue:
├─ Per user per day: $0.30–0.45 (ads) + $0.10–0.15 (IAP) = $0.40–0.60
├─ At 300 levels players: ~$120–180/month
└─ Monetization-transparent (users expect it)
```

### Difficulty-Driven Monetization (Key Design Insight)

**Harder puzzles naturally create more monetization opportunities:**

```
Progression by level:

Levels 1–10 (Easy, 2–3 min each):
├─ Hints needed: <5% of players
├─ Ad touchpoints: 1 banner
├─ Revenue: Minimal ($0.01/user/day)
└─ Goal: Hook players with success

Levels 11–30 (Medium, 5–8 min each):
├─ Hints needed: 10–20% of players
├─ Ad touchpoints: 1 banner + 1 interstitial + 0.1 rewarded
├─ Revenue: Low ($0.10/user/day)
└─ Goal: Build skill, introduce monetization

Levels 50–100 (Hard, 10–15 min each):
├─ Hints needed: 30–40% of players
├─ Ad touchpoints: 1 banner + 1 interstitial + 0.2 rewarded + IAP offer
├─ Revenue: Medium ($0.25/user/day)
└─ Goal: Challenge players, monetize help-seekers

Levels 150–200 (Very Hard, 15–20 min each):
├─ Hints needed: 50–60% of players (stuck = reaching for help)
├─ Ad touchpoints: 1 banner + 1 interstitial + 0.3 rewarded + IAP boosters
├─ Revenue: High ($0.40/user/day)
└─ Goal: Progression feels earned, monetization feels earned

Levels 250+ (Extreme, 20–30 min each):
├─ Hints needed: 70%+ of players (nearly all get stuck)
├─ Ad touchpoints: 1 banner + 1 interstitial + 0.5 rewarded + IAP bundles
├─ Revenue: Very high ($0.50+/user/day)
├─ IAP conversion: 20%+ (players invested, willing to pay)
└─ Goal: Hardcore players are your most valuable audience
```

**Why this works:**
1. Players **invest time** as they progress → sunk cost → more willing to help themselves
2. Difficulty **increases naturally** → hints become necessary → monetization feels earned
3. No early-game ads → users build habit before seeing monetization
4. Late-game ads → only shown to players who've proven commitment

### Power-Up Mechanics (Ad-Enabled)

```
Three power-ups, each with ad watch option:

1. Hint (reveals one solution cell):
   ├─ Free: 1 per day (reset daily)
   ├─ Ad watch: 15s video = 1 instant hint (unlimited)
   └─ IAP: Hint pack (10 hints for $1.99)

2. Undo (revert last 1–3 moves):
   ├─ Free: 1 per level (reset per level)
   ├─ Ad watch: 15s video = 1 instant undo (unlimited)
   └─ IAP: Undo pack (10 undos for $0.99)

3. Time Extension (add 2 min to timer):
   ├─ Free: Refill once per day
   ├─ Ad watch: 15s video = 2 min instant (unlimited)
   └─ IAP: Time pack (5 extensions for $0.99)

Policy:
├─ Players see free option first (limits = daily/per-level)
├─ If free used up, show "Watch ad for instant" button
├─ If frustrated by ads, offer "Remove ads permanently" ($2.99)
└─ Players who pay are never shown ads again (respect their choice)
```

### Analytics to Refine

From Day 1, track:
```
├─ Which levels see highest hint-watching?
├─ At what level do players start paying for IAP?
├─ Do desktop/mobile have different ad tolerance?
├─ What time of day sees most rewarded video completion?
├─ How does difficulty affect ad CTR?
└─ Adjust ad frequency + IAP pricing monthly based on data
```

---

## Next Steps

1. **Design the first 52 weeks of puzzles** (26 Quick × 2 + 26 Extended × 2)
   - Can outsource to freelancer or DIY
   - ~2–4 hours per puzzle type per week
   
2. **Build puzzle generation/storage** (if AI-generated: Gemini API)
   
3. **Implement daily logic** (timezone-aware, cache, resets)
   
4. **Build sharing + leaderboard** (basic, client-side only)
   
5. **Integrate with monetization** (AdMob in Classic, none in Daily)
   
6. **Beta test** (internal + friends)
   
7. **Launch!**

---

**Reference:** This design pairs with CHROMOKU-BUSINESS.md (monetization) and will guide development in parallel.
