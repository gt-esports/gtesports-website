import { supabase } from "../../lib/supabase";
import type {
  Competitor,
  CompetitorTeam,
  RosterPosition,
  RosterStatus,
} from "./model";

function fail(error: { code?: string; message: string }): never {
  if (["42P01", "PGRST205", "PGRST202"].includes(error.code ?? ""))
    throw new Error(
      "Competitor management is not available yet. Ask a developer to apply the competitor migration."
    );
  if (error.code === "23505")
    throw new Error(
      "This team or roster entry already exists. Check the current list."
    );
  throw new Error(error.message || "Unable to save. Please try again.");
}
export async function loadCompetitors() {
  const teams: CompetitorTeam[] = [];
  const entries: Competitor[] = [];
  for (let offset = 0; ; offset += 500) {
    const { data, error } = await supabase
      .from("competitor_teams")
      .select("*")
      .order("id")
      .range(offset, offset + 499);
    if (error) fail(error);
    teams.push(...(data as CompetitorTeam[]));
    if (data.length < 500) break;
  }
  for (let offset = 0; ; offset += 500) {
    const { data, error } = await supabase
      .from("competitor_roster")
      .select("*")
      .order("id")
      .range(offset, offset + 499);
    if (error) fail(error);
    entries.push(...(data as Competitor[]));
    if (data.length < 500) break;
  }
  teams.sort((a, b) =>
    `${a.game} ${a.name} ${a.season}`.localeCompare(
      `${b.game} ${b.name} ${b.season}`
    )
  );
  entries.sort((a, b) => a.preferred_name.localeCompare(b.preferred_name));
  return { teams, entries };
}
export async function createTeam(name: string, game: string, season: string) {
  const { error } = await supabase.rpc("create_competitor_team", {
    team_name: name.trim(),
    game_name: game.trim(),
    season_name: season.trim(),
  });
  if (error) fail(error);
}
export async function addCompetitor(
  team: string,
  name: string,
  email: string,
  position: RosterPosition
) {
  const { error } = await supabase.rpc("add_competitor", {
    roster_team: team,
    player_name: name.trim(),
    player_email: email.trim().toLowerCase(),
    roster_position: position,
  });
  if (error) fail(error);
}
export async function updateCompetitor(
  entry: Competitor,
  position: RosterPosition,
  status: RosterStatus
) {
  const { error } = await supabase.rpc("update_competitor", {
    roster_id: entry.id,
    roster_position: position,
    roster_status: status,
    expected_updated_at: entry.updated_at,
  });
  if (error) fail(error);
}
export async function createInvite(id: string): Promise<string> {
  const result = await supabase.rpc("create_competitor_invite", {
    roster_id: id,
  });
  const data: unknown = result.data;
  const error = result.error;
  if (error) fail(error);
  if (typeof data !== "string")
    throw new Error("Unable to create the invitation.");
  // Fragment keeps the secret out of HTTP request URLs and referrer headers.
  return `${
    window.location.origin
  }/competitors/onboarding#invite=${encodeURIComponent(data)}`;
}
export async function revokeInvite(id: string) {
  const { error } = await supabase.rpc("revoke_competitor_invite", {
    roster_id: id,
  });
  if (error) fail(error);
}
export async function acceptInvite(token: string) {
  const { error } = await supabase.rpc("accept_competitor_invite", {
    invite_token: token,
  });
  if (error) fail(error);
}
export async function completeOnboarding(
  id: string,
  name: string,
  discord: string,
  account: string
) {
  const { error } = await supabase.rpc("complete_competitor_onboarding", {
    roster_id: id,
    player_name: name.trim(),
    discord_contact: discord.trim(),
    in_game_account: account.trim(),
  });
  if (error) fail(error);
}
