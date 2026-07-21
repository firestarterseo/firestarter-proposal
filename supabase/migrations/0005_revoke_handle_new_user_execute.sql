-- handle_new_user() (0004) is meant to run only as a trigger on auth.users
-- inserts, which executes with elevated privileges regardless of role grants.
-- Being SECURITY DEFINER, it was otherwise directly callable by anon/
-- authenticated via the public REST API (/rest/v1/rpc/handle_new_user) —
-- closing that off per the Supabase linter's recommendation.
revoke execute on function public.handle_new_user() from anon, authenticated;
