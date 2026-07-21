// Sample data reproducing the Total Install Outdoor Living proposal, used to
// visually validate the ported template against total_install_proposal_v3.html.
// Not used by the real app once the editor/DB are wired up (task #6).

export const sampleProposalData = {
  clientCompanyName: "Total Install Outdoor Living",
  clientContactName: "Henry Espinoza",
  preparedBy: "Kyle Carney",
  servicesSummary: "Organic SEO · Local/Maps · AI Overviews · AEO/LLM · Google Ads",
  subtitle: "Search Visibility Strategy · 2026",
  heroEmphasisWord: "Outdoor",
  serviceCategory: "Outdoor Living Contractors",

  introText:
    "Rankings on Google still matter — but blue links are now just one of five channels your buyers use to find an outdoor living contractor. Most businesses are optimizing for a search landscape that's been over for two years.",
  landscapePullQuote:
    "When a homeowner types <strong>“best pergola installer near me”</strong> into ChatGPT, checks the Maps pack on their phone, or sees a Google AI Overview — Total Install Outdoor Living isn't in the answer. Somewhere, a competitor is. This strategy closes that gap across all five channels at once.",

  channelCards: [
    {
      key: "organic_seo", title: "ORGANIC SEO", headerActive: true, badgeLabel: "PARTIAL", badgeVariant: "active",
      rows: [
        { label: "Keywords in top 100", value: "1 of 17", severity: "bad" },
        { label: "Best current ranking", value: "#83", severity: "mid" },
        { label: "Page optimization score", value: "16.4 / 100", severity: "bad" },
        { label: "Searches missed / mo", value: "~650", severity: "bad" },
      ],
      strategyNote: "Target: page 1 for “pergola Denver CO” (210/mo), “covered patio Denver” (90/mo), and 14 more priority terms.",
    },
    {
      key: "ai_overviews", title: "AI OVERVIEWS", headerActive: false, badgeLabel: "INVISIBLE", badgeVariant: "invisible",
      rows: [
        { label: "In Google AI summaries", value: "No", severity: "bad" },
        { label: "Content structured for AI", value: "No", severity: "bad" },
        { label: "FAQ schema deployed", value: "No", severity: "bad" },
        { label: "Technical crawl errors", value: "248", severity: "mid" },
      ],
      strategyNote: "Content structured with Q&A frameworks, semantic headers, and topical depth — the exact signals Google uses to decide which sources to summarize above blue links.",
    },
    {
      key: "local_maps", title: "LOCAL / MAPS", headerActive: false, badgeLabel: "INVISIBLE", badgeVariant: "invisible",
      rows: [
        { label: "Maps 3-pack presence", value: "None", severity: "bad" },
        { label: "GBP optimization", value: "Partial", severity: "mid" },
        { label: "NAP citations built", value: "No", severity: "bad" },
        { label: "Local schema deployed", value: "No", severity: "bad" },
      ],
      strategyNote: "GBP optimization, review strategy, local citation network. Target: top-3 Maps pack for primary service + geo combos in Denver and Fort Collins.",
    },
    {
      key: "aeo_llm", title: "AEO / LLM SEARCH", headerActive: false, badgeLabel: "INVISIBLE", badgeVariant: "invisible",
      rows: [
        { label: "Named in ChatGPT", value: "No", severity: "bad" },
        { label: "Named in Perplexity", value: "No", severity: "bad" },
        { label: "AI citation placements", value: "0", severity: "bad" },
        { label: "Indexed brand mentions", value: "Very low", severity: "bad" },
      ],
      strategyNote: "Brand mentions in indexed, authoritative content. “Best Pergola Installers in Denver” listicles — when buyers ask ChatGPT, Total Install gets named.",
    },
    {
      key: "google_ads", title: "GOOGLE ADS", headerActive: false, badgeLabel: "NOT RUNNING", badgeVariant: "not_running",
      rows: [
        { label: "Active campaigns", value: "None", severity: "bad" },
        { label: "Competitors bidding", value: "Yes — unchallenged", severity: "bad" },
        { label: "Paid leads captured", value: "0", severity: "bad" },
        { label: "Est. monthly spend gap", value: "Unknown", severity: "mid" },
      ],
      strategyNote: "3-campaign structure: Business Building (keyword targeting + remarketing), Defensive (brand protection), Aggressive (competitor conquest). Month 1 = baseline testing. Month 3 = KPI-validated scaling.",
    },
  ],

  landscapeStats: [
    { value: "1 of 5", label: "Channels with any current visibility for Total Install" },
    { value: "248", label: "Technical errors suppressing rankings and AI discoverability" },
    { value: "~650", label: "Monthly searches for core services going to competitors" },
  ],

  keywordLedger: [
    { keyword: "pergola Denver CO", rankBadge: "Not ranked", severity: "bad", searches: 210, priority: "↑ Top Priority", hot: true },
    { keyword: "covered patio Denver", rankBadge: "Not ranked", severity: "bad", searches: 90, priority: "↑ Top Priority", hot: true },
    { keyword: "Denver patio contractors", rankBadge: "Not ranked", severity: "bad", searches: 70, priority: "↑ Top Priority", hot: true },
    { keyword: "rooftop patio Denver", rankBadge: "Not ranked", severity: "bad", searches: 70, priority: "↑ High" },
    { keyword: "awning installation Denver", rankBadge: "Not ranked", severity: "bad", searches: 30, priority: "↑ High" },
    { keyword: "retractable awning Denver", rankBadge: "Not ranked", severity: "bad", searches: 30, priority: "↑ High" },
    { keyword: "pergola installer Denver", rankBadge: "Not ranked", severity: "bad", searches: 20, priority: "" },
    { keyword: "outdoor living Denver", rankBadge: "Not ranked", severity: "bad", searches: 10, priority: "" },
    { keyword: "retractable screens Denver", rankBadge: "Not ranked", severity: "bad", searches: 10, priority: "" },
    { keyword: "patio cover installation Denver", rankBadge: "#83", severity: "mid", searches: 10, priority: "Only ranked term", priorityMuted: true },
  ],

  gapPullQuote:
    "<strong>The content signal problem.</strong> Your homepage targets “Awning Installation Denver” but scores 16.4/100 on optimization — the keyword doesn't appear in the title tag once. Competitors average 1,900+ words on comparable pages. You have 696. Google and AI platforms are working with incomplete instructions, so they're choosing someone else.",

  authorityYourDr: 8,
  authorityYourStat: "40 total links · 111 referring domains",
  authorityOpenDoorNote:
    "Every competitor has a domain rating below 10. The entire competitive set is authority-weak. Whoever moves first builds a moat that lasts years.",
  competitors: [
    { name: "FRSR LLC", dr: 5, stat: "103 links · 237 domains" },
    { name: "Western Sky Design", dr: 5, stat: "104 links · 203 domains" },
    { name: "Diggable Designs", dr: 5, stat: "3,170 links · 1,340 domains", alert: true, note: "Heavy citation play" },
    { name: "Elite Landscape", dr: 9, stat: "224 links · 247 domains" },
  ],

  sourceCalloutBullets: [
    { title: "Seasonal demand study", text: "When do Denver homeowners search for pergolas and covered patios? Your project history tells that story. Published as original research, AI cites it when buyers ask." },
    { title: "Pricing benchmark report", text: "“What does a pergola cost in Denver in 2026?” You have the data. We turn it into the definitive answer — the one ChatGPT and Google AI pull from." },
    { title: "Project case studies with named outcomes", text: "Specific installs, specific outcomes, specific neighborhoods. AI systems weight named, verifiable case studies 4.2× more than generic content." },
    { title: "Citation tracking vs. competitors", text: "Monthly reporting on how often Total Install is named in AI responses vs. Western Sky, Diggable Designs, and Elite Landscape." },
  ],

  authorityPullQuote:
    "<strong>Why this matters specifically for Total Install:</strong> Your DR is 8 with 40 total links. Diggable Designs has 1,340 referring domains at the same DR. None of your competitors has a DR above 9. Whoever moves first builds a moat in a market where the door is still wide open.",

  timelineStages: [
    { period: "Weeks 1–2", title: "Signals Foundation + Quick Wins", description: "Keyword map delivered and approved. Meta titles fixed across all priority pages. GA4 + CallRail lead tracking live. GBP audit and optimization begins. Technical error remediation starts. You'll see first ranking movements within 30 days." },
    { period: "Months 1–3", title: "Foundation Build", description: "Technical health score targets 90%+. Priority pages reach 95 optimization score. First authority placements go live. Google Ads launches with baseline auction testing. Rankings move from “not in top 100” toward page 2–3 for priority terms." },
    { period: "Months 4–6", title: "The Compounding Jump", description: "Authority compounds. First-page rankings begin appearing for priority terms. Total Install starts appearing in AI-generated answers. Google Ads cost-per-lead optimizing against KPIs. First SOURCE™ research asset published and distributed." },
    { period: "Months 6–9", title: "Peak ROI Window", description: "For home services clients in comparable Denver-area markets, JDI Windows saw 1,097% traffic growth and Truss Interiors saw 336% lead growth. Your competitive set has lower authority than either of those markets. The ceiling here is high." },
  ],

  caseStudies: [
    { industryLabel: "Home Services · Denver", statNumber: "1,097%", statLabel: "Increase in targeted website traffic", companyNote: "JDI Windows · $1.9M revenue increase" },
    { industryLabel: "Interior Design", statNumber: "336%", statLabel: "Increase in qualified leads", companyNote: "Truss Interiors · 248% traffic growth" },
    { industryLabel: "Local Service Startup", statNumber: "100+", statLabel: "Monthly leads from zero visibility", companyNote: "Mobile Pet Grooming · 18 months" },
  ],

  packages: [
    {
      name: "Visibility", monthlyPrice: 2000, badgeLabel: "", isRecommended: false,
      tagline: "The complete five-channel foundation. Everything you need to establish authority across all five discovery channels.",
      statCallouts: [
        { value: "2", label: "High-DR Link Inserts" },
        { value: "2", label: "AI Citation Listicles" },
        { value: "2", label: "Guest Posts DA 30+" },
        { value: "6", label: "Total placements/mo" },
      ],
      featureGroups: [
        { groupLabel: "Foundation", items: ["Technical SEO & site health monitoring", "In-depth page optimizations — Top 4 pages", "Aggregator submission", "Directory citations — 5–6 / month", "GBP optimization & management", "Schema implementation — Q1 setup"] },
        { groupLabel: "SOURCE™ & Content", items: ["SOURCE™ research asset — 1 / year"] },
        { groupLabel: "Reporting & Strategy", items: ["AI mention & citation tracking", "24/7 reporting dashboard", "Monthly strategy call"] },
      ],
    },
    {
      name: "Dominance", monthlyPrice: 4000, badgeLabel: "Most Popular", isRecommended: true,
      tagline: "For markets where second place isn't an option. Nearly double the authority placements, higher DA targets, ongoing schema, and quarterly SOURCE™ research.",
      statCallouts: [
        { value: "4", label: "High-DR Link Inserts" },
        { value: "3", label: "AI Citation Listicles" },
        { value: "4", label: "Guest Posts DA 40+" },
        { value: "11", label: "Total placements/mo" },
      ],
      featureGroups: [
        { groupLabel: "Foundation", items: ["Technical SEO & site health monitoring", "In-depth page optimizations — Top 6 pages", "Aggregator submission", "Directory citations — 6–7 / month", "GBP optimization & management", "Schema implementation — Ongoing"] },
        { groupLabel: "SOURCE™ & Content", items: ["SOURCE™ research asset — 4 / year"] },
        { groupLabel: "Reporting & Strategy", items: ["AI mention & citation tracking", "24/7 reporting dashboard", "Monthly strategy call"] },
      ],
    },
  ],

  addons: [
    { name: "Google Ads Management", description: "Full campaign management — Business Building, Defensive, and Aggressive structure. Separate 3-month term.", priceAmount: 20, priceUnit: "% of spend", priceNote: "$750 min/mo", category: "addon" },
    { name: "Reddit / Quora Presence", description: "Authentic community engagement — 10 brand mentions/mo. Feeds LLM citation and brand trust signals.", priceAmount: 400, priceUnit: "/mo", category: "addon" },
    { name: "Additional Guest Post (DA 30+)", description: "One additional editorially-placed guest post per month on a DA 30+ domain.", priceAmount: 350, priceUnit: "/mo per post", category: "addon" },
    { name: "Additional Guest Post (DA 40+)", description: "One additional editorially-placed guest post per month on a DA 40+ domain.", priceAmount: 500, priceUnit: "/mo per post", category: "addon" },
    { name: "Additional Guest Post (DA 50+)", description: "One additional premium guest post per month on a DA 50+ domain.", priceAmount: 750, priceUnit: "/mo per post", category: "addon" },
    { name: "Additional AI Citation Listicle", description: "One additional “Best [service] in [market]” placement per month on an AI-indexed domain.", priceAmount: 300, priceUnit: "/mo per placement", category: "addon" },
    { name: "Advanced GA4 + CallRail Setup", description: "Full conversion tracking — form submissions, phone calls, and lead attribution by channel.", priceAmount: 250, priceUnit: "/mo", category: "addon" },
    { name: "Additional SOURCE™ Research Asset", description: "One additional original research report, benchmark study, or case study beyond your package allocation.", priceAmount: 1200, priceUnit: "one-time", category: "addon" },
    { name: "Campaign setup fee", priceAmount: 1000, priceUnit: "one-time", category: "one_time_fee" },
    { name: "Website redesign", priceAmount: 3500, priceUnit: "one-time", category: "one_time_fee" },
    { name: "SSL setup", priceAmount: 100, priceUnit: "one-time", category: "one_time_fee" },
    { name: "Site / hosting transfer", priceAmount: 300, priceUnit: "one-time", priceNote: "$300–$800 depending on scope", category: "one_time_fee" },
  ],
};
