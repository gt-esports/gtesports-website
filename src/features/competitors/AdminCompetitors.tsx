import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaUsers,
  FaCheckCircle,
  FaEnvelope,
  FaSearch,
} from "react-icons/fa";
import {
  addCompetitor,
  createInvite,
  createTeam,
  loadCompetitors,
  revokeInvite,
  updateCompetitor,
} from "./api";
import {
  filterCompetitors,
  onboardingLabels,
  onboardingStatus,
  type Competitor,
  type CompetitorTeam,
  type RosterPosition,
  type RosterStatus,
} from "./model";

const input =
  "mt-2 w-full rounded-xl border border-white/15 bg-deep-space px-4 py-3 text-white focus:border-tech-gold focus:outline-none focus:ring-1 focus:ring-tech-gold";
const primary =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-tech-gold px-5 py-3 font-semibold text-deep-space transition hover:bg-gold-glow disabled:cursor-wait disabled:opacity-50";
const secondary =
  "rounded-xl border border-white/20 px-4 py-3 text-sm font-medium text-gray-200 transition hover:border-tech-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-tech-gold disabled:opacity-50";
const panel = "rounded-2xl border border-white/10 bg-white/[0.03] p-6";
const teamLabel = (team: CompetitorTeam) =>
  `${team.game} · ${team.name} · ${team.season}`;
const message = (error: unknown) =>
  error instanceof Error
    ? error.message
    : "Unable to complete this action. Please try again.";

export default function AdminCompetitors() {
  const [teams, setTeams] = useState<CompetitorTeam[]>([]);
  const [entries, setEntries] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [team, setTeam] = useState("");
  const [onboarding, setOnboarding] = useState("");
  const [status, setStatus] = useState("");
  const [form, setForm] = useState<"team" | "player" | null>(null);
  const [selected, setSelected] = useState("");
  const [invitation, setInvitation] = useState<{
    id: string;
    url: string;
  } | null>(null);
  // Re-evaluate expiry labels while this dashboard remains open.
  const [, setMinute] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(
      () => setMinute((value) => value + 1),
      60000
    );
    return () => window.clearInterval(timer);
  }, []);
  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const result = await loadCompetitors();
      setTeams(result.teams);
      setEntries(result.entries);
    } catch (failure) {
      setTeams([]);
      setEntries([]);
      setInvitation(null);
      throw failure;
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void reload().catch((failure) => setError(message(failure)));
  }, [reload]);
  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await action();
      await reload();
    } catch (failure) {
      setError(message(failure));
    } finally {
      setBusy(false);
    }
  }
  const visible = filterCompetitors(
    entries,
    teams,
    query,
    team,
    onboarding,
    status
  );
  const current = entries.find((entry) => entry.id === selected);
  const active = entries.filter((entry) => entry.status === "active");
  const complete = active.filter(
    (entry) => entry.onboarding === "complete"
  ).length;
  const awaiting = active.filter((entry) =>
    ["invited", "expired"].includes(onboardingStatus(entry))
  ).length;

  return (
    <section className="mx-auto max-w-7xl px-6 pb-20 pt-12">
      <Link
        to="/admin"
        className="text-sm text-tech-gold underline underline-offset-4"
      >
        ← Back to administration
      </Link>
      <div className="mb-8 mt-8 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-tech-gold">
            Competition management
          </p>
          <h1 className="font-outfit text-4xl font-bold text-white">
            Competitors & rosters
          </h1>
          <p className="mt-3 max-w-xl text-gray-400">
            Set up your teams, invite existing competitors, and see who still
            needs to finish onboarding.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            disabled={busy || loading}
            className={secondary}
            onClick={() => setForm(form === "team" ? null : "team")}
          >
            Create team
          </button>
          <button
            disabled={busy || loading || teams.length === 0}
            className={primary}
            onClick={() => setForm(form === "player" ? null : "player")}
          >
            <FaPlus aria-hidden="true" /> Add competitor
          </button>
        </div>
      </div>
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Active competitors",
            value: new Set(active.map((entry) => entry.email)).size,
            icon: FaUsers,
          },
          {
            label: "Roster entries complete",
            value: complete,
            icon: FaCheckCircle,
          },
          { label: "Awaiting acceptance", value: awaiting, icon: FaEnvelope },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className={panel}>
            <div className="flex items-center justify-between text-sm text-gray-400">
              {label}
              <Icon aria-hidden="true" className="text-tech-gold" />
            </div>
            <p className="mt-3 font-outfit text-3xl font-semibold">
              {loading ? "—" : value}
            </p>
          </div>
        ))}
      </div>
      {error && (
        <p
          role="alert"
          className="mb-5 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-red-200"
        >
          {error}
        </p>
      )}
      {notice && (
        <p
          role="status"
          className="mb-5 rounded-xl border border-tech-gold/30 bg-tech-gold/10 p-4 text-tech-gold"
        >
          {notice}
        </p>
      )}
      {form === "team" && (
        <TeamForm
          busy={busy}
          cancel={() => setForm(null)}
          save={(name, game, season) =>
            run(async () => {
              await createTeam(name, game, season);
              setForm(null);
              setNotice("Team created. You can now add competitors.");
            })
          }
        />
      )}
      {form === "player" && (
        <PlayerForm
          busy={busy}
          teams={teams}
          cancel={() => setForm(null)}
          save={(id, name, email, position) =>
            run(async () => {
              await addCompetitor(id, name, email, position);
              setForm(null);
              setNotice(
                "Competitor added. Open their roster entry to create an invitation."
              );
            })
          }
        />
      )}
      <div className={panel}>
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-outfit text-xl font-semibold">
              Roster directory
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              {teams.length} teams · {entries.length} roster entries. A
              competitor may appear on multiple teams.
            </p>
          </div>
          <button
            className={secondary}
            disabled={busy || loading}
            onClick={() => void run(() => Promise.resolve())}
          >
            Refresh
          </button>
        </div>
        <div className="mb-6 grid gap-3 md:grid-cols-4">
          <label className="text-sm text-gray-300">
            <span className="flex items-center gap-2">
              <FaSearch aria-hidden="true" /> Search competitors
            </span>
            <input
              className={input}
              type="search"
              placeholder="Name, email, Discord…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <label className="text-sm text-gray-300">
            Team / season
            <select
              className={input}
              value={team}
              onChange={(event) => setTeam(event.target.value)}
            >
              <option value="">All teams</option>
              {teams.map((item) => (
                <option key={item.id} value={item.id}>
                  {teamLabel(item)}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-gray-300">
            Onboarding
            <select
              className={input}
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
          <label className="text-sm text-gray-300">
            Roster status
            <select
              className={input}
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="former">Former</option>
            </select>
          </label>
        </div>
        {loading ? (
          <p role="status" className="py-14 text-center text-gray-400">
            Loading competitors…
          </p>
        ) : entries.length === 0 ? (
          <div className="py-14 text-center">
            <FaUsers
              aria-hidden="true"
              className="mx-auto mb-4 text-3xl text-tech-gold"
            />
            <h3 className="font-outfit text-xl font-semibold">
              Your next roster starts here
            </h3>
            <p className="mx-auto mt-2 max-w-md text-gray-400">
              {teams.length
                ? "Add your existing competitors, then share their personal invitation links."
                : "Create a team with a game and season, then add the competitors already selected for it."}
            </p>
          </div>
        ) : visible.length === 0 ? (
          <p className="py-12 text-center text-gray-400">
            No competitors match these filters.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">
                Competitor roster and onboarding progress
              </caption>
              <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-400">
                <tr>
                  {[
                    "Competitor",
                    "Team",
                    "Position",
                    "Onboarding",
                    "Status",
                    "",
                  ].map((label, index) => (
                    <th key={index} scope="col" className="px-3 py-4">
                      {label || <span className="sr-only">Actions</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {visible.map((entry) => {
                  const assigned = teams.find(
                    (item) => item.id === entry.team_id
                  );
                  const stage = onboardingStatus(entry);
                  return (
                    <tr
                      key={entry.id}
                      className={
                        selected === entry.id
                          ? "bg-tech-gold/5"
                          : "hover:bg-white/[0.02]"
                      }
                    >
                      <td className="px-3 py-5">
                        <p className="font-medium text-white">
                          {entry.preferred_name}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {entry.email}
                        </p>
                      </td>
                      <td className="px-3 py-5">
                        <p>{assigned?.name ?? "Unknown team"}</p>
                        <p className="mt-1 text-xs text-gray-400">
                          {assigned?.game} · {assigned?.season}
                        </p>
                      </td>
                      <td className="px-3 py-5 capitalize">{entry.position}</td>
                      <td className="px-3 py-5">
                        <span
                          className={`inline-block whitespace-nowrap rounded-full border px-3 py-1 text-xs ${
                            stage === "complete"
                              ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-300"
                              : stage === "expired"
                              ? "border-red-400/25 bg-red-500/10 text-red-200"
                              : "border-white/10 bg-white/5 text-gray-300"
                          }`}
                        >
                          {onboardingLabels[stage]}
                        </span>
                      </td>
                      <td className="px-3 py-5 capitalize text-gray-400">
                        {entry.status}
                      </td>
                      <td className="px-3 py-5">
                        <button
                          className="rounded-lg px-3 py-2 font-medium text-tech-gold underline-offset-4 hover:underline disabled:opacity-50"
                          disabled={busy}
                          aria-label={`Manage ${entry.preferred_name} on ${
                            assigned?.name ?? "team"
                          }`}
                          onClick={() => {
                            setSelected(entry.id);
                            setInvitation(null);
                          }}
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {current && (
        <RosterEditor
          key={`${current.id}-${current.updated_at}`}
          entry={current}
          team={teams.find((item) => item.id === current.team_id)}
          busy={busy}
          invitation={invitation?.id === current.id ? invitation.url : null}
          close={() => {
            setSelected("");
            setInvitation(null);
          }}
          save={(position, nextStatus) =>
            run(async () => {
              await updateCompetitor(current, position, nextStatus);
              if (nextStatus !== "active") setInvitation(null);
              setNotice("Roster updated.");
            })
          }
          invite={() =>
            run(async () => {
              const url = await createInvite(current.id);
              setInvitation({ id: current.id, url });
              setNotice(
                "Invitation created. Copy and share the link with the competitor. Any previous link has been replaced."
              );
            })
          }
          revoke={() =>
            run(async () => {
              await revokeInvite(current.id);
              setInvitation(null);
              setNotice("Invitation revoked.");
            })
          }
        />
      )}
    </section>
  );
}

function TeamForm({
  busy,
  cancel,
  save,
}: {
  busy: boolean;
  cancel: () => void;
  save: (name: string, game: string, season: string) => Promise<void>;
}) {
  return (
    <form
      className={`${panel} mb-6`}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        void save(
          String(data.get("name")),
          String(data.get("game")),
          String(data.get("season"))
        );
      }}
    >
      <h2 className="font-outfit text-xl font-semibold">Create a team</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {[
          ["name", "Team name", "Gold"],
          ["game", "Game", "Valorant"],
          ["season", "Season", "Spring 2027"],
        ].map(([name, label, placeholder]) => (
          <label key={name} className="text-sm text-gray-300">
            {label}
            <input
              className={input}
              name={name}
              required
              maxLength={100}
              placeholder={placeholder}
            />
          </label>
        ))}
      </div>
      <div className="mt-5 flex gap-3">
        <button disabled={busy} className={primary}>
          Create team
        </button>
        <button
          disabled={busy}
          type="button"
          className={secondary}
          onClick={cancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
function PlayerForm({
  busy,
  teams,
  cancel,
  save,
}: {
  busy: boolean;
  teams: CompetitorTeam[];
  cancel: () => void;
  save: (
    team: string,
    name: string,
    email: string,
    position: RosterPosition
  ) => Promise<void>;
}) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    void save(
      String(data.get("team")),
      String(data.get("name")),
      String(data.get("email")),
      data.get("position") as RosterPosition
    );
  }
  return (
    <form className={`${panel} mb-6`} onSubmit={submit}>
      <h2 className="font-outfit text-xl font-semibold">
        Add an existing competitor
      </h2>
      <p className="mt-2 text-sm text-gray-400">
        No account is needed yet. Use the email address they will verify when
        signing in.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-sm text-gray-300">
          Preferred name
          <input
            className={input}
            name="name"
            required
            maxLength={100}
            autoComplete="name"
          />
        </label>
        <label className="text-sm text-gray-300">
          Email address
          <input
            className={input}
            type="email"
            name="email"
            required
            maxLength={254}
            autoComplete="email"
          />
        </label>
        <label className="text-sm text-gray-300">
          Team
          <select className={input} name="team" required>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {teamLabel(team)}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-gray-300">
          Roster position
          <select className={input} name="position">
            <option value="player">Player</option>
            <option value="substitute">Substitute</option>
            <option value="captain">Captain</option>
          </select>
        </label>
      </div>
      <div className="mt-5 flex gap-3">
        <button className={primary} disabled={busy}>
          Add to roster
        </button>
        <button
          type="button"
          className={secondary}
          disabled={busy}
          onClick={cancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
function RosterEditor({
  entry,
  team,
  busy,
  invitation,
  close,
  save,
  invite,
  revoke,
}: {
  entry: Competitor;
  team?: CompetitorTeam;
  busy: boolean;
  invitation: string | null;
  close: () => void;
  save: (position: RosterPosition, status: RosterStatus) => Promise<void>;
  invite: () => Promise<void>;
  revoke: () => Promise<void>;
}) {
  const [position, setPosition] = useState(entry.position);
  const [status, setStatus] = useState(entry.status);
  const [copyStatus, setCopyStatus] = useState("");
  return (
    <section
      className={`${panel} mt-6`}
      aria-labelledby="roster-details-heading"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2
            id="roster-details-heading"
            className="font-outfit text-2xl font-semibold"
          >
            {entry.preferred_name}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {team && teamLabel(team)}
          </p>
        </div>
        <button className={secondary} disabled={busy} onClick={close}>
          Close
        </button>
      </div>
      <dl className="my-6 grid gap-4 text-sm sm:grid-cols-3">
        {[
          ["Email", entry.email],
          ["Discord", entry.discord || "Not provided"],
          ["In-game account", entry.game_account || "Not provided"],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="text-gray-400">{label}</dt>
            <dd className="mt-1 break-words text-white">{value}</dd>
          </div>
        ))}
      </dl>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void save(position, status);
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm text-gray-300">
            Position
            <select
              className={input}
              value={position}
              onChange={(event) =>
                setPosition(event.target.value as RosterPosition)
              }
            >
              <option value="player">Player</option>
              <option value="substitute">Substitute</option>
              <option value="captain">Captain</option>
            </select>
          </label>
          <label className="text-sm text-gray-300">
            Competitive status
            <select
              className={input}
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as RosterStatus)
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="former">Former</option>
            </select>
          </label>
        </div>
        <p className="mt-3 text-xs text-gray-400">
          Inactive and former competitors remain in roster history. Any
          unclaimed invitation will be revoked.
        </p>
        <button
          className={`${secondary} mt-4`}
          disabled={
            busy || (position === entry.position && status === entry.status)
          }
        >
          Save roster changes
        </button>
      </form>
      {!entry.user_id && entry.status === "active" && (
        <div className="mt-6 border-t border-white/10 pt-6">
          <h3 className="font-semibold">Onboarding invitation</h3>
          <p className="mt-2 text-sm text-gray-400">
            Links expire after 7 days. Share with {entry.email}; creating a
            replacement invalidates the previous link. Invitations are shared
            manually.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              disabled={busy}
              className={primary}
              onClick={() => void invite()}
            >
              {entry.onboarding === "invited"
                ? "Replace invitation link"
                : "Create invitation link"}
            </button>
            {entry.onboarding === "invited" && (
              <button
                disabled={busy}
                className={secondary}
                onClick={() => void revoke()}
              >
                Revoke invitation
              </button>
            )}
          </div>
          {entry.invite_expires_at && (
            <p className="mt-3 text-xs text-gray-400">
              Expires {new Date(entry.invite_expires_at).toLocaleString()}
            </p>
          )}
          {invitation && (
            <div className="mt-4">
              <label className="text-sm text-gray-300">
                Personal invitation link
                <input
                  readOnly
                  className={input}
                  value={invitation}
                  onFocus={(event) => event.target.select()}
                />
              </label>
              <button
                className={`${secondary} mt-3`}
                onClick={() => {
                  void navigator.clipboard
                    .writeText(invitation)
                    .then(() => setCopyStatus("Link copied."))
                    .catch(() =>
                      setCopyStatus(
                        "Select the link above and copy it manually."
                      )
                    );
                }}
              >
                Copy link
              </button>
              <p role="status" className="mt-2 text-sm text-gray-300">
                {copyStatus}
              </p>
            </div>
          )}
        </div>
      )}
      {entry.user_id && (
        <p className="mt-6 border-t border-white/10 pt-5 text-sm text-gray-400">
          Account linked · {onboardingLabels[onboardingStatus(entry)]}. The
          player can finish or update their information at{" "}
          <Link
            to="/competitors/onboarding"
            className="text-tech-gold underline"
          >
            competitor onboarding
          </Link>
          .
        </p>
      )}
    </section>
  );
}
