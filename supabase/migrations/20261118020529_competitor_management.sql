-- Existing competitors are invited to a preassigned roster; account roles stay separate.
create table public.competitor_teams (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(btrim(name)) between 1 and 100),
  game text not null check (length(btrim(game)) between 1 and 100),
  season text not null check (length(btrim(season)) between 1 and 100),
  created_at timestamptz not null default now(),
  unique (game, name, season)
);
create table public.competitor_roster (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.competitor_teams(id),
  user_id uuid references auth.users(id) on delete set null,
  email text not null check (email = lower(btrim(email)) and length(email) <= 254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  preferred_name text not null check (length(btrim(preferred_name)) between 1 and 100),
  position text not null default 'player' check (position in ('player', 'substitute', 'captain')),
  status text not null default 'active' check (status in ('active', 'inactive', 'former')),
  onboarding text not null default 'not_invited' check (onboarding in ('not_invited', 'invited', 'in_progress', 'complete')),
  discord text not null default '' check (length(discord) <= 100),
  game_account text not null default '' check (length(game_account) <= 100),
  invite_expires_at timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (team_id, email)
);
create unique index competitor_roster_team_user on public.competitor_roster(team_id, user_id) where user_id is not null;
create index competitor_roster_user on public.competitor_roster(user_id);
create table private.competitor_invites (
  roster_id uuid primary key references public.competitor_roster(id) on delete cascade,
  token_hash bytea not null unique,
  expires_at timestamptz not null
);
revoke all on private.competitor_invites from public, anon, authenticated;
alter table public.competitor_teams enable row level security;
alter table public.competitor_roster enable row level security;
revoke all on public.competitor_teams, public.competitor_roster from public, anon, authenticated;
grant select on public.competitor_teams, public.competitor_roster to authenticated;
create policy "Staff and players can read assigned rosters" on public.competitor_roster for select to authenticated
  using (public.is_admin() or user_id = (select auth.uid()));
create policy "Staff and players can read assigned teams" on public.competitor_teams for select to authenticated
  using (public.is_admin() or exists (select 1 from public.competitor_roster r where r.team_id = competitor_teams.id and r.user_id = (select auth.uid())));

create function public.create_competitor_team(team_name text, game_name text, season_name text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare result uuid;
begin
  if auth.uid() is null or not public.is_admin() then raise exception 'Admin access is required.' using errcode = '42501'; end if;
  insert into public.competitor_teams(name, game, season) values (btrim(team_name), btrim(game_name), btrim(season_name)) returning id into result;
  return result;
end $$;
create function public.add_competitor(roster_team uuid, player_name text, player_email text, roster_position text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare result uuid;
begin
  if auth.uid() is null or not public.is_admin() then raise exception 'Admin access is required.' using errcode = '42501'; end if;
  insert into public.competitor_roster(team_id, preferred_name, email, position)
    values (roster_team, btrim(player_name), lower(btrim(player_email)), roster_position) returning id into result;
  return result;
end $$;
create function public.update_competitor(roster_id uuid, roster_position text, roster_status text, expected_updated_at timestamptz)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null or not public.is_admin() then raise exception 'Admin access is required.' using errcode = '42501'; end if;
  update public.competitor_roster set position = roster_position, status = roster_status,
    invite_expires_at = case when roster_status <> 'active' then null else invite_expires_at end,
    onboarding = case when roster_status <> 'active' and user_id is null then 'not_invited' else onboarding end,
    updated_at = clock_timestamp()
    where id = roster_id and updated_at = expected_updated_at;
  if not found then raise exception 'This roster entry changed. Refresh before saving.' using errcode = '40001'; end if;
  if roster_status <> 'active' then delete from private.competitor_invites where competitor_invites.roster_id = update_competitor.roster_id; end if;
end $$;
create function public.create_competitor_invite(roster_id uuid)
returns text language plpgsql security definer set search_path = '' as $$
declare token text; entry public.competitor_roster; expiry timestamptz := now() + interval '7 days';
begin
  if auth.uid() is null or not public.is_admin() then raise exception 'Admin access is required.' using errcode = '42501'; end if;
  select * into entry from public.competitor_roster where id = roster_id for update;
  if not found or entry.user_id is not null or entry.status <> 'active' then raise exception 'Only an active, unclaimed roster entry can be invited.' using errcode = '22023'; end if;
  token := replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '');
  insert into private.competitor_invites values (roster_id, sha256(convert_to(token, 'UTF8')), expiry)
    on conflict on constraint competitor_invites_pkey do update set token_hash = excluded.token_hash, expires_at = excluded.expires_at;
  update public.competitor_roster set onboarding = 'invited', invite_expires_at = expiry, updated_at = clock_timestamp() where id = roster_id;
  return token;
end $$;
create function public.revoke_competitor_invite(roster_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null or not public.is_admin() then raise exception 'Admin access is required.' using errcode = '42501'; end if;
  perform 1 from public.competitor_roster where id = roster_id for update;
  delete from private.competitor_invites where competitor_invites.roster_id = revoke_competitor_invite.roster_id;
  update public.competitor_roster set onboarding = 'not_invited', invite_expires_at = null, updated_at = clock_timestamp() where id = roster_id and user_id is null;
end $$;
create function public.accept_competitor_invite(invite_token text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare entry public.competitor_roster; invite private.competitor_invites; verified_email text;
begin
  if auth.uid() is null then raise exception 'Sign in to accept this invitation.' using errcode = '42501'; end if;
  -- Always lock the roster before the invitation, matching reissue/revoke operations.
  select r.* into entry from public.competitor_roster r join private.competitor_invites i on i.roster_id = r.id
    where i.token_hash = sha256(convert_to(invite_token, 'UTF8')) for update of r;
  if not found then raise exception 'This invitation is invalid or has been replaced.' using errcode = '22023'; end if;
  select * into invite from private.competitor_invites where roster_id = entry.id;
  if not found or invite.token_hash <> sha256(convert_to(invite_token, 'UTF8')) or invite.expires_at <= now() or entry.status <> 'active' or entry.user_id is not null then
    raise exception 'This invitation has expired or is no longer available.' using errcode = '22023';
  end if;
  -- Read the verified auth email; user-editable metadata and the link alone are insufficient.
  select lower(email) into verified_email from auth.users where id = auth.uid() and email_confirmed_at is not null;
  if verified_email is null or verified_email <> entry.email then
    raise exception 'Sign in with the verified email address this invitation was sent to. If your Discord email differs, ask staff to replace the invitation.' using errcode = '42501';
  end if;
  update public.competitor_roster set user_id = auth.uid(), onboarding = 'in_progress', invite_expires_at = null, updated_at = clock_timestamp() where id = entry.id;
  delete from private.competitor_invites where roster_id = entry.id;
  return entry.id;
end $$;
create function public.complete_competitor_onboarding(roster_id uuid, player_name text, discord_contact text, in_game_account text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then raise exception 'Sign in to complete onboarding.' using errcode = '42501'; end if;
  if discord_contact is null or btrim(discord_contact) = '' or in_game_account is null or btrim(in_game_account) = '' then
    raise exception 'Enter your Discord contact and in-game account.' using errcode = '22023';
  end if;
  update public.competitor_roster set preferred_name = btrim(player_name), discord = btrim(discord_contact), game_account = btrim(in_game_account), onboarding = 'complete', updated_at = clock_timestamp()
    where id = roster_id and user_id = auth.uid() and status = 'active';
  if not found then raise exception 'You cannot update this roster entry.' using errcode = '42501'; end if;
end $$;
revoke all on function public.create_competitor_team(text,text,text), public.add_competitor(uuid,text,text,text), public.update_competitor(uuid,text,text,timestamptz), public.create_competitor_invite(uuid), public.revoke_competitor_invite(uuid), public.accept_competitor_invite(text), public.complete_competitor_onboarding(uuid,text,text,text) from public, anon, authenticated;
grant execute on function public.create_competitor_team(text,text,text), public.add_competitor(uuid,text,text,text), public.update_competitor(uuid,text,text,timestamptz), public.create_competitor_invite(uuid), public.revoke_competitor_invite(uuid), public.accept_competitor_invite(text), public.complete_competitor_onboarding(uuid,text,text,text) to authenticated;
