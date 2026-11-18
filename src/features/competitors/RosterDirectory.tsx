import { useState } from "react";
import {
  FiChevronRight,
  FiGrid,
  FiPlus,
  FiSearch,
  FiUsers,
} from "react-icons/fi";
import { input, panel, primary, secondary } from "./adminStyles";
import {
  filterCompetitors,
  onboardingLabels,
  onboardingStatus,
  type Competitor,
  type CompetitorTeam,
} from "./model";

const rowLayout =
  "grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-2 md:grid-cols-[minmax(0,1.6fr)_minmax(0,0.8fr)_minmax(0,1fr)_5.25rem] md:items-center";
const countLabel = (count: number, singular: string, plural = `${singular}s`) =>
  `${count} ${count === 1 ? singular : plural}`;

export default function RosterDirectory({
  teams,
  entries,
  selectedTeam,
  busy,
  select,
  add,
  editTeam,
  manage,
}: {
  teams: CompetitorTeam[];
  entries: Competitor[];
  selectedTeam?: CompetitorTeam;
  busy: boolean;
  select: (id: string) => void;
  add: (id: string) => void;
  editTeam: (id: string) => void;
  manage: (id: string) => void;
}) {
  const [rosterQuery, setRosterQuery] = useState("");
  const activeCounts = new Map<string, number>();
  for (const entry of entries) {
    if (entry.status === "active") {
      activeCounts.set(
        entry.team_id,
        (activeCounts.get(entry.team_id) ?? 0) + 1
      );
    }
  }
  const search = rosterQuery.trim().toLowerCase();
  const visibleTeams = teams.filter(({ game, name, season }) =>
    `${game} ${name} ${season}`.toLowerCase().includes(search)
  );
  const teamNames = new Map(teams.map((team) => [team.id, team]));
  const active = selectedTeam ? activeCounts.get(selectedTeam.id) ?? 0 : 0;
  const members = selectedTeam
    ? entries.filter((entry) => entry.team_id === selectedTeam.id)
    : entries;

  if (!teams.length) {
    return (
      <div className={`${panel} px-5 py-14 text-center`}>
        <FiUsers
          className="mx-auto mb-4 text-3xl text-tech-gold"
          aria-hidden="true"
        />
        <h2 className="font-outfit text-xl font-semibold">
          No team rosters yet
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-gray-400">
          Create a roster for a game and season to start adding competitors.
        </p>
      </div>
    );
  }

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[17rem_minmax(0,1fr)]">
      <nav aria-label="Roster views" className={`${panel} min-w-0 p-4`}>
        <h2 className="font-outfit text-xl font-semibold">Team rosters</h2>
        <label className="relative mb-3 mt-3 block">
          <span className="sr-only">Find a roster</span>
          <FiSearch
            className="pointer-events-none absolute left-3 top-3 text-gray-400"
            aria-hidden="true"
          />
          <input
            className={`${input} mt-0 pl-9 text-sm`}
            type="search"
            placeholder="Game, team, season…"
            value={rosterQuery}
            onChange={(event) => setRosterQuery(event.target.value)}
          />
        </label>
        <button
          aria-current={!selectedTeam ? "true" : undefined}
          className="flex w-full items-center gap-2 rounded-lg border border-transparent px-3 py-2.5 text-left text-sm font-medium text-gray-200 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-tech-gold aria-[current=true]:border-tech-gold/30 aria-[current=true]:bg-tech-gold/10 aria-[current=true]:text-tech-gold"
          onClick={() => select("all")}
        >
          <FiGrid aria-hidden="true" /> All competitors
        </button>
        <ul className="mt-3 grid max-h-60 gap-1 overflow-y-auto overscroll-contain border-t border-white/10 px-1 pt-3 sm:grid-cols-2 lg:max-h-[32rem] lg:grid-cols-1">
          {visibleTeams.map((team) => (
            <li key={team.id} className="min-w-0">
              <button
                aria-current={team.id === selectedTeam?.id ? "true" : undefined}
                className="flex w-full items-center justify-between gap-2 rounded-lg border border-transparent px-3 py-2.5 text-left hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-tech-gold aria-[current=true]:border-tech-gold/30 aria-[current=true]:bg-tech-gold/10"
                onClick={() => select(team.id)}
              >
                <span className="min-w-0 break-words">
                  <span className="block text-sm font-semibold text-white">
                    {team.name}
                  </span>
                  <span className="mt-0.5 block text-xs text-gray-400">
                    {team.game} · {team.season}
                  </span>
                </span>
                <span
                  className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-xs text-gray-300"
                  aria-label={countLabel(
                    activeCounts.get(team.id) ?? 0,
                    "active competitor"
                  )}
                >
                  {activeCounts.get(team.id) ?? 0}
                </span>
              </button>
            </li>
          ))}
        </ul>
        {!visibleTeams.length && (
          <p className="px-3 pb-2 text-sm text-gray-400">
            No rosters match your search.
          </p>
        )}
      </nav>

      <section aria-labelledby="roster-heading" className={`${panel} min-w-0`}>
        <header className="flex flex-wrap items-start justify-between gap-4 p-5 sm:p-6">
          <div className="min-w-0 break-words">
            {selectedTeam && (
              <p className="text-sm text-tech-gold">
                {selectedTeam.game} · {selectedTeam.season}
              </p>
            )}
            <h2
              id="roster-heading"
              className="font-outfit text-2xl font-semibold text-white sm:text-3xl"
            >
              {selectedTeam?.name ?? "All competitors"}
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              {selectedTeam
                ? `${active} active · ${
                    members.filter(
                      (entry) =>
                        entry.status === "active" &&
                        entry.onboarding === "complete"
                    ).length
                  } onboarded · ${members.length - active} past or inactive`
                : `${countLabel(teams.length, "roster")} · ${countLabel(
                    members.length,
                    "membership"
                  )}`}
            </p>
          </div>
          {selectedTeam && (
            <div className="flex flex-wrap gap-2">
              <button
                className={secondary}
                disabled={busy}
                onClick={() => editTeam(selectedTeam.id)}
              >
                Edit roster
              </button>
              <button
                className={primary}
                disabled={busy}
                onClick={() => add(selectedTeam.id)}
              >
                <FiPlus aria-hidden="true" /> Add competitor
              </button>
            </div>
          )}
        </header>
        <MemberList
          key={selectedTeam?.id ?? "all"}
          teams={teams}
          members={members}
          busy={busy}
          showTeam={!selectedTeam}
          teamNames={teamNames}
          manage={manage}
        />
      </section>
    </div>
  );
}

function MemberList({
  teams,
  members,
  busy,
  showTeam,
  teamNames,
  manage,
}: {
  teams: CompetitorTeam[];
  members: Competitor[];
  busy: boolean;
  showTeam: boolean;
  teamNames: Map<string, CompetitorTeam>;
  manage: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [onboarding, setOnboarding] = useState("");
  const visible = filterCompetitors(
    members,
    teams,
    query,
    "",
    onboarding,
    status
  );

  if (!members.length) {
    return (
      <div className="border-t border-white/10 px-5 py-12 text-center">
        <FiUsers
          className="mx-auto mb-3 text-2xl text-tech-gold"
          aria-hidden="true"
        />
        <h3 className="font-outfit text-lg font-semibold">
          No competitors yet
        </h3>
        <p className="mt-1 text-sm text-gray-400">
          {showTeam
            ? "Open a team roster to add competitors."
            : "Add a competitor to give them a spot on this roster."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-3 border-y border-white/10 bg-white/[0.02] px-5 py-4 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] sm:px-6">
        <label className="text-xs font-medium text-gray-300">
          Search competitors
          <input
            className={`${input} text-sm`}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Name, email, Discord…"
          />
        </label>
        <label className="text-xs font-medium text-gray-300">
          Membership
          <select
            className={`${input} text-sm`}
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="former">Former</option>
          </select>
        </label>
        <label className="text-xs font-medium text-gray-300">
          Onboarding
          <select
            className={`${input} text-sm`}
            value={onboarding}
            onChange={(event) => setOnboarding(event.target.value)}
          >
            <option value="">All stages</option>
            {Object.entries(onboardingLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
      {visible.length ? (
        <>
          <div
            aria-hidden="true"
            className={`${rowLayout} hidden border-b border-white/10 px-6 py-3 text-xs font-medium text-gray-400 md:grid`}
          >
            <span>Competitor</span>
            <span>Membership</span>
            <span>Onboarding</span>
          </div>
          <ul
            aria-label="Roster memberships"
            className="divide-y divide-white/10"
          >
            {visible.map((entry) => {
              const stage = onboardingStatus(entry);
              const team = teamNames.get(entry.team_id);
              return (
                <li
                  key={entry.id}
                  className={`${rowLayout} px-5 py-4 text-sm transition hover:bg-white/[0.03] sm:px-6`}
                >
                  <div className="col-start-1 row-start-1 min-w-0 break-words">
                    <p className="font-semibold text-white">
                      {entry.preferred_name}
                    </p>
                    <p className="mt-0.5 break-all text-xs text-gray-400">
                      {entry.email}
                    </p>
                    {showTeam && team && (
                      <p className="mt-1 text-xs text-tech-gold">
                        {team.name} · {team.game} · {team.season}
                      </p>
                    )}
                  </div>
                  <div className="col-start-1 row-start-2 min-w-0 self-center capitalize md:col-start-auto md:row-start-auto">
                    <span className="text-gray-300">{entry.position}</span>
                    <span className="ml-2 text-xs text-gray-400 md:ml-0 md:mt-0.5 md:block">
                      {entry.status}
                    </span>
                  </div>
                  <div className="col-start-2 row-start-2 min-w-0 justify-self-end md:col-start-auto md:row-start-auto md:justify-self-start">
                    <span
                      className={`inline-block rounded-full border px-2.5 py-1 text-xs ${
                        stage === "complete"
                          ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-300"
                          : stage === "expired"
                          ? "border-red-400/25 bg-red-500/10 text-red-200"
                          : "border-white/10 bg-white/5 text-gray-300"
                      }`}
                    >
                      {onboardingLabels[stage]}
                    </span>
                  </div>
                  <button
                    disabled={busy}
                    aria-label={`Manage ${entry.preferred_name}${
                      team
                        ? ` on ${team.name} (${team.game}, ${team.season})`
                        : ""
                    }`}
                    onClick={() => manage(entry.id)}
                    className="col-start-2 row-start-1 inline-flex w-fit items-center gap-1 self-start justify-self-end rounded-md py-1 font-medium text-tech-gold hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tech-gold disabled:opacity-50 md:col-start-4 md:self-center"
                  >
                    Manage <FiChevronRight size={16} aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <div className="px-5 py-10 text-center">
          <p className="mb-3 text-sm text-gray-400">
            No competitors match these filters.
          </p>
          <button
            className={secondary}
            onClick={() => {
              setQuery("");
              setStatus("");
              setOnboarding("");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
