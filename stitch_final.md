You are a Shopify theme designer. Build a complete dark fitness store.
IMPORTANT: Use ONLY the text I provide below. Do not invent names, products, or copy.

---

## COLORS — EMERALD (NOT NEON)

```
--bg:          #0D1117
--bg2:         #161B22
--bg3:         #21262D
--accent:      #10B981   ← EMERALD. Not #22FF7A. Not #00FF87. ONLY #10B981
--accent-hover:#059669
--accent-light:#34D399
--white:       #F0F6FC
--gray:        #8B949E
--border:      #30363D
```

The accent color is #10B981 — deep emerald. Rich, mature. NOT neon, NOT electric.
Every place you would use bright green — use #10B981.

---

## FONTS

```
Anton          → hero headlines only (TRIED THE GYM.)
Barlow Condensed 900 → section headings, buttons, nav
Inter 400/500  → all body text, descriptions, prices
```
NO Bebas Neue. NO italic on display fonts.

---

## LOGO

```
HEALTH  (Barlow Condensed 300, white, letter-spacing 0.12em)
HUSTLE  (Barlow Condensed 900, #10B981, letter-spacing 0.04em)
ACADEMY (Barlow Condensed 300, #8B949E, 65% size, letter-spacing 0.2em, below)
```

---

## BUTTONS

```
Primary:   background #10B981, color #000, Barlow Condensed 700, uppercase, border-radius 2px
Secondary: transparent, border 1.5px white, color white
All primary buttons end with " →"
```

---

# PAGE 1: HOMEPAGE

## ANNOUNCEMENT BAR
Background: #10B981, text black, 44px height
Text: "FREE SHIPPING + 30-DAY RETURNS on orders $50+  ·  Limited time: FREE 30-day program with every kit →"

## NAVIGATION
Sticky, background rgba(13,17,23,0.95), blur 20px
Logo left | SHOP · BEST SELLERS · ABOUT · BLOG center | search + cart right
SHOP dropdown: Lose Weight / Build Strength / Move More / Recover Faster

## HERO SECTION
Full screen. Dark video background at 20% opacity. Black overlay.
Text bottom-left aligned.

Small label above headline:
"THE GYM YOU'LL ACTUALLY USE"
Color: #10B981, Barlow Condensed 500, 11px, letter-spacing 0.2em

Headline — Anton font, staggered word-by-word animation:
Line 1: "TRIED THE GYM."        ← white
Line 2: "QUIT TWICE."           ← #8B949E (muted gray)
Line 3: "FINALLY FIGURED IT OUT AT HOME."  ← #10B981 (emerald)

Font size: clamp(52px, 8vw, 96px). NO italic.

Subheadline (Inter 400, 18px, #C9D1D9):
"20-minute home workouts. Fits in a backpack. Actually works."

Two buttons side by side:
Button 1: "BUILD MY HOME GYM KIT →"  (primary, emerald)
Button 2: "See real results ↓"        (ghost, white text)

Trust strip below buttons (Inter 400, 12px, #8B949E):
"Free shipping  ·  30-day returns  ·  ⭐ 4.9 · 2,000+ customers"

Social proof cluster next to trust strip:
3 overlapping avatar circles + "Join 12,500+ athletes training at home"

Scroll indicator bottom center:
"SCROLL" text + animated chevron bouncing down

---

## TRUST STRIP
Background: #161B22, 4 columns

Col 1: truck icon — "FREE SHIPPING" / "On all orders $50+"
Col 2: shield icon — "30-DAY RETURNS" / "No questions asked"
Col 3: star icon — "4.9 RATING" / "From 2,000+ customers"
Col 4: headset icon — "US SUPPORT" / "Real humans, fast replies"

Icons: #10B981, 28px outline style

---

## PROBLEM SECTION
Background: #0D1117

Headline (Anton, clamp(36px,5vw,56px), white):
"DOES THIS SOUND FAMILIAR?"

3 columns. Each: large number (Barlow 900, 80px, #10B981, 40% opacity) + title + text

Column 01:
Title: "BOUGHT EQUIPMENT COLLECTING DUST"
Text: "Most home gear is bulky, ugly, and sits in the corner until it becomes a clothes rack. We built tools you actually want to use."

Column 02:
Title: "NO TIME TO DRIVE TO GYM"
Text: "The commute is the killer. By the time you find a parking spot, you could have finished a full metabolic circuit at home."

Column 03:
Title: "DON'T KNOW WHERE TO START"
Text: "Random YouTube videos aren't a plan. You need a system that progresses as you do, without the personal trainer price tag."

Below grid, centered, italic:
"That's exactly who we built this for. →"
Color: #10B981, Barlow Condensed 400 italic, 20px

---

## STARTER KIT OFFER SECTION
Background: #161B22
Layout: 2 columns (image left, offer right)

LEFT — Product image stack (3 images fanned at angles, fan out on hover)

RIGHT:
Badge: "BEST POPULAR · FREE PROGRAM INCLUDED"
Background: #10B981, color #000, Barlow Condensed 700, 11px

Headline (Barlow Condensed 900, clamp(28px,4vw,42px), white):
"THE 20-MINUTE HOME GYM STARTER KIT"

Description (Inter 400, 15px, #C9D1D9):
"Everything you need to rebuild your body from the comfort of your living room. No commute. No crowds. No excuses."

Checklist (Inter 400, 15px, #C9D1D9, emerald checkmarks):
✓ 5x Pro-Grip Resistance Bands (10–50 lbs)
✓ Anodized Aluminum Door Anchor
✓ Free 33-Day Training App Access
✓ 30-Day Workout Program PDF — FREE

Price block:
~~$109~~  →  $79
Strikethrough: #484F58, 18px
Current: white, 36px, Barlow Condensed 900

CTA: "GET MY STARTER KIT →"  (primary button, full width)

Trust line below button (Inter 400, 12px, #8B949E, centered):
"60-day money-back guarantee · Free shipping · Arrives in 5–8 days"

---

## HOW IT WORKS SECTION
Background: #0D1117

Headline (Anton, white):
"THREE STEPS."
"FIRST WORKOUT TODAY."
"TODAY." in #10B981

3 steps horizontal (desktop) / vertical (mobile):

STEP 01: "CHOOSE YOUR KIT"
"Takes 5 minutes. Pick what fits your goal."

STEP 02: "GET YOUR 30-DAY PROGRAM"
"Arrives in your email the moment you order."

STEP 03: "FIRST WORKOUT TODAY"
"20 minutes. No setup. Just follow along."

SVG connector line draws between steps on scroll (stroke-dasharray animation, #10B981)

---

## REAL RESULTS SECTION
Background: #0D1117

Rating row centered:
"⭐⭐⭐⭐⭐  4.9 / 5  ·  2,000+ VERIFIED PURCHASES"
Stars: #F0B429, text: Barlow Condensed 700, 14px, #10B981

Headline (Anton, clamp(36px,5vw,64px), white):
"REAL RESULTS."

Subheadline (Inter 400, 17px, #8B949E):
"Not influencers. Not models. People who used to make the same excuses you do."

3 review cards (background #161B22, border #30363D):

Card 1:
Photo: Maria K. · Texas · Verified buyer
Quote: "I've spent thousands on unused memberships. For the price of one month at Equinox, I have everything I need in my living room. Down 2 dress sizes in 8 weeks."
Result badge: "−18 LBS · 5 MONTHS"

Card 2:
Photo: James L. · California · Verified buyer
Quote: "The recovery protocols are what changed it for me. I used to be sore for days, now I'm ready to go every morning. Strength is at an all-time high."
Result badge: "LOST 16 LBS · STRENGTH GAINED"

Card 3:
Photo: Sandra P. · Florida · Verified buyer
Quote: "At 51, I thought high-intensity was over for me. This kit allowed me to scale properly. I feel more athletic today than I did in my 30s."
Result badge: "NOTABLY ATHLETIC"

"Read all 2,000+ reviews →"  (ghost button)

---

## SHOP BY GOAL SECTION
Background: #0D1117

Headline (Anton, white):
"WHAT'S YOUR GOAL?"

4 tabs: [LOSE WEIGHT] [BUILD STRENGTH] [MOVE MORE] [RECOVER FASTER]
Active tab: #10B981 bg, #000 text
Inactive: transparent, #30363D border

Products under LOSE WEIGHT tab:
Card 1: "Resistance Band Starter Kit" — $79 — badge "BEST SELLER"
Card 2: "Fat Burn Kit" — $129 — badge "BUNDLE"
Card 3: "Core Band Stack" — $65
Card 4: "Elite Bands" — $45

Products under BUILD STRENGTH:
Card 1: "Stackable Band System" — $89 — badge "MOST INTENSE"
Card 2: "Full Home Gym" — $129
Card 3: "Strength Bundle" — $109
Card 4: "Pull-Up Bands" — $45

Products under MOVE MORE:
Card 1: "Under-Desk Walking Pad" — $299 — badge "TRENDING"
Card 2: "Resistance Kit" — $79
Card 3: "Ankle Weights" — $32

Products under RECOVER FASTER:
Card 1: "Massage Gun" — $79
Card 2: "Foam Roller Pro" — $35
Card 3: "Mobility Kit" — $59 — badge "BEST SELLER"

Dark product cards #161B22. Lifestyle image top 70%. Name + price + ATC button bottom.
ATC button slides up from bottom on card hover.

---

## GUARANTEE SECTION
Background: #0D1117
Centered layout, max-width 640px

Decorative "60" background text (Anton, 400px, white, 3% opacity)

Shield icon: #10B981, 64px, outline SVG

Headline (Anton, clamp(32px,4vw,52px), white, centered):
"60-DAY MONEY-BACK GUARANTEE"

Body (Inter 400, 17px, #8B949E, centered, line-height 1.8):
"Not happy for any reason — email us, we'll refund 100% of your order.
No hoops. No questions. No hassle.
We stand behind this because we've seen it work."

"Start risk-free →"  (ghost button, centered)

---

## FAQ SECTION
Background: #161B22

Headline (Anton, clamp(28px,4vw,48px), white):
"EVERY QUESTION YOU'RE AFRAID TO ASK"

Accordion, max-width 760px, centered.
Question: Barlow Condensed 700, 18px, white
Answer: Inter 400, 15px, #8B949E, border-left 2px #10B981

Q1: "I've bought equipment before and never used it. Why will this be different?"
A1: "Because this kit comes with a 30-day program. You don't have to figure out what to do — just open the PDF and follow Day 1. That's the exact reason people stop: they buy hardware with no software. We solved that."

Q2: "Will this fit in a small apartment?"
A2: "The entire kit fits in a backpack smaller than your laptop bag. You can do a full workout in 6 square feet. We designed this specifically for people without a dedicated workout space."

Q3: "I'm really out of shape. Will this work for me?"
A3: "The bands start at 5 lbs of resistance. Day 1 is genuinely beginner level. We have customers in their 50s and 60s who started at zero. The program meets you where you are."

Q4: "What if I still don't use it?"
A4: "60-day guarantee. If it's sitting in the corner after 60 days, email us and get every dollar back."

Q5: "How long until I see results?"
A5: "Most customers feel stronger within 2 weeks. Visible changes typically appear between weeks 4–8."

Q6: "Do you ship internationally?"
A6: "Currently US only. We ship from US warehouses — delivery 5–8 business days."

Q7: "What is the return policy?"
A7: "60 days. Email us, we send a prepaid label, full refund within 3–5 business days."

---

## EMAIL CAPTURE SECTION
Background: #052E16 (dark emerald — only colored bg on page)
2 columns desktop / stacked mobile

LEFT:
Label: "FREE RESOURCE" (Barlow Condensed 700, 11px, #34D399, letter-spacing 0.2em)
Headline (Anton, clamp(28px,4vw,44px), white):
"GET YOUR FREE 30-DAY HOME WORKOUT PLAN"
Sub (Inter 400, 16px, rgba(240,246,252,0.7)):
"The exact program that comes with every kit — yours free, right now."
Trust (Inter 500, 13px, #34D399):
"Join 10,000+ people training at home without a gym membership"

RIGHT:
Email input: dark bg, #10B981 border on focus
Button: "SEND MY FREE PLAN →" (white bg, black text — reversed)
Privacy: "No spam. Unsubscribe any time." (11px, #8B949E)

---

## FINAL CTA SECTION
Background: #0A0C10

Headline (Anton, clamp(72px,12vw,140px), white, centered):
"START TODAY."

Sub (Inter 400 italic, 20px, #484F58, centered):
"Or reschedule it to next Monday like last time."

CTA button (primary, large, centered, min-width 320px):
"GET MY STARTER KIT →"

Trust row below button (Inter 400, 13px, #484F58, centered):
"✓ Free shipping  ·  ✓ 60-day guarantee  ·  ✓ Program included  ·  ✓ Ships in 2–3 days"

---

## FOOTER
Background: #0A0C10
Top border: 1px solid rgba(16,185,129,0.3)

4 columns:
Col 1: Logo + "The gym you'll actually use." + Instagram + TikTok icons
Col 2: SHOP — Lose Weight / Build Strength / Move More / Recover Faster / Best Sellers
Col 3: SUPPORT — FAQ / Shipping & Returns / Track Your Order / Contact Us / 60-Day Guarantee
Col 4: COMPANY — About Us / Blog / Affiliate Program / Privacy Policy / Terms of Service

Bottom bar: copyright left, payment icons right (Visa, MC, Amex, PayPal, Shop Pay, Apple Pay)

---

# PAGE 2: PRODUCT PAGE (PDP)
URL: /products/resistance-band-starter-kit

## STICKY HEADER (after 30% scroll)
"The 20-Minute Home Gym Starter Kit  —  $79"  +  [ADD TO CART →]

## ABOVE THE FOLD — 2 columns

LEFT — Image gallery:
Main image: kit flat lay on dark surface
6 thumbnails below:
1. Kit flat lay (MAIN)
2. All components spread
3. Band texture close-up
4. Size vs laptop bag
5. Person using in apartment
6. PDF program preview

RIGHT — Product info:
Rating: ⭐⭐⭐⭐⭐ "4.9  (2,147 reviews)"

Headline (Barlow Condensed 700, clamp(24px,3vw,36px), white):
"The 20-Minute Home Gym Starter Kit"

Trust icons (Inter 400, 12px, #8B949E):
🚚 Free shipping  |  🛡 30-day returns  |  📦 In stock, ships in 2–3 days

Price: ~~$109~~  $79  [SAVE $30]

Variant pills:
[KIT ONLY $79]  [KIT + ROLLER $99]  [KIT + MASSAGER $109]

Primary CTA: [ADD TO CART →]  (full width, height 56px)
Secondary: [BUY IT NOW]  (outline, full width)

Highlight box (#10B981 tint bg, emerald border):
"30-Day Workout Program PDF included FREE with every order"

## WHAT'S IN THE BOX

Title: "WHAT'S IN THE BOX"

5 items with icons:
1. "5 RESISTANCE BANDS (×5)" — 5 resistance levels: 5, 10, 20, 30, 50 lbs
2. "PRO-GRIP HANDLES (×2)" — Non-slip foam handles
3. "DOOR ANCHOR" — Fits any standard door, 360° rotation
4. "ANKLE STRAPS (×2)" — Padded adjustable velcro
5. "CARRY BAG" — Fits everything, perfect for travel

Highlighted item (full width, emerald accent):
"⭐ 30-DAY WORKOUT PROGRAM PDF"
"INCLUDED FREE WITH EVERY ORDER"
"Day-by-day plan, beginner friendly, printable"

## BENEFITS — 6 items grid

1. ⏱ "Full workout in 20 minutes" — For people with real schedules.
2. 🎒 "Fits in a backpack" — Smaller than a shoebox. Goes anywhere.
3. 📈 "5 resistance levels" — Start easy. Get stronger. Never plateau.
4. 📋 "30-day plan included" — No guessing. Open and follow Day 1.
5. 🏠 "Works in 6 square feet" — Your living room is big enough.
6. 🔒 "Built to last" — Safety sleeve prevents snapping. Guaranteed.

## HOW IT WORKS (3 steps, product-specific)

Step 1: "ORDER & RECEIVE" — "Arrives in 5–8 business days. Tracking sent immediately."
Step 2: "OPEN YOUR PROGRAM" — "30-day PDF in your email on Day 1. First session: 20 minutes."
Step 3: "FEEL THE DIFFERENCE" — "Stronger in 2 weeks. Visible results in 4–8 weeks."

## REVIEWS SECTION

Title: "STRENGTH VERIFIED"
Big rating: "4.9" (Anton 64px) + "/5" + ⭐⭐⭐⭐⭐ + "Based on 2,147 verified purchases"

Star distribution bars (emerald fill):
5★ 94% | 4★ 4% | 3★ 1% | 2★ 0.5% | 1★ 0.5%

3 review cards:

Review 1:
Name: Marcus B. · Verified Purchase
"I've prepared 3 different sets of bands from Amazon. These are different. The metal clips are thick, and the resistance feels consistent. Worth every cent."

Review 2:
Name: Sarah L. · Verified Purchase
"The door anchor is massive and doesn't slide. Using this for glute work has changed my home workout game completely."

Review 3:
Name: David K. · Verified Purchase  
"I use resistance bands a lot and I was skeptical but these are seriously high quality. Completely changed my home workout game forever."

"Load more reviews →" (ghost button)

## UPSELL — "UPGRADE YOUR ARSENAL"

3 product cards:
1. "Hustle Foam Roller" — $35 — "Accelerate recovery after every session"
2. "Trainer Point Roller" — $29 — "Target deep muscle tissue"  
3. "Academy Hydra-Jug" — $39 — "64oz insulated water jug"

## STICKY MOBILE ATC BAR
Fixed bottom, full width, #10B981 bg, #000 text
"Add to Cart — $79 →"  height 56px

---

# MOBILE RULES (apply to all pages)

- All buttons: full width
- Body text: minimum 15px
- Tap targets: minimum 44px
- Video: replace with static dark image on mobile
- 3-column layouts → 1 column
- 2-column layouts → 1 column
- Announcement bar: marquee scroll
- Nav: hamburger → full-screen black overlay
- Hero text: clamp(44px, 11vw, 64px)
- Side padding: 24px minimum

---

# FINAL RULES

COLORS:
✓ Accent = #10B981 ONLY
✗ Never use #22FF7A
✗ Never use #00FF87  
✗ Never use #22C55E

FONTS:
✓ Anton for hero headlines
✓ Barlow Condensed for headings + buttons
✓ Inter for body text
✗ Never Bebas Neue
✗ Never italic on large headlines

TEXT:
✓ Use ONLY the text written above — word for word
✗ Do not invent product names
✗ Do not invent section titles
✗ Do not rename the store
✗ Do not add sections not listed above
