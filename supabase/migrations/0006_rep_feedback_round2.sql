-- Round 2 of sales-rep feedback: templated landscape copy, structured
-- authority stats, category-tagged case studies, and multi-option add-ons.
-- See the plan doc for full context on why each column exists.

alter table proposals
  add column industry_label text default '',
  add column target_customer_label text default '',
  add column target_keyword_example text default '',
  add column authority_your_referring_domains numeric;

-- intro_text / landscape_pull_quote / timeline_stages / authority_your_stat
-- stay in place but are no longer written by the app — computed/fixed content
-- replaces them (see lib/proposalMapping.js buildLandscapeCopy and
-- components/proposal/InvestmentSection.js's hardcoded timeline).

alter table case_studies
  add column industry_category text default '',
  add column service_category text default '';

alter table addon_items
  add column pricing_options jsonb;
