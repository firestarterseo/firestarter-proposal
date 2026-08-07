// Shared between the editor's live preview, the internal detail page, and the
// public /view/[token] page — all three need to turn DB rows (proposals +
// its proposal_packages/proposal_addons snapshot rows + selected case_studies)
// into the single camelCase shape components/proposal/ProposalDocument.js renders.

export function mapProposalRowToDocumentData(proposal, { packages = [], addons = [], caseStudies = [] } = {}) {
  const { introText, landscapePullQuote } = buildLandscapeCopy({
    industryLabel: proposal.industry_label,
    targetCustomerLabel: proposal.target_customer_label,
    targetKeywordExample: proposal.target_keyword_example,
    clientCompanyName: proposal.client_company_name,
  });

  const mappedPackages = packages
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((p) => ({
      name: p.name,
      monthlyPrice: p.monthly_price,
      tagline: p.tagline,
      badgeLabel: p.badge_label,
      isRecommended: p.is_recommended,
      statCallouts: p.stat_callouts || [],
      featureGroups: (p.feature_groups || []).map((g) => ({ groupLabel: g.group_label, items: g.items })),
    }));

  const mappedAddons = addons
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((a) => ({
      name: a.name,
      description: a.description,
      priceAmount: a.price_amount,
      priceUnit: a.price_unit,
      priceNote: a.price_note,
      category: a.category,
    }));

  return {
    clientCompanyName: proposal.client_company_name,
    clientContactName: proposal.client_contact_name,
    clientAddress: proposal.client_address,
    acceptedAt: proposal.accepted_at,
    preparedBy: proposal.prepared_by,
    servicesSummary: proposal.services_summary,
    subtitle: proposal.subtitle,
    heroEmphasisWord: proposal.hero_emphasis_word,

    introText,
    landscapePullQuote,
    channelCards: proposal.channel_cards || [],
    landscapeStats: proposal.landscape_stats || [],

    keywordLedger: proposal.keyword_ledger || [],
    gapPullQuote: proposal.gap_pull_quote,
    authorityYourDr: proposal.authority_your_dr,
    authorityYourReferringDomains: proposal.authority_your_referring_domains,
    authorityOpenDoorNote: proposal.authority_open_door_note,
    competitors: proposal.competitors || [],

    sourceCalloutBullets: proposal.source_callout_bullets || [],
    authorityPullQuote: proposal.authority_pull_quote,

    caseStudies: caseStudies.map((cs) => ({
      industryLabel: cs.industry_label,
      statNumber: cs.stat_number,
      statLabel: cs.stat_label,
      companyNote: cs.company_note,
    })),

    packages: mappedPackages,
    addons: mappedAddons,
    agreementFinancials: computeAgreementFinancials(mappedPackages, mappedAddons),
  };
}

// Standardized per the sales rep's feedback: two fixed templates with a
// handful of client-specific variables, rather than free-typed paragraphs.
// Shared by the editor's live preview and the real document render so they
// can never drift apart.
export function buildLandscapeCopy({ industryLabel, targetCustomerLabel, targetKeywordExample, clientCompanyName }) {
  const industry = industryLabel || "[industry]";
  const customer = targetCustomerLabel || "[target customer]";
  const keyword = targetKeywordExample || "[target keyword]";
  const client = clientCompanyName || "[Client]";
  return {
    introText: `Rankings on Google still matter, but blue links are now just one of five channels your buyers use to find a ${industry} provider. Most businesses are optimizing for a search landscape that changed years ago.`,
    landscapePullQuote: `When a ${customer} types “${keyword}” into ChatGPT, checks the Maps pack on their phone, or sees a Google AI Overview, ${client} isn’t in the answer. A competitor is. This strategy closes that gap across all five channels at once.`,
  };
}

// Feeds the {setup_fee}/{total_monthly} figures in the service agreement
// (components/proposal/ServiceAgreementSection.js) — these are the real
// numbers being signed, so they're computed once here from the same
// packages/addons snapshot the Investment section renders, not re-typed.
// Assumes the recommended package (or the only one, if just one is present)
// is the tier actually being agreed to — if a proposal shows multiple tiers
// as live alternatives, this is a simplification worth revisiting.
export function computeAgreementFinancials(packages, addons) {
  const recommended = packages.find((p) => p.isRecommended) || packages[0];
  const packageMonthly = recommended ? Number(recommended.monthlyPrice) || 0 : 0;

  const recurringAddonsTotal = addons
    .filter((a) => a.category !== "one_time_fee" && a.priceUnit !== "% of spend")
    .reduce((sum, a) => sum + (Number(a.priceAmount) || 0), 0);

  const setupFee = addons
    .filter((a) => a.category === "one_time_fee")
    .reduce((sum, a) => sum + (Number(a.priceAmount) || 0), 0);

  return {
    setupFee,
    totalMonthly: packageMonthly + recurringAddonsTotal,
  };
}

// Fixed timeline copy (05 — Investment section). No longer proposal-specific
// per the rep's feedback — see components/proposal/InvestmentSection.js.
export const TIMELINE_DEFAULTS = [
  { period: "Weeks 1–2", title: "Signals Foundation + Quick Wins", description: "Keyword map delivered and approved. Meta titles fixed across all priority pages. GA4 + CallRail lead tracking live. GBP audit and optimization begins. Technical error remediation starts. You'll see first ranking movements within 30 days." },
  { period: "Months 1–3", title: "Foundation Build", description: "Technical health score targets 90%+. Priority pages reach 95 optimization score. First authority placements go live. Rankings move toward page 2–3 for priority terms." },
  { period: "Months 4–6", title: "The Compounding Jump", description: "Authority compounds. First-page rankings begin appearing for priority terms. Client starts appearing in AI-generated answers. First SOURCE™ research asset published and distributed." },
  { period: "Months 6–9", title: "Peak ROI Window", description: "Rankings and authority continue compounding. This is typically where clients see the sharpest month-over-month gains." },
];

// Fixed per-channel stat rows (label + input type), matching the rep's spec
// exactly. `invertPolarity` flips the usual "Yes = good" reading for rows
// where a "Yes" answer is actually bad news for the client (e.g. competitors
// running ads while you aren't).
export const CHANNEL_ROW_CONFIG = {
  organic_seo: [
    { label: "Keywords in top 100", fieldType: "text" },
    { label: "Best current ranking", fieldType: "text" },
    { label: "Page optimization score", fieldType: "text" },
    { label: "Searches missed / mo", fieldType: "text" },
  ],
  ai_overviews: [
    { label: "In Google AI summaries", fieldType: "ynp" },
    { label: "Content structured for AI", fieldType: "yn" },
    { label: "FAQ schema deployed", fieldType: "yn" },
    { label: "Technical crawl errors", fieldType: "text" },
  ],
  local_maps: [
    { label: "Maps 3-pack presence", fieldType: "ynp" },
    { label: "GBP optimization", fieldType: "ynp" },
    { label: "NAP citations built", fieldType: "ynp" },
    { label: "Local schema deployed", fieldType: "ynp" },
  ],
  aeo_llm: [
    { label: "Named in ChatGPT", fieldType: "ynp" },
    { label: "Named in Perplexity", fieldType: "ynp" },
    { label: "AI citation placements", fieldType: "text" },
    { label: "Indexed brand mentions", fieldType: "text" },
  ],
  google_ads: [
    { label: "Active campaigns", fieldType: "ynp" },
    { label: "Competitors bidding", fieldType: "ynp", invertPolarity: true },
    { label: "Paid leads captured", fieldType: "text" },
    { label: "Est. monthly spend gap", fieldType: "text" },
  ],
};

// Maps a yn/ynp answer to bad/mid/good automatically. Returns null for
// fieldType "text" rows, which keep a manually-picked severity instead.
export function deriveSeverity(fieldType, value, invertPolarity = false) {
  if (fieldType === "text") return null;
  const normalized = (value || "").toLowerCase();
  let severity = "neutral";
  if (fieldType === "yn") {
    if (normalized === "yes") severity = "good";
    else if (normalized === "no") severity = "bad";
  } else if (fieldType === "ynp") {
    if (normalized === "yes") severity = "good";
    else if (normalized === "partial") severity = "mid";
    else if (normalized === "no") severity = "bad";
  }
  if (invertPolarity) {
    if (severity === "good") severity = "bad";
    else if (severity === "bad") severity = "good";
  }
  return severity;
}

function buildDefaultRows(channelKey) {
  return CHANNEL_ROW_CONFIG[channelKey].map((cfg) => ({ label: cfg.label, value: "", severity: "bad" }));
}

export const CHANNEL_DEFAULTS = [
  { key: "organic_seo", title: "ORGANIC SEO", headerActive: false, badgeLabel: "INVISIBLE", badgeVariant: "invisible", rows: buildDefaultRows("organic_seo"), strategyNote: "" },
  { key: "ai_overviews", title: "AI OVERVIEWS", headerActive: false, badgeLabel: "INVISIBLE", badgeVariant: "invisible", rows: buildDefaultRows("ai_overviews"), strategyNote: "" },
  { key: "local_maps", title: "LOCAL / MAPS", headerActive: false, badgeLabel: "INVISIBLE", badgeVariant: "invisible", rows: buildDefaultRows("local_maps"), strategyNote: "" },
  { key: "aeo_llm", title: "AEO / LLM SEARCH", headerActive: false, badgeLabel: "INVISIBLE", badgeVariant: "invisible", rows: buildDefaultRows("aeo_llm"), strategyNote: "" },
  { key: "google_ads", title: "GOOGLE ADS", headerActive: false, badgeLabel: "NOT RUNNING", badgeVariant: "not_running", rows: buildDefaultRows("google_ads"), strategyNote: "" },
];
