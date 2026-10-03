# Chromoku — Launch Plan, Revenue Strategy & Next Steps

## Current state (August 2026)

**Playable, installable, not yet deployed.** The game lives in `chromoku/` as a
single-file PWA with manifest, service worker, and icons. Everything runs
client-side — no backend, no accounts, no analytics. Progress is in
localStorage.

### What's built

| Feature | Status |
|---|---|
| Core puzzle engine (4–16×16, Latin, Double) | ✅ shipped |
| 500-level progression across 5 worlds | ✅ shipped |
| Three mark sets (colour, shapes, patterns) | ✅ shipped |
| Daily puzzles (seeded from date) | ✅ shipped |
| Lives system (5 lives, 20-min regen, timer fail) | ✅ shipped |
| Hints (reveal, freeze, add time, star penalty) | ✅ shipped |
| Share badge (canvas image, Web Share API) | ✅ shipped |
| Difficulty rater (T0–T3 with naked/hidden pairs) | ✅ shipped |
| Per-technique timing model | ✅ shipped |
| Undo, bookmark, crash recovery | ✅ shipped |
| PWA packaging (offline, installable) | ✅ shipped |
| Accessibility (patterns, shapes, no colour-only) | ✅ shipped |
| Deployment (Cloudflare Pages, custom domain) | 🔲 ready, not wired |
| Own repo (private) | 🔲 needs account permission |
| Accounts / backend | 🔲 not started |
| Monetisation | 🔲 not started |
| Analytics | 🔲 not started |

### What's missing before "launch"

1. **Deploy to a URL** — Cloudflare Pages from a private repo, free tier,
   automatic TLS. Custom domain (chromoku.com or similar, ~$10/yr).
2. **Basic analytics** — privacy-friendly page-view counter (Cloudflare Web
   Analytics is free, no cookies, GDPR-compliant). Just enough to know DAU.
3. **Social sharing that works** — the share badge is built; it needs a landing
   page that makes the shared image clickable back to the game.

---

## How breakout games actually launched

### Flappy Bird (2014) — accidental virality

- **Made in 3 days** by one person (Dong Nguyen, Vietnam).
- **Sat dormant for 8 months** after May 2013 iOS launch. Zero marketing.
- **Went viral January 2014** through organic social sharing — players screenshotting
  scores and posting frustration memes. YouTubers picked it up.
- **50M downloads, ~$50K/day in ad revenue** at peak. Revenue was 100% interstitial
  ads (AdMob). No IAP, no rewarded video — just banner and interstitial.
- **Pulled by creator** after 3 weeks at #1 due to personal stress.

**Lesson:** Extreme simplicity + punishing difficulty + screenshot-worthy moments
= organic social spread. No marketing budget. The game *was* the marketing. But
this is a lottery ticket, not a strategy.

### Wordle (2021–2022) — designed for sharing

- **Built for two people** by Josh Wardle as a gift for his partner. Released to
  the public October 2021.
- **90 → 300K → millions** of daily players in three months. No app, no ads,
  no accounts — just a web page.
- **The sharing mechanic was the growth engine:** coloured-square grids posted to
  Twitter were spoiler-free, visually distinctive, and made non-players curious.
  Each shared result was a tiny ad for the game.
- **One puzzle per day** created scarcity and ritual. Players came back daily
  because missing a day broke a streak — and because they wanted to compare
  with friends.
- **Acquired by NYT for $1M+** in January 2022. Now part of NYT Games alongside
  Connections, Spelling Bee, and the Crossword.

**Lesson:** The shareable result grid was Wordle's entire growth engine. One
puzzle per day made it a habit. Free + web + no login = zero friction. The
acquisition validates that daily puzzle games with retention are worth
seven figures *before* monetisation.

### Angry Birds (2009–2012) — paid to free to ecosystem

- **$0.99 paid app**, iOS only at launch (December 2009). Rovio was nearly
  bankrupt — Angry Birds was their 52nd game.
- **Polished for one platform** instead of shipping everywhere at once. Touch
  physics was genuinely novel in 2009.
- **Went free-to-play in 2012** (Angry Birds 2). Revenue shifted from download
  to IAP + rewarded video. By 2018, 89% IAP / 11% ads.
- **Merchandising** (toys, movies, theme parks) eventually dwarfed game revenue.
- **Peak: 263M monthly active users** (December 2012).

**Lesson:** One polished experience on one platform beats a thin one on five.
The F2P pivot was where real money came — and the rewarded video economy only
works inside a native app container (AdMob, AppLovin, ironSource are all
SDK-based).

### Bejeweled / Candy Crush (match-three evolution)

- Bejeweled (2001) was a paid PC game, then a paid mobile game.
- **Candy Crush Saga (2012) cracked the code:** free, Facebook-connected,
  energy/lives system, level gating, boosters as IAP. King made $1.88B in
  2013 from Candy Crush alone.
- The critical insight: **the monetisation *is* the design.** Lives create demand
  for more lives. Levels create demand for boosters. Difficulty spikes create
  demand for both. Every design decision is a revenue decision.

**Lesson:** This works at scale with marketing spend (King spent heavily on
Facebook ads and cross-promotion). Not replicable at indie scale without
capital — but the game-design-as-monetisation principle applies everywhere.

---

## What Chromoku should learn from this

### Wordle is the closest analogue

| Wordle | Chromoku |
|---|---|
| Daily word puzzle, one per day | Daily colour puzzle, multiple per day |
| 5-letter grid, sharable result | n×n board, canvas share badge |
| Web-only, no app, no login | PWA, installable, no login |
| Coloured squares as share format | Rendered board image as share |
| Free, no ads, no IAP | Free, no ads (yet) |
| Acquired by NYT | — |

**Chromoku's share badge is the equivalent of Wordle's coloured squares.** The
badge shows the solved board as an image — visually striking, spoiler-free
(colours mean nothing without the grid's constraint structure), and
curiosity-provoking. This is the growth engine. Everything else is secondary
until this works.

### The daily ritual is the retention loop

One puzzle per day + streaks = habitual return. Chromoku already has this. What
it doesn't have:

- **A streak counter visible in the share** — "Chromoku #47 · Hard ✨ 🔥12" tells
  the viewer this person has been playing for 12 days straight. Social proof +
  competitive pressure.
- **A group/friend comparison** — Wordle spread through group chats. Chromoku
  needs to give friend groups a reason to compare (same puzzle, different times).

### The app store is where the money is — but not where the growth is

| Path | Growth | Revenue |
|---|---|---|
| Web (PWA) | High (URL sharing, zero friction) | Low ($3–5 RPM display ads) |
| Native app | Low (store discovery is pay-to-play) | High (rewarded video $15–40 eCPM) |
| Web → app funnel | Best of both | Best of both |

**Strategy: launch on the web, grow on the web, convert to app later.**

The web is where Wordle grew. The app store is where Candy Crush earns. The
mistake is trying to be in the app store on day one — store discovery is
dominated by companies spending $1–10 per install on UA. An indie game with no
budget will rank nowhere.

But an indie game with 10,000 daily web players can wrap the same PWA in a
TWA (Android) or Capacitor (iOS) and point the existing audience at a store
listing. The audience already exists; the store just adds rewarded video and
one-tap payment.

---

## Revenue model (staged)

### Phase 0 — Now: Free, no ads, grow

- Deploy to Cloudflare Pages with a custom domain
- Focus entirely on the share mechanic and daily ritual
- Goal: **1,000 daily players organically** through share badge virality
- Cost: $10/yr domain, $0 hosting

### Phase 1 — Retention proven: Lightweight monetisation

When DAU is consistent (not growing — just not churning):

- **Tip jar / "buy me a coffee"** — test willingness to pay, zero complexity
- **Cosmetic unlocks** (palette themes, board skins) — sold for a small one-time
  payment via Stripe, no backend needed (unlock code in localStorage, honour
  system). Revenue won't be meaningful but proves the market.
- **Hint packs** — the hint system is built; hints could be replenishable via
  purchase rather than per-puzzle caps. This is the "sell helpers" model.
- Cost: Stripe account ($0 fixed, 2.9% + 30¢ per transaction)

### Phase 2 — Scale: App wrapper + rewarded video

When DAU reaches ~5,000–10,000 consistently:

- **TWA wrapper for Google Play** (Bubblewrap, free, same PWA, no native code)
- **Capacitor wrapper for iOS App Store** ($99/yr Apple developer account)
- **Rewarded video ads** via AdMob: "Watch an ad for an extra life" or "Watch an
  ad for a free hint." This is the money mechanic.
- At 10K DAU with 60% opt-in, 2 views/DAU, $20 eCPM:
  **~$240/day = ~$7,200/month**
- **In-app hint packs** via store payment: $1.99 for 10 reveals, $0.99 for 5
  freezes. Apple/Google take 30% but conversion is 3–5× web Stripe.

### Phase 3 — If it works: Backend, accounts, social

- **Accounts** (Google/Apple sign-in) for cross-device sync
- **Leaderboards** (friends, global) — daily puzzle time rankings
- **Entitlements server** — hints and cosmetics can't be forged in devtools
- Backend: Cloudflare Workers (free tier covers ~100K requests/day)

---

## Deployment plan

### Step 1: Private repo

Create `chromoku` as a private repo on GitHub. Move `chromoku/` contents to root.
Keep `wine-cellar` as-is — Chromoku development has just been using it as a
workspace.

### Step 2: Cloudflare Pages

1. Sign up at dash.cloudflare.com (free)
2. Create a Pages project connected to the private GitHub repo
3. Build command: (none — it's a static file)
4. Output directory: `/`
5. Deploy → live at `chromoku.pages.dev`

### Step 3: Custom domain

1. Register `chromoku.com` (or `.app`, `.game`) — ~$10–12/yr
2. Add as custom domain in Cloudflare Pages dashboard
3. If domain is on Cloudflare DNS: instant. Otherwise: add CNAME record.
4. TLS provisioned automatically

### Step 4: Analytics

Add Cloudflare Web Analytics beacon (free, no cookies, GDPR-compliant):
```html
<script defer src='https://static.cloudflareinsights.com/beacon.min.js'
  data-cf-beacon='{"token": "YOUR_TOKEN"}'></script>
```

This gives page views, unique visitors, and referrers — enough to know DAU
and where traffic comes from.

---

## Next steps (build order)

### Immediate (before deploy)

1. **Create private repo** — move `chromoku/` to its own repo root
2. **Deploy to Cloudflare Pages** — get a live URL
3. **Landing page / meta tags** — when someone shares the badge, the link preview
   (og:image, og:title) should look good in iMessage, WhatsApp, Twitter
4. **Streak in share badge** — add the streak count to the canvas render
5. **Service worker cache update** — the current SW caches forever; needs a
   version-bump strategy so deploys actually reach players

### Short-term (first month live)

6. **Playtest with real humans** — share the URL with 10–20 people, watch for
   confusion points, collect "Copy my stats" data to calibrate TUNE
7. **Share flow polish** — test on iOS Safari, Android Chrome, desktop. Fallback
   paths matter more than the happy path.
8. **Daily notification** (optional) — PWA push notification at a chosen time:
   "Your daily Chromoku is ready." High-retention signal.
9. **Tutorial refinement** — the help modal is text-heavy. A 3-step interactive
   tutorial would convert better.

### Medium-term (months 2–3)

10. **Cosmetic unlocks** — 3–5 board themes (dark cellar, ocean, sunset) as
    proof-of-concept for willingness to pay
11. **Friend comparison** — share a link that shows your solve alongside the
    viewer's (if they've played the same puzzle). Social comparison drives repeat
    visits.
12. **TUNE calibration** — with real play data from "Copy my stats," adjust
    per-technique timing and generosity curve

### If traction (1,000+ DAU)

13. **App store wrappers** — TWA (Android) and Capacitor (iOS)
14. **Rewarded video integration** — AdMob SDK in the native wrapper
15. **Accounts** — Google/Apple sign-in, Cloudflare Workers backend
16. **Leaderboards** — daily puzzle rankings among friends

---

## Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Nobody plays | High | Fatal | Playtest → iterate before marketing |
| Shares don't convert to new players | Medium | High | A/B test badge design, landing page |
| iOS Safari breaks localStorage | Low | High | PWA install prompt, service worker cache |
| Someone clones the game | Medium | Low | First-mover + daily puzzle = retention moat |
| Rewarded video doesn't pay on web | Known | Medium | App wrapper is the plan, not web ads |
| App store rejection | Low | Medium | TWA/Capacitor are established paths |
| TUNE constants are wrong | High | Low | "Copy my stats" → real data → recalibrate |

---

## Revenue projections (honest)

These are industry benchmarks applied to Chromoku's genre, not projections.

| DAU | Web-only | With native app + rewarded video |
|---|---|---|
| 100 | $0 (no ads) | $0 (not worth wrapping) |
| 1,000 | $3–5/day display | $12–60/day rewarded |
| 5,000 | $15–25/day display | $60–300/day rewarded |
| 10,000 | $30–50/day display | $120–600/day rewarded |
| 50,000 | $150–250/day display | $600–3,000/day rewarded |

**The gap between web-only and native rewarded video is 5–10×.** This is why
every successful web puzzle game eventually ships an app. The web is for
growth; the app is for revenue.

At 10K DAU with a native app, the realistic range is **$3,600–$18,000/month**
from ads alone, before any IAP. That's the number that justifies the $99
Apple account and the development time for the wrapper.

---

## Comparable acquisitions

| Game | DAU at acquisition | Price | Acquirer |
|---|---|---|---|
| Wordle | ~2M | ~$1M (low seven figures) | New York Times |
| Connections (built in-house) | — | — | NYT Games |
| 2048 (never acquired) | ~10M peak | $0 (open source, cloned) | — |

Wordle's price was low because it had no revenue, no backend, no app. It was
pure audience. The NYT bought the habit, not the technology. Chromoku's
technology is more complex (puzzle generation, difficulty rater, progression
system), but that doesn't matter unless there's an audience.

**The audience is the asset. Everything else is plumbing.**

---

## Sources

- [Flappy Bird: Origins, Impact, and Legacy](https://yourstory.com/2023/04/flappy-bird-rise-fall-viral-mobile-gaming-phenomenon)
- [Flappy Bird creator speaks out (Rolling Stone)](https://www.rollingstone.com/culture/rs-gaming/the-flight-of-the-birdman-flappy-bird-creator-dong-nguyen-speaks-out-112457/)
- [The Runway: Flappy Bird was shut down because it was doing too well](https://www.therunway.ventures/p/flappy-bird)
- [Why NYT Acquired Wordle (Oreate AI)](https://www.oreateai.com/blog/why-the-new-york-times-acquired-wordle-a-strategic-move-for-digital-growth/238a9b6b2351125a656c027cf0d9cf33)
- [NYT Wordle Business Model (Dinogame)](https://dinogame.gg/blog/wordle-nyt-business-model/)
- [Wordle bought by NYT for seven figures (Kotaku)](https://kotaku.com/wordle-new-york-times-crosswords-josh-wardle-app-ios-an-1848455748)
- [Angry Birds business model evolution (Medium)](https://shahmm.medium.com/from-slingshot-to-downfall-how-angry-birds-revolutionized-mobile-gaming-and-lost-its-flight-bb3124b9d087)
- [How Angry Birds 2 multiplied revenue (Deconstructor of Fun)](https://www.deconstructoroffun.com/blog/2017/6/11/how-angry-birds-2-multiplied-quadrupled-revenue-in-a-year)
- [Rewarded video eCPMs 2026 (Coinis)](https://coinis.com/glossary/rewarded-video)
- [Rewarded ads best practices 2025 (AppSamurai)](https://appsamurai.com/blog/rewarded-ads-in-mobile-games-strategy-data-and-best-practices/)
- [Ritual Features: daily puzzle games strategy (Medium)](https://medium.com/product-pickle/ritual-features-the-quiet-strategy-behind-daily-puzzle-games-on-linkedin-and-beyond-418298332737)
- [PWA to Play Store via TWA (Bubblewrap)](https://www.thinktecture.com/en/pwa/twa-bubblewrap/)
- [Capacitor: PWA to native (Capgo)](https://capgo.app/blog/transform-pwa-to-native-app-with-capacitor/)
- [Cloudflare Pages static hosting 2026 (Mecanik)](https://mecanik.dev/en/posts/cloudflare-pages-static-web-app-hosting/)
