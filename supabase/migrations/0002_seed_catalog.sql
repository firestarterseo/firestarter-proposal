-- Seed the shared catalog from Firestarter's current standard pricing menu
-- (as of the Total Install Outdoor Living proposal). Staff can edit these
-- via /catalog/* once that's built; this just gives the catalog a real
-- starting point instead of an empty table.

insert into service_packages (name, monthly_price, tagline, badge_label, stat_callouts, feature_groups, sort_order) values
(
  'Visibility',
  2000,
  'The complete five-channel foundation. Everything you need to establish authority across all five discovery channels.',
  '',
  '[
    {"value": "2", "label": "High-DR Link Inserts"},
    {"value": "2", "label": "AI Citation Listicles"},
    {"value": "2", "label": "Guest Posts DA 30+"},
    {"value": "6", "label": "Total placements/mo"}
  ]'::jsonb,
  '[
    {"group_label": "Foundation", "items": [
      "Technical SEO & site health monitoring",
      "In-depth page optimizations — Top 4 pages",
      "Aggregator submission",
      "Directory citations — 5–6 / month",
      "GBP optimization & management",
      "Schema implementation — Q1 setup"
    ]},
    {"group_label": "SOURCE™ & Content", "items": [
      "SOURCE™ research asset — 1 / year"
    ]},
    {"group_label": "Reporting & Strategy", "items": [
      "AI mention & citation tracking",
      "24/7 reporting dashboard",
      "Monthly strategy call"
    ]}
  ]'::jsonb,
  0
),
(
  'Dominance',
  4000,
  'For markets where second place isn''t an option. Nearly double the authority placements, higher DA targets, ongoing schema, and quarterly SOURCE™ research.',
  'Most Popular',
  '[
    {"value": "4", "label": "High-DR Link Inserts"},
    {"value": "3", "label": "AI Citation Listicles"},
    {"value": "4", "label": "Guest Posts DA 40+"},
    {"value": "11", "label": "Total placements/mo"}
  ]'::jsonb,
  '[
    {"group_label": "Foundation", "items": [
      "Technical SEO & site health monitoring",
      "In-depth page optimizations — Top 6 pages",
      "Aggregator submission",
      "Directory citations — 6–7 / month",
      "GBP optimization & management",
      "Schema implementation — Ongoing"
    ]},
    {"group_label": "SOURCE™ & Content", "items": [
      "SOURCE™ research asset — 4 / year"
    ]},
    {"group_label": "Reporting & Strategy", "items": [
      "AI mention & citation tracking",
      "24/7 reporting dashboard",
      "Monthly strategy call"
    ]}
  ]'::jsonb,
  1
);

insert into addon_items (name, description, price_amount, price_unit, price_note, category, sort_order) values
('Google Ads Management', 'Full campaign management — Business Building, Defensive, and Aggressive structure. Separate 3-month term.', 20, '% of spend', '$750 min/mo', 'addon', 0),
('Reddit / Quora Presence', 'Authentic community engagement — 10 brand mentions/mo. Feeds LLM citation and brand trust signals.', 400, '/mo', '', 'addon', 1),
('Additional Guest Post (DA 30+)', 'One additional editorially-placed guest post per month on a DA 30+ domain.', 350, '/mo per post', '', 'addon', 2),
('Additional Guest Post (DA 40+)', 'One additional editorially-placed guest post per month on a DA 40+ domain.', 500, '/mo per post', '', 'addon', 3),
('Additional Guest Post (DA 50+)', 'One additional premium guest post per month on a DA 50+ domain.', 750, '/mo per post', '', 'addon', 4),
('Additional AI Citation Listicle', 'One additional "Best [service] in [market]" placement per month on an AI-indexed domain.', 300, '/mo per placement', '', 'addon', 5),
('Advanced GA4 + CallRail Setup', 'Full conversion tracking — form submissions, phone calls, and lead attribution by channel.', 250, '/mo', '', 'addon', 6),
('Additional SOURCE™ Research Asset', 'One additional original research report, benchmark study, or case study beyond your package allocation.', 1200, 'one-time', '', 'addon', 7),
('Campaign setup fee', '', 1000, 'one-time', '', 'one_time_fee', 0),
('Website redesign', '', 3500, 'one-time', '', 'one_time_fee', 1),
('SSL setup', '', 100, 'one-time', '', 'one_time_fee', 2),
('Site / hosting transfer', '', 300, 'one-time', '$300–$800 depending on scope', 'one_time_fee', 3);

insert into case_studies (industry_label, stat_number, stat_label, company_note, sort_order) values
('Home Services · Denver', '1,097%', 'Increase in targeted website traffic', 'JDI Windows · $1.9M revenue increase', 0),
('Interior Design', '336%', 'Increase in qualified leads', 'Truss Interiors · 248% traffic growth', 1),
('Local Service Startup', '100+', 'Monthly leads from zero visibility', 'Mobile Pet Grooming · 18 months', 2);
