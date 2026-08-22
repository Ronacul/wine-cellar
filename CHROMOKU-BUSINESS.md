# Chromoku — Business & Monetization Plan

**Last updated:** 2026-08-22  
**Status:** Pre-launch planning  
**Owner:** Ronacul (lucanor@gmail.com)

---

## Overview

Single-file PWA colour puzzle game, monetized via AdMob ads + Stripe IAP. Launch date TBD. Revenue target: test with $0, scale to $50–200/month Year 1.

---

## Monetization Strategy

### Revenue Streams (Priority Order)

#### 1. Google AdMob (Primary) — Non-Negotiable
- **Model:** Display ads (banner, interstitial, rewarded video)
- **Revenue:** $50–150/month at 10k users (low, but passive)
- **Effort:** Minimal (Google handles everything)
- **Launch:** Week 1
- **Status:** Essential for sustainable revenue

**Setup:**
```
├─ Create Google account (if needed)
├─ Register AdMob publisher account (free, instant)
├─ Get publisher ID + ad unit IDs
├─ Add AdMob SDK to Chromoku index.html
├─ Test ads locally + on device
└─ Deploy
```

**Ad placement strategy (mobile-first PWA):**
- Interstitial after level complete (good UX, highest CPM)
- Rewarded video for hints/power-ups (user chooses to watch)
- Avoid: banner ads (clutter on small screens)

#### 2. Stripe IAP — Secondary Revenue
- **Model:** "Remove Ads" in-app purchase ($2.99 CAD)
- **Revenue:** $200–500/month at 10k users (high conversion if ads are annoying)
- **Effort:** Moderate (integrate checkout flow)
- **Launch:** Week 1
- **Status:** Highly recommended

**Setup:**
```
├─ Create Stripe account (free)
├─ Link to personal bank account (EQ Bank or Tangerine)
├─ Create product: "Remove Ads" ($2.99)
├─ Generate checkout link / embedded form
├─ Add "Remove Ads" button to Chromoku UI
├─ Store purchase in localStorage (client-side)
└─ Deploy
```

**Conversion targets:**
- 2–5% of users purchase at $2.99 = $200–500/month (at 10k users)
- Track via Stripe dashboard

#### 3. Patreon — Optional, Low Priority
- **Model:** Recurring monthly supporter donations
- **Revenue:** $10–50/month (very slow to build)
- **Effort:** Minimal to set up, but high friction for supporters
- **Launch:** Month 2 (after launch data)
- **Status:** Nice-to-have, probably skip initially

**Decision:** Launch AdMob + Stripe. If revenue is strong, revisit Patreon in 3 months. If revenue is weak, don't waste time on Patreon.

---

## Financial Model (Year 1)

### Acquisition Costs
| Item | Cost | Notes |
|------|------|-------|
| Business name registration (Ontario) | ~$130 | Optional, do later if revenue > $1k/mo |
| Business bank account | $25/mo | Optional, do later if revenue > $1k/mo |
| Domain name (chromoku.dev) | $10/yr | Optional, use GitHub Pages free |
| Email hosting | $0 | Use chromoku@gmail.com (free) |
| Privacy policy (Termly) | Free–$99/yr | Free tier sufficient |
| **Total Year 1** | **~$150 (optional)** | Can launch with $0 |

### Revenue Projections (Conservative)

**Scenario A: Slow Growth (1k–5k users)**
```
Month 1–3:  $0–50/month
Month 4–6:  $50–150/month
Month 7–12: $150–300/month
Year 1 Total: ~$1,500–2,000
```

**Scenario B: Moderate Growth (5k–10k users)**
```
Month 1–3:  $50–150/month
Month 4–6:  $150–400/month
Month 7–12: $400–800/month
Year 1 Total: ~$3,500–5,000
```

**Scenario C: Viral (10k+ users)**
```
Month 1–3:  $150–500/month
Month 4–6:  $500–1,000/month
Month 7–12: $1,000–2,000/month
Year 1 Total: ~$8,000–12,000
```

### Expense Model (Year 1)

| Expense | Monthly | Annual | Notes |
|---------|---------|--------|-------|
| **Hosting** | $0 | $0 | GitHub Pages free |
| **Ad network (Google)** | 30% of AdMob | Varies | Included in AdMob earnings |
| **Payment processing (Stripe)** | 2.9% + $0.30 | Varies | Only on IAP sales |
| **Email (chromoku@gmail.com)** | $0 | $0 | Free Gmail |
| **Domain (optional)** | — | $10 | chromoku.dev (optional) |
| **Business registration (optional)** | — | $130 | One-time (Ontario) |
| **Business account (optional)** | $25 | $300 | Only if revenue > $1k/mo |
| **Tax (self-employment, Canada)** | — | $200–500 | ~20% of net income, only if > $600/yr |
| **Total (minimal)** | **$0–3/mo** | **$0–40/yr** | No business setup |
| **Total (formalized)** | **$25/mo** | **$630/yr** | With business account + registration |

### Net Revenue (After Fees)

```
Scenario B (moderate growth):
├─ Gross revenue (AdMob + Stripe): $3,500
├─ Less: Google AdMob (30%):       -$1,050
├─ Less: Stripe fees (2.9% + $0.30): -$100
├─ Less: Business costs:            -$150 (optional)
│
├─ Net Year 1: $2,200 (minimal setup)
└─ Net Year 1: $2,050 (with business setup)
```

**Tax implications (Canada):**
- No GST registration needed (under $30k)
- Report self-employment income on tax return (June 15)
- Pay ~20% tax on net income
- Real net Year 1: ~$1,600–1,800

---

## Launch Checklist

### Week 1: Development + Compliance (Parallel Tracks)

#### Track A: Code (AdMob + Stripe)
```
[ ] Add Google AdMob SDK to index.html
[ ] Create ad unit IDs (interstitial + rewarded)
[ ] Test ads locally + on device
[ ] Add Stripe checkout form
[ ] Create "Remove Ads" button/flow
[ ] Test payment locally (Stripe test mode)
[ ] Push to branch (not live)
```

#### Track B: Compliance (30 min evening work)
```
[ ] Generate privacy policy (Termly, 15 min)
[ ] Draft ToS (use ChatGPT, 20 min)
[ ] Add privacy + ToS links to footer
[ ] Create chromoku@gmail.com (5 min)
```

### Week 2: Polish + Deploy

```
[ ] Optimize ad placement (mobile UX)
[ ] Add consent banner (if EU traffic expected)
[ ] Final testing on real device
[ ] Review privacy policy + ToS
[ ] Merge to main branch
[ ] Deploy to GitHub Pages
[ ] Verify ads + payments live
```

### Week 3+: Launch + Monitor

```
[ ] Announce launch (Twitter, indie game forums)
[ ] Monitor revenue (Stripe dashboard + AdMob)
[ ] Track user feedback
[ ] Iterate on ad placement if needed
[ ] Plan next feature (if revenue justifies it)
```

---

## Business Setup (Ontario)

### Email Strategy
- **Use:** chromoku@gmail.com (professional, free)
- **For:** AdMob, Stripe, Patreon, support
- **Setup:** 5 minutes
- **Can change later:** Yes (easy migration)

### Bank Account
- **Launch with:** Personal account (EQ Bank or Tangerine, free)
- **When to upgrade:** If revenue > $1k/month
- **Upgrade to:** Business account ($20–25/mo)
- **Why:** Tax clarity, separate finances, professionalism

### Business Registration
- **Status:** Optional at launch
- **Cost:** ~$130 (ServiceOntario)
- **When:** If revenue > $1k/month and you plan to reinvest
- **Process:** 5–10 minutes online, 5–10 business days approval
- **Benefit:** Professional credibility, liability protection

### Tax Obligations (Canada)

**If revenue < $30k/year (likely Year 1):**
```
├─ No GST/HST registration needed
├─ No quarterly filings
└─ Report self-employment income on annual tax return (June 15)
```

**Tax filing:**
- File on CRA MyBusiness account (free)
- Report gross revenue + business expenses
- Pay ~20% tax on net income
- Deductible expenses:
  - Stripe fees (2.9% + $0.30)
  - AdMob fees (included in payout)
  - Dev tools, hosting, domain
  - NOT your own labor (owner profit)

---

## Compliance & Privacy

### Required (Must Have)

#### 1. Privacy Policy
- **Disclosure:** What data is collected (AdMob device type, location, Stripe email)
- **Retention:** How long data is kept
- **User rights:** GDPR/CCPA requests
- **Template:** Termly.io (free tier, 15 min)
- **Post:** Link in footer of Chromoku
- **Effort:** 30 minutes total

#### 2. Stripe Data Processing Agreement (DPA)
- **Requirement:** Auto-agree when you sign up
- **Effort:** Already done (included in ToS)

#### 3. Google AdMob DPA
- **Requirement:** Auto-agree when you set up AdMob
- **Effort:** Already done

### Highly Recommended (Should Have)

#### 1. Terms of Service
- **Sections:** Refund policy, acceptable use, liability, account deletion
- **Template:** ChatGPT (20 min) or Termly
- **Post:** Link in footer
- **Refund policy:** "No refunds for digital goods" or "30-day refund window"

#### 2. Consent Banner (EU Users)
- **Purpose:** Disclose ad tracking, get consent
- **Code:** Simple HTML/CSS (15 min)
- **Behavior:** "Allow personalized ads" → personalized; "Decline" → non-personalized
- **Required:** Only if significant EU traffic

#### 3. Data Deletion Handler
- **Process:** Email support@chromoku.dev, manual handling via Stripe
- **Requirement (GDPR):** Respond within 30 days
- **Effort:** Minimal (likely very few requests)

### Nice-to-Have (Can Do Later)

```
[ ] Automated data download (user requests their data)
[ ] Account deletion endpoint (delete localStorage)
[ ] Auto-retention (delete old unused accounts)
```

### Security Checklist

| Item | Status | Owner |
|------|--------|-------|
| HTTPS | ✅ GitHub Pages | Automatic |
| Stripe PCI compliance | ✅ Stripe | Stripe handles |
| AdMob security | ✅ Google | Google handles |
| No backend server | ✅ PWA | You (none needed) |
| No database breach risk | ✅ PWA | You (no DB) |
| User data deletion | ✅ Browser | Browser "Clear data" |
| Privacy policy | ⏳ To-do | You (30 min) |

---

## Ad Strategy & Monetization Model (Final)

### Philosophy: Viral-First, Monetize Secondarily

**Core principle:** Retention + virality > short-term CPM. Aggressive ads kill sharing.

### Daily Mode: Light-Touch (Viral-Optimized)

**Goal:** Pure experience, maximum word-of-mouth, build 7-day habit.

**Desktop:**
```
├─ Banner: Bottom, subtle (~2% of screen)
├─ Interstitial: None (too intrusive for habit-building)
├─ Rewarded Video: Yes, ONLY if stuck (3+ failed attempts)
│  └─ Popup: "Need help? Watch 15s for hint" (user chooses)
└─ User sees <1 forced ad per session (if solves quickly)
```

**Mobile:**
```
├─ Banner: Bottom, subtle (~8% of screen)
├─ Interstitial: None (full screen kills engagement)
├─ Rewarded Video: Yes, only on failure (user-opted)
└─ User sees 0–1 ads per day (depending on difficulty)
```

**Revenue per user:**
- Impressions: ~1 banner + 0.2 rewarded = 1.2/day
- CPM (blended): ~$1.20
- **Daily revenue: $0.05–0.08 per user per day**

**Why this works:**
- Daily feels **pure** (like Wordle, which has no ads)
- No forced ads = users don't resent the game
- Users **share** (positive experience, not frustration)
- Retention is high (habit-forming, not ad-burdened)

### Levels Mode: Standard Monetization (Revenue-Optimized)

**Goal:** Sustain engagement, maximize ads + IAP from power users who expect monetization.

**Desktop:**
```
├─ Banner: Right sidebar (doesn't interfere with gameplay)
├─ Interstitial: Full-screen after every 3rd level (spaced, not aggressive)
├─ Rewarded Video: For power-ups (hints, undo, time extension)
├─ IAP: Boosters, lives, remove-ads ($0.99–2.99)
└─ User expects ads (known monetization model)
```

**Mobile:**
```
├─ Banner: Bottom (always visible)
├─ Interstitial: Full-screen after every 3rd level
├─ Rewarded Video: For power-ups (user-opted)
├─ IAP: Same as desktop (consistent pricing)
└─ Full monetization density (users accept it for free levels)
```

**Revenue per user:**
- Impressions: ~1.2 banner + 0.4 interstitial + 0.2 rewarded = 1.8/day
- CPM (blended): ~$2.50
- **Levels revenue: $0.30–0.45 per user per day**
- **IAP revenue: +$0.10–0.15 per user per day** (10% convert at $1.50 avg)

**Why this works:**
- Levels players **expect** ads (they know free trial ends with paywall)
- Spacing interstitials every 3rd level = doesn't feel aggressive
- IAP + ads = multiple revenue streams
- Desktop sidebar banner = much less intrusive on large screen

### Difficulty-Driven Monetization (Key Insight)

**As levels get harder (20 → 50 → 100 → 200+), puzzles take longer.**

```
Level 5 (Easy):
├─ Solve time: 2–3 min
├─ Hints needed: 0% of users
├─ Ad opportunities: 1 banner (low)
└─ Revenue: Minimal

Level 50 (Medium):
├─ Solve time: 5–8 min
├─ Hints needed: 10–20% of users
├─ Ad opportunities: 1 banner + 1 interstitial + 0.1 rewarded
└─ Revenue: Medium

Level 150 (Hard):
├─ Solve time: 10–15 min
├─ Hints needed: 40–50% of users
├─ Ad opportunities: 1 banner + 1 interstitial + 0.3 rewarded
└─ Revenue: High

Level 250+ (Extreme):
├─ Solve time: 15–30 min
├─ Hints needed: 70%+ of users (stuck users watch ads)
├─ Ad opportunities: 1 banner + 1 interstitial + 0.5 rewarded + IAP boosters
└─ Revenue: Very high (natural monetization hook)
```

**This is a feature, not a bug.** As players progress:
1. They invest more time (higher sunk cost = more likely to buy hints)
2. Puzzles are harder (more help-seeking)
3. They're more engaged (willing to watch ads or pay)
4. Monetization feels **earned**, not forced

**Refinement strategy:** Launch with conservative ad placement. Monitor which levels see highest hint-seeking. Over time, adjust:
- Increase rewarded video offers at levels 100+ (users expect help)
- Lower ad frequency at levels 1–30 (new players shouldn't see ads)
- Test booster pricing (what price converts best at level 150+?)

### CPM & Revenue Comparison

**For 1,000 new users per day, assumed split after day 8:**

```
Daily Mode (700 users at 60% DAU):
├─ Impressions/day: 420 banners + 126 rewarded = 546
├─ CPM: $1.20
├─ Daily revenue: $0.65
├─ Monthly (30 days): $19.50

Levels Mode (300 users at 40% engagement):
├─ Impressions/day: 360 banners + 180 interstitials + 72 rewarded = 612
├─ CPM: $2.50
├─ Ad revenue: $1.53
├─ IAP revenue (10% convert × $1.50): +$0.45
├─ Daily revenue: $1.98
├─ Monthly (30 days): $59.40

Total per 1k user cohort:
├─ Monthly: $19.50 + $59.40 = $78.90
├─ Per user per month: $0.079
└─ Per user per day: $0.0026
```

**Scale:** If you reach 10k DAU sustainably:
```
└─ Daily revenue: ~$790/month
└─ With IAP: ~$2,600/month
```

---

## Marketing & User Acquisition

### Launch Channels (Low Cost, High Effort)

```
├─ Reddit (/r/gamedev, /r/indiegames, /r/webgames)
├─ Indie game forums (itch.io, IndieHackers)
├─ Twitter/X (@lucanor mentions)
├─ ProductHunt (if you want to wait)
├─ GitHub trending (if popular)
└─ Direct reach (friends, colleagues)
```

### Growth Targets (Year 1)

| Month | Target Users | Revenue |
|-------|--------------|---------|
| 1 | 10–50 | $0–5 |
| 2 | 50–200 | $5–20 |
| 3 | 200–500 | $20–50 |
| 4–6 | 500–2k | $50–200 |
| 7–12 | 2k–5k | $200–500 |

**Realistic:** Puzzle games are hard to go viral. Most indie games see 100–1k users Year 1. Focus on retention (making a good game) over growth hacking.

---

## Decision Checkpoints

### Decision 1: Launch AdMob + Stripe Only? (Recommended)
- **YES:** Fast to launch, sufficient for testing. Skip Patreon.
- **NO:** Add Patreon (fine, but low ROI initially).
- **Decision:** YES, launch with AdMob + Stripe. Add Patreon in Month 3 if traction.

### Decision 2: Formal Business Setup Now?
- **YES:** If you plan to reinvest heavily, need credibility, expect $1k+/mo.
- **NO:** If you want to test first, minimal commitment. ($0 to launch)
- **Decision:** NO, launch solo. Formalize at $1k+/mo revenue.

### Decision 3: Domain Name (chromoku.dev)?
- **YES:** Professional, memorable, SEO (minor benefit for PWA).
- **NO:** Free GitHub Pages subdomain is fine.
- **Decision:** NO initially. Add domain if revenue > $500/mo.

---

## Success Metrics

### Launch Success
- [ ] AdMob + Stripe working live
- [ ] First $1–5 revenue within 1 week
- [ ] Privacy policy + ToS posted
- [ ] Zero bugs/crashes in Week 1

###3-Month Goals
- [ ] 200–500 users
- [ ] $20–50 revenue
- [ ] Clear leader: AdMob or Stripe?
- [ ] Ready to optimize based on data

### 6-Month Goals
- [ ] 500–2k users
- [ ] $100–200 revenue
- [ ] Decide: Continue indie, sell, or abandon?

### 12-Month Goals
- [ ] 1k–5k users
- [ ] $500–2k revenue
- [ ] Formalize business if reinvesting
- [ ] Plan Year 2 direction

---

## Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Low user acquisition | High | Minimal revenue | Focus on UX, iterate quickly |
| Ad network policy violation | Low | Account suspension | Read ToS, no cheating/bots |
| Payment processing error | Very low | Lost IAP revenue | Test thoroughly before launch |
| Privacy law non-compliance | Low | Fines (minor for indie) | Post privacy policy + ToS |
| Google AdMob account rejected | Low | No ads revenue | Apply early, link to live game |
| Stripe account closed | Very low | No IAP revenue | Stripe rarely closes accounts |

---

## Timeline

```
Week 1:     Development (AdMob + Stripe) + Compliance (privacy/ToS)
Week 2:     Testing + deployment
Week 3+:    Live, monitor, iterate

Month 1:    Launch, test monetization
Month 2–3:  Analyze data, optimize
Month 3+:   Decide: scale, pivot, or abandon

Year 1:     Target $1.5k–5k revenue (conservative)
Year 2:     Decide business model based on traction
```

---

## Resources & Contacts

| Task | Resource | Link |
|------|----------|------|
| Privacy Policy | Termly | https://termly.io |
| Privacy Policy | iubenda | https://iubenda.com |
| ToS Template | ChatGPT | — |
| Google AdMob | AdMob | https://admob.google.com |
| Stripe | Stripe | https://stripe.com |
| EQ Bank | EQ | https://eqbank.ca |
| Ontario Business Reg | ServiceOntario | https://ontario.ca/business |
| CRA Self-Employed | CRA | https://canada.ca/taxes/self-employed |
| GST/HST Threshold | CRA | $30,000 CAD/year |

---

## Author Notes

- This plan assumes PWA, no app store distribution (simplifies compliance).
- If you port to iOS App Store later, compliance burden increases (Apple's 30% cut, additional rules).
- Year 1 focus: make a great game. Monetization is secondary.
- If revenue < $100/month after 6 months, consider: is this a hobby or a business? Adjust effort accordingly.
- Always keep the code in the main repo; monetization is a feature, not a pivot.

---

**Next steps:**
1. Review this plan
2. When ready: start Week 1 dev work (create branch: `feature/monetize`)
3. Track progress in this file (update Status)
4. Monthly check-in: update financial projections

**Questions?** Reference this file before starting development.
