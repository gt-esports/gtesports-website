create function public.edit_competitor_team(team uuid, team_name text, game_name text, season_name text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null or not public.is_admin() then raise exception 'Admin access is required.' using errcode = '42501'; end if;
  update public.competitor_teams set name = btrim(team_name), game = btrim(game_name), season = btrim(season_name) where id = team;
  if not found then raise exception 'Roster no longer exists.' using errcode = '40001'; end if;
end $$;

create function public.edit_competitor_details(member uuid, player_name text, player_email text, discord_contact text, in_game_account text, expected_updated_at timestamptz)
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
        discord = btrim(discord_contact), game_account = btrim(in_game_account),
        onboarding = case when email_changed then 'not_invited' else onboarding end,
        invite_expires_at = case when email_changed then null else invite_expires_at end,
        updated_at = clock_timestamp()
    where id = member;
end $$;

create function public.delete_competitor_membership(member uuid, expected_updated_at timestamptz)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null or not public.is_admin() then raise exception 'Admin access is required.' using errcode = '42501'; end if;
  delete from public.competitor_roster where id = member and updated_at = expected_updated_at;
  if not found then raise exception 'This membership changed. Refresh before deleting.' using errcode = '40001'; end if;
end $$;

create function public.delete_competitor_team(team uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null or not public.is_admin() then raise exception 'Admin access is required.' using errcode = '42501'; end if;
  perform 1 from public.competitor_teams where id = team for update;
  delete from public.competitor_roster where team_id = team;
  delete from public.competitor_teams where id = team;
end $$;

create function public.can_view_competitor_invite(invite_token text)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from private.competitor_invites i
    join public.competitor_roster r on r.id = i.roster_id
    join auth.users u on u.id = auth.uid()
    where i.token_hash = sha256(convert_to(invite_token, 'UTF8'))
      and i.expires_at > now() and r.status = 'active' and r.user_id is null
      and u.email_confirmed_at is not null and lower(u.email) = r.email
  );
$$;

revoke all on function public.edit_competitor_team(uuid,text,text,text), public.edit_competitor_details(uuid,text,text,text,text,timestamptz), public.delete_competitor_membership(uuid,timestamptz), public.delete_competitor_team(uuid), public.can_view_competitor_invite(text) from public, anon, authenticated;
grant execute on function public.edit_competitor_team(uuid,text,text,text), public.edit_competitor_details(uuid,text,text,text,text,timestamptz), public.delete_competitor_membership(uuid,timestamptz), public.delete_competitor_team(uuid), public.can_view_competitor_invite(text) to authenticated;
