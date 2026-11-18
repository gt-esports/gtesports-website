-- Run as postgres after competitor-management migrations. Fixtures always roll back.
begin;
select set_config('test.admin', gen_random_uuid()::text, true);
select set_config('test.player', gen_random_uuid()::text, true);
select set_config('test.other', gen_random_uuid()::text, true);
insert into auth.users(id,email,email_confirmed_at,raw_user_meta_data) values
 (current_setting('test.admin')::uuid, 'staff-' || current_setting('test.admin') || '@example.com', now(), '{}'),
 (current_setting('test.player')::uuid, 'player-' || current_setting('test.player') || '@example.com', now(), '{}'),
 (current_setting('test.other')::uuid, 'other-' || current_setting('test.other') || '@example.com', now(), '{"role":"admin"}');
insert into auth.identities (id, user_id, provider_id, provider, identity_data) values
  (gen_random_uuid(), current_setting('test.player')::uuid, current_setting('test.player'), 'discord', '{"full_name":"verified-discord"}'),
  (gen_random_uuid(), current_setting('test.other')::uuid, current_setting('test.other'), 'discord', '{"full_name":"other-discord"}');
insert into public.user_roles values (current_setting('test.admin')::uuid, 'admin');
select set_config('request.jwt.claim.sub', current_setting('test.admin'), true);
set local role authenticated;
select set_config('test.team', public.create_competitor_team('Gold', 'Valorant', 'Test ' || gen_random_uuid())::text, true);
select set_config('test.roster', public.add_competitor(current_setting('test.team')::uuid, 'Player', ' PLAYER-' || current_setting('test.player') || '@EXAMPLE.COM ', 'captain')::text, true);
select set_config('test.old_token', public.create_competitor_invite(current_setting('test.roster')::uuid), true);
select set_config('test.token', public.create_competitor_invite(current_setting('test.roster')::uuid), true);
-- Wrong recipient, metadata spoofing, and direct writes must all fail.
reset role;
select set_config('request.jwt.claim.sub', current_setting('test.other'), true);
set local role authenticated;
do $$ begin
  if public.can_view_competitor_invite(current_setting('test.token')) then raise exception 'Wrong recipient can view invite'; end if;
  if exists(select 1 from public.competitor_roster) or exists(select 1 from public.competitor_teams) then raise exception 'Unassigned player can read directory'; end if;
  begin perform public.create_competitor_team('Bad','Bad','Bad'); raise exception 'Nonadmin created team'; exception when insufficient_privilege then null; end;
  begin perform public.add_competitor(current_setting('test.team')::uuid,'Bad','bad@example.com','player'); raise exception 'Nonadmin added roster'; exception when insufficient_privilege then null; end;
  begin perform public.create_competitor_invite(current_setting('test.roster')::uuid); raise exception 'Nonadmin invited player'; exception when insufficient_privilege then null; end;
  begin perform public.revoke_competitor_invite(current_setting('test.roster')::uuid); raise exception 'Nonadmin revoked invite'; exception when insufficient_privilege then null; end;
  begin perform public.update_competitor(current_setting('test.roster')::uuid,'player','former',now()); raise exception 'Nonadmin edited roster'; exception when insufficient_privilege then null; end;
  begin perform public.accept_competitor_invite(current_setting('test.token')); raise exception 'Wrong recipient accepted'; exception when insufficient_privilege then null; end;
  begin update public.competitor_roster set user_id = auth.uid(); raise exception 'Direct update allowed'; exception when insufficient_privilege then null; end;
  begin insert into public.competitor_teams(name,game,season) values ('Bad','Bad','Bad'); raise exception 'Direct insert allowed'; exception when insufficient_privilege then null; end;
  begin perform * from private.competitor_invites; raise exception 'Tokens readable'; exception when insufficient_privilege then null; end;
end $$;
-- Unverified invited recipient cannot claim, even with the right token.
reset role;
update auth.users set email_confirmed_at = null where id = current_setting('test.player')::uuid;
select set_config('request.jwt.claim.sub', current_setting('test.player'), true);
set local role authenticated;
do $$ begin
  begin perform public.accept_competitor_invite(current_setting('test.token')); raise exception 'Unverified user accepted'; exception when insufficient_privilege then null; end;
end $$;
reset role;
update auth.users set email_confirmed_at = now() where id = current_setting('test.player')::uuid;
update private.competitor_invites set expires_at = now() - interval '1 minute' where roster_id = current_setting('test.roster')::uuid;
set local role authenticated;
do $$ begin
  begin perform public.accept_competitor_invite(current_setting('test.old_token')); raise exception 'Replaced token accepted'; exception when invalid_parameter_value then null; end;
  begin perform public.accept_competitor_invite(current_setting('test.token')); raise exception 'Expired token accepted'; exception when invalid_parameter_value then null; end;
end $$;
reset role;
select set_config('request.jwt.claim.sub', current_setting('test.admin'), true);
set local role authenticated;
select set_config('test.revoked_token', public.create_competitor_invite(current_setting('test.roster')::uuid), true);
select public.revoke_competitor_invite(current_setting('test.roster')::uuid);
reset role;
select set_config('request.jwt.claim.sub', current_setting('test.player'), true);
set local role authenticated;
do $$ begin
  begin perform public.accept_competitor_invite(current_setting('test.revoked_token')); raise exception 'Revoked token accepted'; exception when invalid_parameter_value then null; end;
end $$;
reset role;
select set_config('request.jwt.claim.sub', current_setting('test.admin'), true);
set local role authenticated;
select set_config('test.token', public.create_competitor_invite(current_setting('test.roster')::uuid), true);
reset role;
select set_config('request.jwt.claim.sub', current_setting('test.player'), true);
set local role authenticated;
do $$ begin
  if not public.can_view_competitor_invite(current_setting('test.token')) then raise exception 'Verified invite recipient denied'; end if;
end $$;
select public.accept_competitor_invite(current_setting('test.token'));
do $$ begin
  if not exists(select 1 from public.competitor_roster where id = current_setting('test.roster')::uuid and user_id = auth.uid() and onboarding = 'in_progress' and position = 'captain') then raise exception 'Claim lost assignment'; end if;
  if not exists(select 1 from public.competitor_teams where id = current_setting('test.team')::uuid) then raise exception 'Assigned team hidden'; end if;
  begin perform public.accept_competitor_invite(current_setting('test.token')); raise exception 'Replay accepted'; exception when invalid_parameter_value then null; end;
  begin perform public.complete_competitor_onboarding(current_setting('test.roster')::uuid,'Player','ignored',' '); raise exception 'Blank game account accepted'; exception when invalid_parameter_value then null; end;
end $$;
select public.complete_competitor_onboarding(current_setting('test.roster')::uuid,'Preferred','discord-name','IGN#123');
do $$ begin
  if not exists(select 1 from public.competitor_roster where id = current_setting('test.roster')::uuid and onboarding = 'complete' and game_account = 'IGN#123' and discord = 'verified-discord') then raise exception 'Onboarding not completed'; end if;
  if public.is_admin() then raise exception 'Competitor became admin'; end if;
end $$;
reset role;
select set_config('request.jwt.claim.sub', current_setting('test.other'), true);
set local role authenticated;
do $$ begin
  begin perform public.complete_competitor_onboarding(current_setting('test.roster')::uuid,'Intruder','discord','IGN'); raise exception 'Other player edited profile'; exception when insufficient_privilege then null; end;
end $$;
reset role;
select set_config('request.jwt.claim.sub', current_setting('test.admin'), true);
set local role authenticated;
select set_config('test.version', (select updated_at::text from public.competitor_roster where id = current_setting('test.roster')::uuid), true);
select public.update_competitor(current_setting('test.roster')::uuid,'substitute','former',current_setting('test.version')::timestamptz);
do $$ begin
  if not exists(select 1 from public.competitor_roster where id = current_setting('test.roster')::uuid and status = 'former' and onboarding = 'complete') then raise exception 'Archived history lost'; end if;
  begin perform public.update_competitor(current_setting('test.roster')::uuid,'captain','active',current_setting('test.version')::timestamptz); raise exception 'Stale write accepted'; exception when serialization_failure then null; end;
  begin perform public.create_competitor_invite(current_setting('test.roster')::uuid); raise exception 'Claimed former player reinvited'; exception when invalid_parameter_value then null; end;
end $$;
select public.edit_competitor_team(current_setting('test.team')::uuid, 'Blue', 'Valorant', 'Spring');
select public.edit_competitor_details(
  r.id, 'Edited Player', r.email, 'updated-discord', 'updated-account', r.updated_at
) from public.competitor_roster r where r.id = current_setting('test.roster')::uuid;
do $$ begin
  if not exists(select 1 from public.competitor_roster where id = current_setting('test.roster')::uuid and discord = 'verified-discord') then raise exception 'Admin changed Discord identity'; end if;
end $$;
select public.delete_competitor_membership(r.id, r.updated_at)
  from public.competitor_roster r where r.id = current_setting('test.roster')::uuid;
select set_config('test.deleted_member', public.add_competitor(current_setting('test.team')::uuid, 'New Player', 'new@example.com', 'player')::text, true);
select set_config('test.deleted_invite', public.create_competitor_invite(current_setting('test.deleted_member')::uuid), true) is not null;
select public.delete_competitor_team(current_setting('test.team')::uuid);
reset role;
do $$ begin
  if exists (select 1 from public.competitor_teams where id = current_setting('test.team')::uuid)
    or exists (select 1 from public.competitor_roster where team_id = current_setting('test.team')::uuid)
    or exists (select 1 from private.competitor_invites where roster_id = current_setting('test.deleted_member')::uuid)
  then raise exception 'Roster deletion left data behind'; end if;
  if not exists (select 1 from auth.users where id = current_setting('test.player')::uuid) then raise exception 'Roster deletion removed the website account'; end if;
end $$;
set local role anon;
do $$ begin
  begin perform * from public.competitor_roster; raise exception 'Anonymous roster access'; exception when insufficient_privilege then null; end;
  begin perform public.accept_competitor_invite(current_setting('test.token')); raise exception 'Anonymous invitation access'; exception when insufficient_privilege then null; end;
end $$;
rollback;
