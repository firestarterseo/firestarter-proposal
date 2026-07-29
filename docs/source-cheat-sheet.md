# SOURCE™ Application Cheat Sheet

How to turn the six SOURCE™ pillars into four confident, client-specific callout
bullets — for any industry, without a fixed template.

## Why this isn't templated

The "What SOURCE™ Means for [Client]" box in every proposal needs exactly four
bullets (`title` + one–two sentence `text`, see `sourceCalloutBullets` in
`lib/sampleProposalData.js`). Those bullets are deliberately free text, not a
fixed template, because the whole SOURCE™ pitch is "we find what's unique about
*your* business" — a templated bullet would undercut that on the spot. This
sheet gives you the recipe and the discovery questions, not words to
copy-paste.

## The 4-bullet formula

Every real proposal's four bullets map to the same underlying pattern:

1. **A data pattern only they have** (pillars S + O) — something in their own
   numbers: seasonality, demand timing, service/product mix, customer
   behavior.
2. **An asset built from it** (pillar U) — a benchmark, pricing guide, or
   report that answers a real buyer question ("what does X cost", "when
   should I book X").
3. **Proof via named case studies** (pillars U + C) — specific, named,
   verifiable outcomes, not generic testimonials.
4. **Ongoing citation tracking vs. named competitors** (pillars C + E) — pull
   the actual competitor names straight from that proposal's Gap Analysis
   section, never "your competitors" generically.

## Discovery questions, by pillar

Ask these on the discovery call to find real material before you write a
single bullet.

**S — Source Data** ("what do they already have")
- What software tracks your calls or leads? (CallRail, a CRM, scheduling
  software?)
- How long has the business been running, and roughly how many
  jobs/transactions/patients/cases have gone through it?
- Do you have GBP insights, GA4/GSC history, or review data going back a
  while?

**O — Original Insights** ("what pattern is hiding in that data")
- Is there a busy season, or a spike tied to weather, timing, or an event?
- Do certain services/products/practice areas spike in certain markets or
  months?
- What's the #1 thing people ask before they buy?

**U — Unique Assets** ("what asset would that pattern become")
- Would a "what does X cost in [city]" guide get searched for in your
  market?
- Do you have specific projects, patients, or customers willing to be named
  in a case study?

**R — Reinforcement** ("where else could this live")
- Open to being quoted in press, partner content, or community platforms
  (Reddit/Quora)?

**C — Citations** ("who are we measuring against")
- Who are your 2–3 named competitors? (Already captured in the proposal's
  Gap Analysis competitor list — reuse it, don't re-ask.)

**E — Expansion** ("does this get refreshed")
- Open to an annual refresh of this data/report?

## Industry quick reference

Data source ideas and an example bullet-1 angle per industry (matches the
case-study taxonomy in `lib/caseStudyCategories.js`). These are angles to
adapt with the client's real numbers, not text to paste in.

| Industry | Likely data source | Example angle (bullet 1) |
|---|---|---|
| Aerospace | Certification/turnaround times, contract win history | Certification lead-time benchmark vs. industry norms |
| Business Services | Onboarding time, retention/renewal data | Client-outcomes benchmark by engagement type |
| Dental | Scheduling data, insurance mix, intake seasonality | Patient intake-seasonality study (e.g. January new-patient surge) |
| E-Commerce | Order data, return rates, SKU velocity | Category demand-seasonality report |
| Education | Enrollment cycles, inquiry-to-enrollment timing | Enrollment-funnel timing study |
| Franchise | Cross-location performance, territory demand | Aggregate location-performance benchmark |
| Healthcare | Scheduling/referral data, seasonal condition trends | Referral-source and seasonal-visit study |
| Home Services | CallRail/CRM job history, seasonal service mix | Seasonal demand study (see the sample pergola bullet) |
| Law Firm | Case-type intake volume, consult-to-retention data | Practice-area demand benchmark by season |
| Med Spa | Treatment booking data, seasonal treatment mix | Treatment-seasonality and pricing guide |
| Non-Profit | Donor/volunteer engagement, campaign response timing | Donor-engagement timing study |
| Small Business | Whatever CRM/POS exists — traffic, repeat-customer rate | Customer-behavior benchmark tailored to their vertical |
| Travel | Booking lead-time, seasonal destination demand | Booking-window and demand-seasonality report |

## Before / after

**Dental**
- Weak: "We'll create content that highlights your expertise and helps you
  get found online."
- Specific: "Patient intake-seasonality study — your scheduling data shows a
  January new-patient surge and a pre-summer whitening spike. Published as
  original research, cited when local buyers ask 'best time to book a dental
  cleaning.'"

**Law Firm**
- Weak: "We'll publish case studies to build trust with potential clients."
- Specific: "Case outcomes by practice area — three named, verifiable
  results (with client permission) in [practice area]. AI systems weight
  named, verifiable outcomes over generic testimonials."

**E-Commerce**
- Weak: "We'll track your brand mentions across AI platforms."
- Specific: "Monthly citation tracking vs. [Competitor A] and [Competitor
  B] — how often your product pages get pulled into ChatGPT and Google AI
  Overview shopping answers."

## Do / don't

**Do**
- Name the actual data source the client has (CallRail, CRM, POS,
  scheduling software, GA4/GSC, GBP).
- Name their real competitors — pull straight from that proposal's Gap
  Analysis list.
- Keep each bullet to one sentence of "what" plus one sentence of "why it
  matters to AI/buyers."
- Ground pricing/benchmark bullets in a real buyer question.

**Don't**
- Write a bullet that could apply to literally any client.
- Invent data the client hasn't confirmed they track — ask first.
- Skip bullet 4 (citation tracking) or leave competitors generic.
- Reuse the sample pergola/landscape bullets verbatim for a different
  client — they're an example of the pattern, not copy.
