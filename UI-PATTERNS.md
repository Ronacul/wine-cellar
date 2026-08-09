# UI Patterns & Lessons Learned

Reusable patterns, optimizations, and design decisions from building La Cave — a mobile-first single-file PWA with no frameworks. These apply broadly to any data-heavy mobile app.

---

## 1. Icon-over-text for status indicators

**Problem:** Verbose status chips like "Drink soon · 6 yr left" and "Past peak · 2 yr over" consume too much horizontal space on mobile cards, especially when combined with other chips.

**Solution:** Replace text with a single colorized icon (in our case, a double-peak mountain SVG) where color conveys urgency on a graduated scale:

- 🟢 Green — healthy / in range
- 🟡 Gold — approaching a threshold
- 🟠 Orange — urgent
- 🔴 Red — past threshold / critical

Full text is still accessible via `title` attribute (hover on desktop, long-press on mobile). Detail views keep the verbose version since space allows it.

**Why it works:** Color is processed pre-attentively — the eye reads "green = fine, red = act now" faster than parsing text. One icon replaces two chips (status + countdown).

```html
<span class="chip peak-icon" title="Drink soon · 6 mo left">
  <svg viewBox="0 0 16 11" width="14" height="10">
    <path d="M0 11L5.5 1L11 11z" fill="#c9a227"/>
    <path d="M7 11L11 4L16 11z" fill="#c9a227" opacity=".5"/>
  </svg>
</span>
```

**Reuse:** Any time-based or severity-based status — build health, SLA indicators, battery level, subscription status.

---

## 2. Popup multi-select filters (bottom sheet pattern)

**Problem:** Scrollable chip rows for filters (shelf letters A–P, filter categories) eat 2+ rows of vertical space on mobile even when not in use. With 15 shelf letters and 6 filter types, it's a lot of visual noise.

**Solution:** Compact trigger buttons (`[Shelf] [Filters]`) that open a bottom-sheet popup for multi-select. Active selections show a count badge on the trigger.

```
Before:  [B][C][D][E][F][G][H][I][J][K][L][M][N][O][P]  (scrollable)
         [🔥 Fire 25][Titi 57][CB 122][⛰️ Peak 140]...   (scrollable)

After:   [Shelf 3] [Filters 2] [✕ Clear]
```

**Key details:**
- Bottom-sheet slides up from the bottom (natural thumb zone on mobile)
- Overlay backdrop — tap outside to close and apply
- Toggle buttons in a wrapping grid (not a list — fits more options visually)
- Count badge on trigger shows active selection count at a glance
- Selections apply on close, not on each tap — reduces re-renders during multi-select

```css
.filter-popup-overlay{
  position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:200;
  display:flex;align-items:flex-end;justify-content:center;
}
.filter-popup{
  background:var(--panel);border-radius:12px 12px 0 0;
  padding:16px 16px 24px;width:100%;max-width:420px;max-height:60vh;
  overflow-y:auto;
}
```

**Reuse:** Any filterable list with multiple independent filter dimensions — product catalogs, task boards, log viewers.

---

## 3. Clear-all-filters button

**Problem:** Users toggle multiple filters across different popups (shelf, type, search text, category filters) and lose track of what's active. No quick way to reset.

**Solution:** A `✕ Clear` button that appears in the filter bar only when any filter is active. One tap resets everything — search text, type dropdown, shelf selections, all toggle filters.

**Why "appears only when active":** Zero visual noise when nothing is filtered. The button itself is a signal that filters are applied.

**Reuse:** Any multi-faceted filter UI. The pattern of "clear button appears only when needed" is better than an always-visible disabled button.

---

## 4. Search select-all on mobile

**Problem:** On mobile Safari, calling `input.select()` in the `focus` event handler gets cancelled by the subsequent `touchend` event, so text doesn't actually get selected.

**Solution:** Wrap `select()` in a `setTimeout` with a small delay:

```javascript
input.addEventListener("focus", () => setTimeout(() => input.select(), 10));
```

**Why it matters:** Without this, users have to manually triple-tap or long-press to select existing search text before typing a new query. With it, tapping the search box highlights everything so typing replaces it instantly.

**Reuse:** Any mobile web app with a search box that users repeatedly re-type into.

---

## 5. Country flags from region strings

**Problem:** Showing origin country on cards without adding a new data field.

**Solution:** Derive the country from the existing `region` field (which typically ends with ", Country") and map to flag emoji:

```javascript
const COUNTRY_FLAGS = {
  france:"🇫🇷", italy:"🇮🇹", spain:"🇪🇸", usa:"🇺🇸",
  australia:"🇦🇺", argentina:"🇦🇷", chile:"🇨🇱", ...
};
function countryFlag(w){
  const parts = (w.region||"").split(",");
  let c = parts[parts.length-1].trim().toLowerCase().replace(/\s+/g,"");
  return COUNTRY_FLAGS[c] || "";
}
```

**Why it works:** Flag emoji are universally recognized, take no extra space (single character), and add a splash of color. No new data entry required — derived from existing fields.

**Reuse:** Any dataset with location strings — show country/region flags on cards, tables, lists.

---

## 6. Compact chips: emoji-only on cards, full labels in detail

**Problem:** Fire tier labels like `🔥🔥 Prestige` and gift labels like `🎁 Gift` take too much card space. But removing the label entirely loses information.

**Solution:** Two rendering modes:
- **Cards:** Emoji only — `🔥🔥`, `🎁` (compact, scannable)
- **Detail view:** Full label — `🔥🔥 Prestige`, `🎁 Gift` (room to be explicit)

**Why it works:** Cards are for scanning; detail views are for reading. Match information density to the context.

**Reuse:** Any card/list → detail view pattern. Show icons on cards, labels in detail.

---

## 7. Chip ordering by utility

**Problem:** Chips on cards accumulate over time (vintage, type, shelf, fire, peak, price, origin tags). Random ordering makes scanning harder.

**Solution:** Order chips by what you look for most often:

```
vintage → shelf → type → flag → qty → fire → peak → price → origin tags → gift
```

Identification first (what is it, where is it), then status (is it special, is it peaking), then metadata (price, source).

**Reuse:** Any tag/chip system. Group by: identification → status → metadata.

---

## 8. Collapsible sections with smart defaults

**Problem:** Sync page has sync history, changelog, and settings — all visible at once is overwhelming on mobile.

**Solution:** Use progressive disclosure with smart defaults:
- **Sync history:** Show only the last entry; older entries behind a `<details>` collapse
- **What's new / changelog:** Collapsed by default (heading visible as the disclosure trigger)
- **Settings/API keys:** Always collapsed to prevent accidental edits

**Pattern:** Show the most-recent or most-relevant item inline. Hide the rest behind a disclosure. The heading is always visible as the click target.

```html
<!-- Last entry always visible -->
<div class="history-last">Push · 278 wines · 2:31 PM</div>
<!-- Older entries collapsed -->
<details class="collapse">
  <summary>Older entries</summary>
  <div class="collapse-body">...</div>
</details>
```

**Reuse:** Activity logs, notification history, release notes, settings pages.

---

## 9. Graduated color scales for urgency

**Problem:** Binary status (OK / not OK) doesn't communicate how urgent something is.

**Solution:** A 4–5 step color gradient that maps to escalating urgency:

| Status    | Color          | CSS variable   | Meaning              |
|-----------|---------------|----------------|----------------------|
| Hold      | Muted green   | `--ink-faint`  | Not yet relevant     |
| In window | Green         | `--ok`         | All good             |
| Soon      | Gold          | `--warn`       | Pay attention        |
| Urgent    | Orange        | `--orange`     | Act soon             |
| Overdue   | Red           | `--urgent`     | Past deadline        |

Used consistently across: card icons, maturity band, band status labels, filter chips.

**Reuse:** SLA dashboards, expiry tracking, subscription status, CI/CD pipeline health.

---

## 10. Data field discovery: check actual data, not schema

**Problem:** We assumed shelf data was in `binCode` (the schema said so), but zero wines had it populated. The actual data was in `location` — 229/278 wines had shelf letters there.

**Lesson:** Before building features on a field, check what's actually populated:

```python
from collections import Counter
Counter(w.get('fieldName','') for w in wines if w.get('fieldName'))
```

Schema documents intent. Data documents reality. Build on reality.

**Reuse:** Any project with user-entered data. Always validate assumptions with a quick data audit before building UI around a field.

---

## 11. Price formatting: compact on cards, full in detail

**Problem:** Price strings like `~$45 CAD (est.)` are too long for card chips.

**Solution:** A compact formatter that extracts just the number:

```javascript
function fmtCardPrice(p){
  const v = parsePrice(p);  // extracts numeric value
  return v !== null ? "$" + Math.round(v) : "";
}
```

Card shows `$45`. Detail view shows the full `~$45 CAD (est.)` with context.

**Reuse:** Any monetary display — currency, filesize, metrics. Compact on cards/tables, full on detail/hover.

---

## 12. Inline SVG for small icons (no icon library needed)

**Problem:** Need small, colorable icons but don't want to load an icon library for a single-file PWA.

**Solution:** Inline SVG directly in template literals. Use `currentColor` or pass colors as props. Keep viewBox tight (16×11 or similar) for crisp rendering at small sizes.

```javascript
function peakMtnSVG(cls){
  const c = PEAK_COLORS[cls] || "#7da87b";
  return `<svg viewBox="0 0 16 11" width="14" height="10">
    <path d="M0 11L5.5 1L11 11z" fill="${c}"/>
    <path d="M7 11L11 4L16 11z" fill="${c}" opacity=".5"/>
  </svg>`;
}
```

**Benefits:** No external dependencies, fully styleable, scales perfectly, works offline. The entire icon is ~150 bytes.

**Reuse:** Any project that needs a handful of custom icons without a full icon system.

---

## 13. Dark theme color tokens

A minimal but effective dark-theme palette using CSS custom properties:

```css
:root{
  --bg: #1c1518;        /* deep wine-dark background */
  --panel: #241c20;     /* card/surface background */
  --panel2: #2e2428;    /* elevated surface */
  --line: #3a2e33;      /* borders, dividers */
  --ink: #e8ddd0;       /* primary text */
  --ink-dim: #a89488;   /* secondary text */
  --ink-faint: #6e5f58; /* tertiary/disabled text */
  --claret: #a03040;    /* brand accent (wine red) */
  --gold: #c9a227;      /* highlight, attention */
  --ok: #7da87b;        /* success, positive */
  --warn: #c9a227;      /* caution (same as gold) */
  --orange: #d4842a;    /* warning, urgent-but-not-critical */
  --urgent: #c05060;    /* error, critical */
}
```

**Lesson:** 3 levels of ink (primary/dim/faint) and 4 semantic colors (ok/warn/orange/urgent) cover nearly every UI state. Add one brand accent color and you're done.

---

## Summary of principles

1. **Color > text** for status at a glance
2. **Progressive disclosure** — show what matters, hide the rest behind a tap
3. **Two density modes** — compact on cards, verbose in detail
4. **Popup > scrollable row** for multi-select filters on mobile
5. **Derive, don't duplicate** — compute display values from existing fields
6. **Check actual data** before building on assumed fields
7. **Inline SVG** beats icon libraries for small icon counts
8. **setTimeout(select, 10)** — the mobile Safari focus/select fix
9. **"Clear all" only when active** — zero-noise when not needed
10. **Chip order matters** — identification → status → metadata
