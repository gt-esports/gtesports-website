export interface CompetitorTeam {
  id: string;
  name: string;
  game: string;
  season: string;
}
export type RosterPosition = "player" | "substitute" | "captain";
export type RosterStatus = "active" | "inactive" | "former";
export type OnboardingStatus =
  | "not_invited"
  | "invited"
  | "in_progress"
  | "complete";
export interface Competitor {
  id: string;
  team_id: string;
  user_id: string | null;
  email: string;
  preferred_name: string;
  position: RosterPosition;
  status: RosterStatus;
  onboarding: OnboardingStatus;
  discord: string;
  game_account: string;
  invite_expires_at: string | null;
  updated_at: string;
}
export const onboardingLabels = {
  not_invited: "Not invited",
  invited: "Invited",
  expired: "Invite expired",
  in_progress: "In progress",
  complete: "Complete",
};
export function onboardingStatus(
  entry: Competitor,
  now = Date.now()
): keyof typeof onboardingLabels {
  return entry.onboarding === "invited" &&
    entry.invite_expires_at &&
    Date.parse(entry.invite_expires_at) <= now
    ? "expired"
    : entry.onboarding;
}
export function filterCompetitors(
  entries: Competitor[],
  teams: CompetitorTeam[],
  query: string,
  team: string,
  onboarding: string,
  status: string
): Competitor[] {
  const search = query.trim().toLowerCase();
  return entries.filter((entry) => {
    const assignment = teams.find((item) => item.id === entry.team_id);
    return (
      (!team || entry.team_id === team) &&
      (!onboarding || onboardingStatus(entry) === onboarding) &&
      (!status || entry.status === status) &&
      (!search ||
        [
          entry.preferred_name,
          entry.email,
          entry.discord,
          entry.game_account,
          assignment?.name,
          assignment?.game,
          assignment?.season,
        ].some((value) => value?.toLowerCase().includes(search)))
    );
  });
}
// Only this fixed local destination is accepted; never redirect to caller-supplied URLs.
export function competitorReturnPath(
  storage: Pick<Storage, "getItem">
): string {
  return storage.getItem("competitor-onboarding-return") === "yes"
    ? "/competitors/onboarding"
    : "/home";
}
