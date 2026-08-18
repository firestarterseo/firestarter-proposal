// Proposal type definitions — see docs/proposal-types-questionnaire.md and the
// real example proposals Kyle shared (General SOW, PPC-only, Website) for
// where these behaviors came from.
//
// Only "seo" and "seo_ppc" use the full strategy build-out (landscape,
// keyword gap analysis, strategy channels, SOURCE™, authority) and the
// catalog-driven package/add-on Investment section. The other three are
// intentionally lighter: they skip straight to a freeform line-item
// Investment table (see LineItemsInvestmentSection.js / proposals.line_items).
//
// "seo_ppc" is not a separate template — per Kyle's feedback it's the full
// SEO proposal with the PPC keyword/forecast content bolted in. For now it
// renders identically to "seo"; the PPC-specific bolt-on section is a
// follow-up (see docs/proposal-types-questionnaire.md E1).
export const PROPOSAL_TYPE_OPTIONS = [
  { value: "seo", label: "SEO" },
  { value: "seo_ppc", label: "SEO + PPC" },
  { value: "ppc", label: "PPC only" },
  { value: "sow", label: "General Scope of Work" },
  { value: "website", label: "Website" },
];

export function proposalTypeLabel(type) {
  return PROPOSAL_TYPE_OPTIONS.find((t) => t.value === type)?.label || type;
}

// Full strategy build-out (landscape/gap-analysis/strategy/source/authority)
// plus the catalog package+add-on Investment cards.
export function usesStrategyContent(proposalType) {
  return proposalType === "seo" || proposalType === "seo_ppc";
}

// Freeform Description/Price/Qty line items instead of catalog packages.
export function usesLineItemInvestment(proposalType) {
  return !usesStrategyContent(proposalType);
}

// Per the real Website example (Brothers BBQ) — no legal Service Agreement
// page at all, straight from pricing to Next Steps + signature. Every other
// type reuses the same agreement wording Kyle's SOW and PPC-only examples
// showed verbatim, with only the "Services we'll provide" framing implied
// by context.
export function usesLegalAgreement(proposalType) {
  return proposalType !== "website";
}
