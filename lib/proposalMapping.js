// Shared between the editor's live preview, the internal detail page, and the
// public /view/[token] page — all three need to turn DB rows (proposals +
// its proposal_packages/proposal_addons snapshot rows + selected case_studies)
// into the single camelCase shape components/proposal/ProposalDocument.js renders.

export function mapProposalRowToDocumentData(proposal, { packages = [], addons = [], caseStudies = [] } = {}) {
  return {
    clientCompanyName: proposal.client_company_name,
    clientContactName: proposal.client_contact_name,
    preparedBy: proposal.prepared_by,
    servicesSummary: proposal.services_summary,
    subtitle: proposal.subtitle,
    heroEmphasisWord: proposal.hero_emphasis_word,

    introText: proposal.intro_text,
    landscapePullQuote: proposal.landscape_pull_quote,
    channelCards: proposal.channel_cards || [],
    landscapeStats: proposal.landscape_stats || [],

    keywordLedger: proposal.keyword_ledger || [],
    gapPullQuote: proposal.gap_pull_quote,
    authorityYourDr: proposal.authority_your_dr,
    authorityYourStat: proposal.authority_your_stat,
    authorityOpenDoorNote: proposal.authority_open_door_note,
    competitors: proposal.competitors || [],

    sourceCalloutBullets: proposal.source_callout_bullets || [],
    authorityPullQuote: proposal.authority_pull_quote,
    timelineStages: proposal.timeline_stages || [],

    caseStudies: caseStudies.map((cs) => ({
      industryLabel: cs.industry_label,
      statNumber: cs.stat_number,
      statLabel: cs.stat_label,
      companyNote: cs.company_note,
    })),

    packages: packages
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((p) => ({
        name: p.name,
        monthlyPrice: p.monthly_price,
        tagline: p.tagline,
        badgeLabel: p.badge_label,
        isRecommended: p.is_recommended,
        statCallouts: p.stat_callouts || [],
        featureGroups: (p.feature_groups || []).map((g) => ({ groupLabel: g.group_label, items: g.items })),
      })),

    addons: addons
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((a) => ({
        name: a.name,
        description: a.description,
        priceAmount: a.price_amount,
        priceUnit: a.price_unit,
        priceNote: a.price_note,
        category: a.category,
      })),
  };
}

export const TIMELINE_DEFAULTS = [
  { period: "Weeks 1–2", title: "Signals Foundation + Quick Wins", description: "Keyword map delivered and approved. Meta titles fixed across all priority pages. GA4 + CallRail lead tracking live. GBP audit and optimization begins. Technical error remediation starts. You'll see first ranking movements within 30 days." },
  { period: "Months 1–3", title: "Foundation Build", description: "Technical health score targets 90%+. Priority pages reach 95 optimization score. First authority placements go live. Rankings move toward page 2–3 for priority terms." },
  { period: "Months 4–6", title: "The Compounding Jump", description: "Authority compounds. First-page rankings begin appearing for priority terms. Client starts appearing in AI-generated answers. First SOURCE™ research asset published and distributed." },
  { period: "Months 6–9", title: "Peak ROI Window", description: "Rankings and authority continue compounding. This is typically where clients see the sharpest month-over-month gains." },
];

export const CHANNEL_DEFAULTS = [
  { key: "organic_seo", title: "ORGANIC SEO", headerActive: false, badgeLabel: "INVISIBLE", badgeVariant: "invisible", rows: [{ label: "", value: "", severity: "bad" }, { label: "", value: "", severity: "bad" }, { label: "", value: "", severity: "bad" }, { label: "", value: "", severity: "bad" }], strategyNote: "" },
  { key: "ai_overviews", title: "AI OVERVIEWS", headerActive: false, badgeLabel: "INVISIBLE", badgeVariant: "invisible", rows: [{ label: "", value: "", severity: "bad" }, { label: "", value: "", severity: "bad" }, { label: "", value: "", severity: "bad" }, { label: "", value: "", severity: "bad" }], strategyNote: "" },
  { key: "local_maps", title: "LOCAL / MAPS", headerActive: false, badgeLabel: "INVISIBLE", badgeVariant: "invisible", rows: [{ label: "", value: "", severity: "bad" }, { label: "", value: "", severity: "bad" }, { label: "", value: "", severity: "bad" }, { label: "", value: "", severity: "bad" }], strategyNote: "" },
  { key: "aeo_llm", title: "AEO / LLM SEARCH", headerActive: false, badgeLabel: "INVISIBLE", badgeVariant: "invisible", rows: [{ label: "", value: "", severity: "bad" }, { label: "", value: "", severity: "bad" }, { label: "", value: "", severity: "bad" }, { label: "", value: "", severity: "bad" }], strategyNote: "" },
  { key: "google_ads", title: "GOOGLE ADS", headerActive: false, badgeLabel: "NOT RUNNING", badgeVariant: "not_running", rows: [{ label: "", value: "", severity: "bad" }, { label: "", value: "", severity: "bad" }, { label: "", value: "", severity: "bad" }, { label: "", value: "", severity: "bad" }], strategyNote: "" },
];
