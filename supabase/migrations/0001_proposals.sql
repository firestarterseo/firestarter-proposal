-- Firestarter Proposals — core schema
-- Catalog tables (packages/add-ons/case studies) are shared, admin-maintained
-- reference data. Proposal tables hold the per-client structured content.
-- See app/globals.css + components/proposal/* for how these fields render.

create extension if not exists pgcrypto;

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Staff profiles ---------------------------------------------------------
-- "Prepared by" on a proposal pulls from here instead of being retyped.
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();

-- Catalog: case studies ----------------------------------------------------
create table case_studies (
  id uuid primary key default gen_random_uuid(),
  industry_label text not null,
  stat_number text not null,
  stat_label text not null,
  company_note text not null,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_case_studies_updated_at
  before update on case_studies
  for each row execute function set_updated_at();

-- Catalog: service packages -------------------------------------------------
-- stat_callouts: [{value, label}]
-- feature_groups: [{group_label, items: [text]}]
create table service_packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  monthly_price numeric(10,2) not null,
  tagline text default '',
  badge_label text default '',
  stat_callouts jsonb not null default '[]',
  feature_groups jsonb not null default '[]',
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_service_packages_updated_at
  before update on service_packages
  for each row execute function set_updated_at();

-- Catalog: add-ons and one-time fees ---------------------------------------
create table addon_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text default '',
  price_amount numeric(10,2) not null,
  price_unit text not null default '/mo', -- e.g. "/mo", "one-time", "% of spend"
  price_note text default '',             -- e.g. "$750 min/mo"
  category text not null check (category in ('addon', 'one_time_fee')),
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_addon_items_updated_at
  before update on addon_items
  for each row execute function set_updated_at();

-- Proposals -----------------------------------------------------------------
create table proposals (
  id uuid primary key default gen_random_uuid(),
  share_token text not null unique, -- generated app-side via lib/tokens.js, not a DB default

  status text not null default 'draft'
    check (status in ('draft', 'sent', 'viewed', 'accepted', 'declined')),

  -- Cover
  client_company_name text not null,
  client_contact_name text default '',
  client_email text not null,
  prepared_by text default '',
  services_summary text default '',
  subtitle text default '',
  hero_emphasis_word text default '',

  -- 01 Landscape
  intro_text text default '',
  landscape_pull_quote text default '',
  channel_cards jsonb not null default '[]',   -- [{title, badge, severity, rows:[{label,value,severity}], strategy_note}]
  landscape_stats jsonb not null default '[]', -- [{value, label}]

  -- 02 Gap analysis
  keyword_ledger jsonb not null default '[]',  -- [{keyword, rank_badge, severity, searches, priority}]
  gap_pull_quote text default '',
  authority_your_dr numeric,
  authority_your_stat text default '',
  authority_open_door_note text default '',
  competitors jsonb not null default '[]',     -- [{name, dr, stat, alert, note}]

  -- SOURCE(TM) client callout
  source_callout_bullets jsonb not null default '[]', -- [{title, text}]

  -- 04 Authority
  authority_pull_quote text default '',

  -- 05 Investment
  timeline_stages jsonb not null default '[]', -- [{period, title, description}] x4

  -- Case studies (selected from catalog)
  selected_case_study_ids uuid[] not null default '{}',

  -- Audit timestamps
  sent_at timestamptz,
  first_viewed_at timestamptz,
  accepted_at timestamptz,
  declined_at timestamptz,

  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_proposals_updated_at
  before update on proposals
  for each row execute function set_updated_at();
create index idx_proposals_status on proposals(status);
create index idx_proposals_created_at on proposals(created_at desc);

-- Proposal packages (snapshot of service_packages at selection time) --------
create table proposal_packages (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references proposals(id) on delete cascade,
  package_id uuid references service_packages(id) on delete set null,
  is_recommended boolean not null default false,
  sort_order int not null default 0,
  name text not null,
  monthly_price numeric(10,2) not null,
  tagline text default '',
  badge_label text default '',
  stat_callouts jsonb not null default '[]',
  feature_groups jsonb not null default '[]'
);
create index idx_proposal_packages_proposal on proposal_packages(proposal_id);

-- Proposal add-ons / one-time fees (snapshot of addon_items) ----------------
create table proposal_addons (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references proposals(id) on delete cascade,
  addon_id uuid references addon_items(id) on delete set null,
  category text not null check (category in ('addon', 'one_time_fee')),
  sort_order int not null default 0,
  name text not null,
  description text default '',
  price_amount numeric(10,2) not null,
  price_unit text not null default '/mo',
  price_note text default ''
);
create index idx_proposal_addons_proposal on proposal_addons(proposal_id);

-- Audit log ------------------------------------------------------------------
create table proposal_events (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references proposals(id) on delete cascade,
  event_type text not null check (event_type in ('sent', 'viewed', 'accepted', 'declined')),
  actor_name text,       -- typed signer name, accept events only
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);
create index idx_proposal_events_proposal on proposal_events(proposal_id, created_at desc);

-- Row Level Security ----------------------------------------------------------
-- Single-tier, no RBAC (matches the health dashboard's model): any logged-in
-- staff member can do anything. The public /view/[token] flow never uses the
-- anon key at all — it goes through the service-role admin client server-side
-- (see lib/supabase/admin.js) — so there are deliberately zero anon policies
-- anywhere below. If the anon key ever ends up in a public-page bundle by
-- mistake, it gets zero rows on every table, always.

alter table profiles enable row level security;
alter table case_studies enable row level security;
alter table service_packages enable row level security;
alter table addon_items enable row level security;
alter table proposals enable row level security;
alter table proposal_packages enable row level security;
alter table proposal_addons enable row level security;
alter table proposal_events enable row level security;

create policy "staff full access" on profiles
  for all to authenticated using (true) with check (true);
create policy "staff full access" on case_studies
  for all to authenticated using (true) with check (true);
create policy "staff full access" on service_packages
  for all to authenticated using (true) with check (true);
create policy "staff full access" on addon_items
  for all to authenticated using (true) with check (true);
create policy "staff full access" on proposals
  for all to authenticated using (true) with check (true);
create policy "staff full access" on proposal_packages
  for all to authenticated using (true) with check (true);
create policy "staff full access" on proposal_addons
  for all to authenticated using (true) with check (true);
create policy "staff full access" on proposal_events
  for all to authenticated using (true) with check (true);
