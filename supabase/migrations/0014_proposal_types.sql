-- Adds support for non-SEO proposal types (General SOW, PPC-only, Website),
-- per Kyle's Drive doc "Proposal Software Feedback" (Prompt 1) and the real
-- example proposals shared alongside it. All new columns are additive with
-- safe defaults, so every existing proposal (currently all implicitly full
-- SEO proposals) keeps behaving exactly as before with proposal_type = 'seo'.
-- This is a documentation-only record of a live data change applied via the
-- Supabase MCP service-role client (this project has no migration runner),
-- matching the precedent set by migrations 0002/0010/0012/0013.

alter table proposals
  add column proposal_type text not null default 'seo'
    check (proposal_type in ('seo', 'seo_ppc', 'ppc', 'sow', 'website'));

-- Freeform Description/Price/Qty line items — used by the non-catalog-based
-- Investment layout that General SOW, PPC-only, and Website proposals use
-- (see the real example proposals in the shared Drive folder), as opposed
-- to the package/add-on cards the full SEO Investment section uses.
-- Shape: [{ description, price_amount, price_unit, qty, group }]
-- `group` distinguishes a second table on the same proposal (e.g. Website's
-- "Other Costs" table vs its primary "Design & Development" table).
alter table proposals
  add column line_items jsonb not null default '[]'::jsonb;

-- The freeform "Based on our recommendations..." paragraph that precedes
-- the line-item table in the real examples.
alter table proposals
  add column investment_recommendation text not null default '';

alter table proposals
  add column discount_label text not null default '';

alter table proposals
  add column discount_amount numeric;
