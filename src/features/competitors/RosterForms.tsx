import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  onboardingLabels,
  onboardingStatus,
  type Competitor,
  type RosterPosition,
  type RosterStatus,
} from "./model";
import { input, primary, secondary } from "./adminStyles";

export function TeamForm({
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
      <div className="grid gap-4 sm:grid-cols-3">
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
          Create roster
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
export function PlayerForm({
  busy,
  cancel,
  save,
}: {
  busy: boolean;
  cancel: () => void;
  save: (
    name: string,
    email: string,
    position: RosterPosition
  ) => Promise<void>;
}) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    void save(
      String(data.get("name")),
      String(data.get("email")),
      data.get("position") as RosterPosition
    );
  }
  return (
    <form onSubmit={submit}>
      <p className="mb-5 text-sm text-gray-400">
        Use the email address they will verify when signing in.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
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
export function RosterEditor({
  entry,
  busy,
  invitation,
  save,
  invite,
  revoke,
}: {
  entry: Competitor;
  busy: boolean;
  invitation: string | null;
  save: (position: RosterPosition, status: RosterStatus) => Promise<void>;
  invite: () => Promise<void>;
  revoke: () => Promise<void>;
}) {
  const [position, setPosition] = useState(entry.position);
  const [status, setStatus] = useState(entry.status);
  const [copyStatus, setCopyStatus] = useState("");
  const stage = onboardingStatus(entry);
  const shareableLink = stage === "expired" ? null : invitation;
  return (
    <>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void save(position, status);
        }}
      >
        <div className="mt-6 grid gap-4 border-t border-white/10 pt-5 sm:grid-cols-2">
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
            {!shareableLink && (
              <button
                disabled={busy}
                className={primary}
                onClick={() => void invite()}
              >
                {entry.onboarding === "invited"
                  ? "Replace invitation link"
                  : "Create invitation link"}
              </button>
            )}
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
          {shareableLink && (
            <div className="mt-4">
              <label className="text-sm text-gray-300">
                Personal invitation link
                <input
                  readOnly
                  className={input}
                  value={shareableLink}
                  onFocus={(event) => event.target.select()}
                />
              </label>
              <button
                className={`${primary} mt-3`}
                onClick={() => {
                  void Promise.resolve()
                    .then(() => navigator.clipboard.writeText(shareableLink))
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
          Account linked · {onboardingLabels[stage]}. The player can finish or
          update their information at{" "}
          <Link
            to="/competitors/onboarding"
            className="text-tech-gold underline"
          >
            competitor onboarding
          </Link>
          .
        </p>
      )}
    </>
  );
}

export function RecordEditor({
  fields,
  busy,
  save,
  remove,
  removeLabel,
}: {
  fields: [
    name: string,
    label: string,
    value: string,
    required: boolean,
    readOnly?: boolean
  ][];
  busy: boolean;
  save: (fields: Record<string, string>) => Promise<void>;
  remove: () => void;
  removeLabel: string;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        void save(
          Object.fromEntries(
            fields.map(([name]) => [name, String(data.get(name))])
          )
        );
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map(([name, label, value, required, readOnly]) => (
          <label key={name} className="text-sm text-gray-300">
            {label}
            <input
              className={input}
              name={name}
              defaultValue={value}
              required={required}
              readOnly={readOnly}
              type={name === "player_email" ? "email" : "text"}
              maxLength={name === "player_email" ? 254 : 100}
            />
            {readOnly && (
              <span className="mt-1 block text-xs text-gray-400">
                Email is tied to the linked account.
              </span>
            )}
          </label>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button disabled={busy} className={primary}>
          Save details
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={remove}
          className={`${secondary} text-red-300`}
        >
          {removeLabel}
        </button>
      </div>
    </form>
  );
}
