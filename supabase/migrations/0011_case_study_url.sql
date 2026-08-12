-- Lets a case study link to its real, published write-up so a client can
-- click through instead of just reading a stat card (components/proposal/
-- StrategySection.js wraps the card in <a> when this is set). Optional,
-- and left blank by the round-2 bulk import in 0012 — no real URLs were
-- available to import, only stats, so Kyle fills these in per case study
-- via the catalog editor as write-ups go live.

alter table case_studies add column case_study_url text default '';
