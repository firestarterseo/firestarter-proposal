-- Monthly Deliverables (components/proposal/AuthoritySection.js) was a fixed,
-- hardcoded block that never changed no matter which package tier a proposal
-- recommended — so it could show numbers that didn't match the actual plan
-- being sold. Ties it to the package instead: one deliverables list per
-- tier, editable in the catalog (components/catalog/PackagesManager.js)
-- alongside stat_callouts/feature_groups, snapshotted onto proposal_packages
-- like everything else selected on a proposal.
-- Shape: [{title, description}]

alter table service_packages add column monthly_deliverables jsonb not null default '[]';
alter table proposal_packages add column monthly_deliverables jsonb not null default '[]';

update service_packages set monthly_deliverables = '[
  {"title": "6 Guest Post / AI Citation Placements / mo", "description": "High-authority links + AI brand mentions combined"},
  {"title": "5–6 NAP Citations / month", "description": "Consistent business info across every major directory"},
  {"title": "1 SOURCE™ Research Asset / year", "description": "Original research that builds topical authority for AI citation"},
  {"title": "Top 4 Pages Optimized", "description": "Bringing key service pages up to a 95 optimization score"}
]' where name = 'Visibility';

update service_packages set monthly_deliverables = '[
  {"title": "11 Guest Post / AI Citation Placements / mo", "description": "High-authority links + AI brand mentions combined"},
  {"title": "6–7 NAP Citations / month", "description": "Consistent business info across every major directory"},
  {"title": "4 SOURCE™ Research Assets / year", "description": "Original research that builds topical authority for AI citation"},
  {"title": "Top 6 Pages Optimized", "description": "Bringing key service pages up to a 95 optimization score"}
]' where name = 'Dominance';
