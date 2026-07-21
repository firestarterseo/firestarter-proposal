-- Staff sign in via Supabase Auth magic-link (admin-invited, no self-signup —
-- see middleware.js / app/login). This trigger gives every new auth.users row
-- a profiles row automatically, seeded with the email's local part as a
-- reasonable default display_name, since there's no signup form to collect one.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(split_part(new.email, '@', 1), 'Team member'));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
