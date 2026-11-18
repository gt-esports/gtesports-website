import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  acceptInvite,
  canViewInvite,
  completeOnboarding,
  loadCompetitors,
} from "./api";
import type { Competitor, CompetitorTeam } from "./model";

const input =
  "mt-2 w-full rounded-xl border border-white/20 bg-deep-space px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-tech-gold";
const button =
  "inline-block rounded-xl bg-tech-gold px-5 py-3 font-semibold text-deep-space disabled:opacity-50";
function pendingToken() {
  const token = new URLSearchParams(window.location.hash.slice(1)).get(
    "invite"
  );
  if (token && /^[a-f0-9]{64}$/.test(token)) {
    sessionStorage.setItem("competitor-invite", token);
    window.history.replaceState(null, "", window.location.pathname);
    return token;
  }
  return sessionStorage.getItem("competitor-invite") ?? "";
}
export default function CompetitorOnboarding() {
  const { user, loading: authLoading } = useAuth();
  const currentUser = useRef(user?.id);
  currentUser.current = user?.id;
  const [token, setToken] = useState(pendingToken);
  const [inviteAccess, setInviteAccess] = useState<{
    userId: string;
    token: string;
    allowed: boolean;
  }>();
  const userId = user?.id;
  useEffect(() => {
    if (!userId || !token || authLoading) return;
    let active = true;
    const resolve = (allowed: boolean) => {
      if (active) setInviteAccess({ userId, token, allowed });
    };
    void canViewInvite(token).then(resolve, () => resolve(false));
    return () => {
      active = false;
    };
  }, [userId, token, authLoading]);
  const checkedInvite =
    inviteAccess?.userId === userId && inviteAccess?.token === token;
  const [teams, setTeams] = useState<CompetitorTeam[]>([]);
  const [entries, setEntries] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const reload = useCallback(async () => {
    if (!user) {
      setEntries([]);
      setTeams([]);
      return;
    }
    const requestedUser = user.id;
    setLoading(true);
    try {
      const result = await loadCompetitors();
      if (currentUser.current !== requestedUser) return;
      // Admin accounts may also compete; this page shows only their own memberships.
      setEntries(result.entries.filter((entry) => entry.user_id === user.id));
      setTeams(result.teams);
    } catch (failure) {
      if (currentUser.current !== requestedUser) return;
      setEntries([]);
      setTeams([]);
      throw failure;
    } finally {
      if (currentUser.current === requestedUser) setLoading(false);
    }
  }, [user]);
  useEffect(() => {
    if (user) sessionStorage.removeItem("competitor-onboarding-return");
    void reload().catch((failure) =>
      setError(
        failure instanceof Error
          ? failure.message
          : "Unable to load your teams."
      )
    );
  }, [reload, user]);
  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await action();
      await reload();
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Unable to complete onboarding."
      );
    } finally {
      setBusy(false);
    }
  }
  if (
    token &&
    !authLoading &&
    user &&
    (!checkedInvite || !inviteAccess?.allowed)
  ) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16">
        {checkedInvite ? (
          <>
            <h1 className="font-outfit text-3xl font-bold">Not authorized</h1>
            <p role="alert" className="mt-4 text-gray-300">
              This invitation is unavailable for your account.
            </p>
            <button
              className={`${button} mt-5`}
              onClick={() => {
                sessionStorage.removeItem("competitor-invite");
                setToken("");
              }}
            >
              Go to my teams
            </button>
          </>
        ) : (
          <p role="status">Checking invitation access…</p>
        )}
      </section>
    );
  }
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-tech-gold">
        GT Esports Organization
      </p>
      <h1 className="mt-3 font-outfit text-4xl font-bold">
        Competitor onboarding
      </h1>
      <p className="mt-4 text-gray-400">
        Claim your roster invitation and complete the information your team
        needs.
      </p>
      {error && (
        <p
          role="alert"
          className="mt-6 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-red-200"
        >
          {error}
        </p>
      )}
      {notice && (
        <p
          role="status"
          className="mt-6 rounded-xl border border-tech-gold/30 p-4 text-tech-gold"
        >
          {notice}
        </p>
      )}
      {authLoading || loading ? (
        <p role="status" className="py-8">
          Loading your account…
        </p>
      ) : !user ? (
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="font-outfit text-xl font-semibold">
            Start with your account
          </h2>
          <p className="my-4 text-gray-300">
            Sign in or create an account using the email address staff invited.
            Verify your email before accepting. If your Discord account uses a
            different email, contact staff to replace your invitation.
          </p>
          <Link
            to="/auth"
            className={button}
            onClick={() =>
              sessionStorage.setItem("competitor-onboarding-return", "yes")
            }
          >
            Sign in or create account
          </Link>
        </div>
      ) : (
        <>
          {token && (
            <div className="mt-8 rounded-2xl border border-tech-gold/20 bg-tech-gold/5 p-6">
              <h2 className="font-outfit text-xl font-semibold">
                Accept your invitation
              </h2>
              <p className="my-3 text-sm text-gray-300">
                Signed in as {user.email}. Your verified email must match the
                invitation recipient.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  className={button}
                  disabled={busy}
                  onClick={() =>
                    void run(async () => {
                      await acceptInvite(token);
                      setToken("");
                      sessionStorage.removeItem("competitor-invite");
                      sessionStorage.removeItem("competitor-onboarding-return");
                      setNotice(
                        "Invitation accepted. Complete your player information below."
                      );
                    })
                  }
                >
                  Accept roster invitation
                </button>
                <button
                  disabled={busy}
                  className="rounded-xl border border-white/20 px-4 py-3 text-sm"
                  onClick={() => {
                    setToken("");
                    sessionStorage.removeItem("competitor-invite");
                    sessionStorage.removeItem("competitor-onboarding-return");
                  }}
                >
                  Dismiss invitation
                </button>
              </div>
            </div>
          )}
          {!token && entries.length === 0 && (
            <p className="mt-8 rounded-xl border border-white/10 p-6 text-gray-300">
              No team assignments yet. Open the personal invitation link from
              your team manager to claim your roster spot.
            </p>
          )}
          {entries.map((entry) => (
            <PlayerDetails
              key={`${entry.id}-${entry.updated_at}`}
              entry={entry}
              team={teams.find((team) => team.id === entry.team_id)}
              busy={busy}
              save={(name, discord, account) =>
                run(async () => {
                  await completeOnboarding(entry.id, name, discord, account);
                  setNotice(
                    "Your competitor information is saved. Onboarding is complete."
                  );
                })
              }
            />
          ))}
        </>
      )}
    </section>
  );
}
function PlayerDetails({
  entry,
  team,
  busy,
  save,
}: {
  entry: Competitor;
  team?: CompetitorTeam;
  busy: boolean;
  save: (name: string, discord: string, account: string) => Promise<void>;
}) {
  return (
    <form
      className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        void save(
          String(data.get("name")),
          String(data.get("discord")),
          String(data.get("account"))
        );
      }}
    >
      <div className="flex flex-wrap justify-between gap-3">
        <h2 className="font-outfit text-2xl font-semibold">{team?.name}</h2>
        <span className="text-sm text-tech-gold">
          {entry.onboarding === "complete" ? "Complete" : "In progress"}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-400">
        {team?.game} · {team?.season} ·{" "}
        <span className="capitalize">{entry.position}</span>
      </p>
      <p className="mt-4 text-sm text-gray-400">
        If your team or roster position is incorrect, contact your manager. Your
        contact information is available to website administrators.
      </p>
      <div className="mt-5 space-y-4">
        <label className="block text-sm text-gray-300">
          Preferred name
          <input
            className={input}
            required
            maxLength={100}
            name="name"
            defaultValue={entry.preferred_name}
          />
        </label>
        <label className="block text-sm text-gray-300">
          Discord contact
          <input
            className={input}
            required
            maxLength={100}
            name="discord"
            defaultValue={entry.discord}
          />
        </label>
        <label className="block text-sm text-gray-300">
          In-game name / account ID
          <input
            className={input}
            required
            maxLength={100}
            name="account"
            defaultValue={entry.game_account}
          />
        </label>
      </div>
      <button
        className={`${button} mt-6`}
        disabled={busy || entry.status !== "active"}
      >
        {entry.onboarding === "complete"
          ? "Save profile changes"
          : "Finish onboarding"}
      </button>
      {entry.status !== "active" && (
        <p className="mt-3 text-sm text-gray-400">
          This roster membership is {entry.status}. Contact your manager to
          reactivate it.
        </p>
      )}
    </form>
  );
}
