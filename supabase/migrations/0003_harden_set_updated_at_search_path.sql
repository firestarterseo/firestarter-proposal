-- Closes the Supabase linter's "function_search_path_mutable" warning on
-- set_updated_at (0001_proposals.sql) by pinning an empty search_path.
create or replace function set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
