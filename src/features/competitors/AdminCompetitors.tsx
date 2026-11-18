import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiPlus, FiRefreshCw, FiX } from "react-icons/fi";
import {
  addCompetitor,
  createInvite,
  createTeam,
  loadCompetitors,
  manageRecord,
  updateCompetitor,
} from "./api";
import { primary, secondary, teamLabel } from "./adminStyles";
import RosterDirectory from "./RosterDirectory";
import RosterDialog from "./RosterDialog";
import {
  RecordEditor,
  PlayerForm,
  RosterEditor,
  TeamForm,
} from "./RosterForms";

type Editor =
  | { type: "team" }
  | { type: "editTeam"; teamId: string }
  | { type: "add"; teamId: string }
  | { type: "member"; id: string };
const message = (error: unknown) =>
  error instanceof Error
    ? error.message
    : "Unable to complete this action. Please try again.";

type Directory = Awaited<ReturnType<typeof loadCompetitors>>;
type CachedInvite = { url: string; expiresAt: string };

export default function AdminCompetitors() {
  const [data, setData] = useState<Directory | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");
  const [selection, setSelection] = useState("");
  const [editor, setEditor] = useState<Editor | null>(null);
  const [invitations, setInvitations] = useState(
    new Map<string, CachedInvite>()
  );
  // Re-evaluate invite expiration as long as the page stays open.
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
    setLoadError("");
    try {
      const directory = await loadCompetitors();
      setData(directory);
      setInvitations((previous) => {
        const valid = new Map<string, CachedInvite>();
        for (const entry of directory.entries) {
          const cached = previous.get(entry.id);
          if (
            cached &&
            entry.onboarding === "invited" &&
            entry.status === "active" &&
            entry.invite_expires_at === cached.expiresAt
          )
            valid.set(entry.id, cached);
        }
        return valid;
      });
      return directory;
    } catch (error) {
      setLoadError(message(error));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void reload();
  }, [reload]);

  function open(next: Editor | null) {
    setActionError("");
    setNotice("");
    setEditor(next);
  }

  function forgetInvitation(id: string) {
    setInvitations((previous) => {
      const next = new Map(previous);
      next.delete(id);
      return next;
    });
  }

  async function run(action: () => Promise<(directory?: Directory) => void>) {
    setBusy(true);
    setActionError("");
    setNotice("");
    try {
      const finish = await action();
      finish(await reload());
    } catch (error) {
      setActionError(message(error));
    } finally {
      setBusy(false);
    }
  }

  const teams = data?.teams ?? [];
  const entries = data?.entries ?? [];
  const selectedTeam =
    selection === "all"
      ? undefined
      : teams.find((team) => team.id === selection) ?? teams[0];
  const current =
    editor?.type === "member"
      ? entries.find((entry) => entry.id === editor.id)
      : undefined;
  const formTeam =
    editor?.type === "add" || editor?.type === "editTeam"
      ? teams.find((team) => team.id === editor.teamId)
      : undefined;
  const currentTeam = teams.find((team) => team.id === current?.team_id);
  const controlsBusy = loading || busy;
  const feedbackError = actionError || loadError;
  const feedbackMessage = feedbackError || notice;

  useEffect(() => {
    if (!notice || feedbackError) return;
    const timeout = window.setTimeout(() => setNotice(""), 5000);
    return () => window.clearTimeout(timeout);
  }, [notice, feedbackError]);

  const feedback = feedbackMessage && (
    <div
      className={`pointer-events-auto z-50 flex w-full max-w-md items-start gap-3 rounded-xl border border-white/15 bg-deep-space px-4 py-3 text-sm shadow-2xl ${
        editor ? "" : "fixed bottom-4 right-4 w-[calc(100%-2rem)] sm:right-6"
      }`}
    >
      <div className="min-w-0 flex-1">
        <p
          role={feedbackError ? "alert" : "status"}
          className={feedbackError ? "text-red-200" : "text-white"}
        >
          {feedbackMessage}
        </p>
        {feedbackError && (
          <button
            type="button"
            className="mt-2 font-medium text-tech-gold hover:underline disabled:opacity-50"
            disabled={controlsBusy}
            onClick={() => {
              setActionError("");
              void reload();
            }}
          >
            Refresh data
          </button>
        )}
      </div>
      <button
        type="button"
        aria-label="Dismiss notification"
        className="shrink-0 rounded p-1 text-gray-300 hover:bg-white/10 hover:text-white"
        onClick={() => {
          setActionError("");
          setLoadError("");
          setNotice("");
        }}
      >
        <FiX size={18} aria-hidden="true" />
      </button>
    </div>
  );

  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6">
      <Link
        to="/admin"
        className="inline-flex items-center gap-2 text-sm text-tech-gold hover:underline"
      >
        <FiArrowLeft aria-hidden="true" /> Administration
      </Link>
      <header className="mb-7 mt-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-outfit text-3xl font-bold text-white sm:text-4xl">
            Competitors &amp; rosters
          </h1>
          <p className="mt-2 text-gray-400">
            Manage team memberships and track competitor onboarding.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className={secondary}
            disabled={controlsBusy}
            onClick={() => void reload()}
          >
            <FiRefreshCw aria-hidden="true" /> Refresh
          </button>
          <button
            className={primary}
            disabled={controlsBusy || !data}
            onClick={() => open({ type: "team" })}
          >
            <FiPlus aria-hidden="true" /> Create roster
          </button>
        </div>
      </header>

      {!editor && feedback}
      {loading && !data && (
        <p role="status" className="py-12 text-center text-gray-400">
          Loading rosters…
        </p>
      )}
      {data && (
        <RosterDirectory
          teams={teams}
          entries={entries}
          selectedTeam={selectedTeam}
          busy={controlsBusy}
          select={(id) => {
            setSelection(id);
            setNotice("");
          }}
          add={(teamId) => open({ type: "add", teamId })}
          editTeam={(teamId) => open({ type: "editTeam", teamId })}
          manage={(id) => open({ type: "member", id })}
        />
      )}

      {editor && (
        <RosterDialog
          title={
            editor.type === "team"
              ? "Create roster"
              : editor.type === "editTeam"
              ? "Edit roster"
              : editor.type === "add"
              ? "Add competitor"
              : current?.preferred_name ?? "Manage competitor"
          }
          context={
            formTeam
              ? teamLabel(formTeam)
              : currentTeam && teamLabel(currentTeam)
          }
          busy={controlsBusy}
          close={() => open(null)}
          notification={feedback}
        >
          {editor.type === "team" && (
            <TeamForm
              busy={controlsBusy}
              cancel={() => open(null)}
              save={(name, game, season) =>
                run(async () => {
                  const id = await createTeam(name, game, season);
                  return () => {
                    setSelection(id);
                    open(null);
                    setNotice("Roster created.");
                  };
                })
              }
            />
          )}
          {editor.type === "editTeam" && formTeam && (
            <RecordEditor
              busy={controlsBusy}
              fields={[
                ["team_name", "Team name", formTeam.name, true],
                ["game_name", "Game", formTeam.game, true],
                ["season_name", "Season", formTeam.season, true],
              ]}
              save={(fields) =>
                run(async () => {
                  await manageRecord("edit_competitor_team", {
                    ...fields,
                    team: formTeam.id,
                  });
                  return () => {
                    open(null);
                    setNotice("Roster updated.");
                  };
                })
              }
              removeLabel="Delete roster"
              remove={() => {
                if (
                  !window.confirm(
                    "Permanently delete this roster, all its competitor records, and their invitations?"
                  )
                )
                  return;
                void run(async () => {
                  await manageRecord("delete_competitor_team", {
                    team: formTeam.id,
                  });
                  return () => {
                    setSelection("");
                    open(null);
                    setNotice("Roster deleted.");
                  };
                });
              }}
            />
          )}
          {editor.type === "add" && formTeam && (
            <PlayerForm
              busy={controlsBusy}
              cancel={() => open(null)}
              save={(name, email, position) =>
                run(async () => {
                  const id = await addCompetitor(
                    formTeam.id,
                    name,
                    email,
                    position
                  );
                  return () => {
                    open({ type: "member", id });
                    setNotice(
                      "Competitor added. Create a link below to invite them."
                    );
                  };
                })
              }
            />
          )}
          {editor.type === "member" &&
            (current ? (
              <>
                <RecordEditor
                  key={`details-${current.id}-${current.updated_at}`}
                  busy={controlsBusy}
                  fields={[
                    [
                      "player_name",
                      "Preferred name",
                      current.preferred_name,
                      true,
                    ],
                    [
                      "player_email",
                      "Email address",
                      current.email,
                      true,
                      Boolean(current.user_id),
                    ],
                    [
                      "discord_contact",
                      "Discord username",
                      current.discord,
                      false,
                      true,
                    ],
                    [
                      "in_game_account",
                      "In-game account",
                      current.game_account,
                      false,
                    ],
                  ]}
                  save={(fields) =>
                    run(async () => {
                      await manageRecord("edit_competitor_details", {
                        ...fields,
                        member: current.id,
                        expected_updated_at: current.updated_at,
                      });
                      return () => {
                        if (
                          fields.player_email.trim().toLowerCase() !==
                          current.email
                        )
                          forgetInvitation(current.id);
                        setNotice("Competitor details updated.");
                      };
                    })
                  }
                  removeLabel="Delete competitor"
                  remove={() => {
                    if (
                      !window.confirm(
                        "Permanently delete this competitor’s information and invitation from this roster?"
                      )
                    )
                      return;
                    void run(async () => {
                      await manageRecord("delete_competitor_membership", {
                        member: current.id,
                        expected_updated_at: current.updated_at,
                      });
                      return () => {
                        open(null);
                        setNotice("Competitor deleted from the roster.");
                      };
                    });
                  }}
                />
                <RosterEditor
                  key={`${current.id}-${current.updated_at}`}
                  entry={current}
                  busy={controlsBusy}
                  invitation={invitations.get(current.id)?.url ?? null}
                  notify={(text) => {
                    setActionError("");
                    setNotice(text);
                  }}
                  save={(position, status) =>
                    run(async () => {
                      await updateCompetitor(current, position, status);
                      return () => {
                        if (status !== "active") forgetInvitation(current.id);
                        setNotice("Roster membership updated.");
                      };
                    })
                  }
                  invite={() =>
                    run(async () => {
                      const url = await createInvite(current.id);
                      return (directory) => {
                        const entry = directory?.entries.find(
                          ({ id }) => id === current.id
                        );
                        const expiresAt = entry?.invite_expires_at;
                        if (expiresAt && entry.onboarding === "invited") {
                          setInvitations((previous) =>
                            new Map(previous).set(current.id, {
                              url,
                              expiresAt,
                            })
                          );
                        }
                        setNotice(
                          "Invitation created. Copy and share the link with the competitor."
                        );
                      };
                    })
                  }
                />
              </>
            ) : (
              <p className="text-sm text-gray-400">
                Refresh to load this roster membership.
              </p>
            ))}
        </RosterDialog>
      )}
    </section>
  );
}
