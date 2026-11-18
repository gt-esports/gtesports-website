-- Keep RPC signatures compatible with deployed clients. Discord contact is sourced from the linked provider.
create or replace function public.complete_competitor_onboarding(roster_id uuid, player_name text, discord_contact text, in_game_account text)
returns void language plpgsql security definer set search_path = '' as $$
declare discord_username text;
begin
  if auth.uid() is null then raise exception 'Sign in to complete onboarding.' using errcode = '42501'; end if;
  select nullif(btrim(identity_data->>'full_name'), '') into discord_username
    from auth.identities
    where user_id = auth.uid() and provider = 'discord';
  if discord_username is null then
    raise exception 'Sign in with Discord to save your competitor profile.' using errcode = '22023';
  end if;
  if in_game_account is null or btrim(in_game_account) = '' then
    raise exception 'Enter your in-game account.' using errcode = '22023';
  end if;
  update public.competitor_roster set preferred_name = btrim(player_name), discord = discord_username, game_account = btrim(in_game_account), onboarding = 'complete', updated_at = clock_timestamp()
    where id = roster_id and user_id = auth.uid() and status = 'active';
  if not found then raise exception 'You cannot update this roster entry.' using errcode = '42501'; end if;
end $$;

create or replace function public.edit_competitor_details(member uuid, player_name text, player_email text, discord_contact text, in_game_account text, expected_updated_at timestamptz)
returns void language plpgsql security definer set search_path = '' as $$
declare entry public.competitor_roster;
        email_changed boolean;
begin
  if auth.uid() is null or not public.is_admin() then raise exception 'Admin access is required.' using errcode = '42501'; end if;
  select * into entry from public.competitor_roster where id = member and updated_at = expected_updated_at for update;
  if not found then raise exception 'This membership changed. Refresh before editing.' using errcode = '40001'; end if;
  email_changed := entry.email is distinct from lower(btrim(player_email));
  if email_changed and entry.user_id is not null then
    raise exception 'The email belongs to a linked account.' using errcode = '22023';
  end if;
  if email_changed then delete from private.competitor_invites where roster_id = member; end if;
  update public.competitor_roster
    set preferred_name = btrim(player_name), email = lower(btrim(player_email)),
        game_account = btrim(in_game_account),
        onboarding = case when email_changed then 'not_invited' else onboarding end,
        invite_expires_at = case when email_changed then null else invite_expires_at end,
        updated_at = clock_timestamp()
    where id = member;
end $$;

-- Replace saved contact text for existing memberships with a linked Discord identity.
update public.competitor_roster r
  set discord = btrim(i.identity_data->>'full_name'), updated_at = clock_timestamp()
  from auth.identities i
  where i.user_id = r.user_id and i.provider = 'discord'
    and nullif(btrim(i.identity_data->>'full_name'), '') is not null
    and r.discord is distinct from btrim(i.identity_data->>'full_name');
