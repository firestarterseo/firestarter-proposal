-- Adds PPC-specific content fields used by PPC-only and SEO+PPC proposals
-- (see lib/proposalTypes.js usesPpcContent and
-- components/proposal/PpcStrategySection.js), per Kyle's live feedback:
-- "Nothing related to PPC populates when these are selected." All new
-- columns are additive with safe defaults, so existing proposals are
-- unaffected. This is a documentation-only record of a live data change
-- applied via the Supabase MCP service-role client (this project has no
-- migration runner), matching the precedent set by migration 0014.

-- Target keyword table shown in the PPC strategy section.
-- Shape: [{ keyword, searches }]
alter table proposals
  add column ppc_keywords jsonb not null default '[]'::jsonb;

-- Average cost-per-click used to derive the budget/CPA forecast table.
-- Forecast math: clicks = budget / ppc_avg_cpc;
-- conversions(rate) = clicks * rate; cpa(rate) = ppc_avg_cpc / rate
-- (shown at 5% and 10% conversion-rate assumptions).
alter table proposals
  add column ppc_avg_cpc numeric;

-- Monthly budget tiers to forecast against ppc_avg_cpc.
-- Shape: [{ budget }]
alter table proposals
  add column ppc_budget_tiers jsonb not null default '[]'::jsonb;
