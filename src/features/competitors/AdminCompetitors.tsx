import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiPlus, FiRefreshCw } from "react-icons/fi";
import {
  addCompetitor,
  createInvite,
  createTeam,
  loadCompetitors,
  manageRecord,
  revokeInvite,
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

export default function AdminCompetitors() {
  const [data, setData] = useState<Awaited<
    ReturnType<typeof loadCompetitors>
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");
  const [selection, setSelection] = useState("");
  const [editor, setEditor] = useState<Editor | null>(null);
  const [invitation, setInvitation] = useState<string | null>(null);
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
      setData(await loadCompetitors());
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
    setInvitation(null);
    setEditor(next);
  }

  async function run(action: () => Promise<() => void>) {
    setBusy(true);
    setActionError("");
    setNotice("");
    try {
      const finish = await action();
      await reload();
      finish();
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
  const feedback = (
    <>
      {(actionError || loadError) && (
        <div
          role="alert"
          className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200"
        >
          <p>{actionError || loadError}</p>
          <button
            className={secondary}
            disabled={controlsBusy}
            onClick={() => {
              setActionError("");
              void reload();
            }}
          >
            Refresh data
          </button>
        </div>
      )}
      {notice && (
        <p
          role="status"
          className="mb-5 rounded-xl border border-tech-gold/30 bg-tech-gold/10 p-4 text-sm text-tech-gold"
        >
          {notice}
        </p>
      )}
    </>
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
        >
          {feedback}
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
                    ["discord_contact", "Discord", current.discord, false],
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
                          setInvitation(null);
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
                  invitation={invitation}
                  save={(position, status) =>
                    run(async () => {
                      await updateCompetitor(current, position, status);
                      return () => {
                        if (status !== "active") setInvitation(null);
                        setNotice("Roster membership updated.");
                      };
                    })
                  }
                  invite={() =>
                    run(async () => {
                      const url = await createInvite(current.id);
                      return () => {
                        setInvitation(url);
                        setNotice(
                          "Invitation created. Copy and share the link with the competitor."
                        );
                      };
                    })
                  }
                  revoke={() =>
                    run(async () => {
                      await revokeInvite(current.id);
                      return () => {
                        setInvitation(null);
                        setNotice("Invitation revoked.");
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
