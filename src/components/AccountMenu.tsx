import { useEffect, useId, useRef, useState } from "react";
import { FiChevronDown, FiGrid, FiLogOut, FiUser } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AccountMenu({ onNavigate }: { onNavigate?: () => void }) {
  const { user, profile, isAdmin, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const navigate = useNavigate();
  const metadataName: unknown = user?.user_metadata?.full_name;
  const name = profile?.full_name || (typeof metadataName === "string" ? metadataName : "Account");

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !container.current?.contains(event.target)) setOpen(false);
    };
    const closeEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeEscape);
    };
  }, [open]);

  const handleSignOut = async () => {
    setPending(true);
    setError(null);
    try {
      await signOut();
      setOpen(false);
      onNavigate?.();
      navigate("/home");
    } catch {
      setError("Couldn't sign out. Please try again.");
    } finally {
      setPending(false);
    }
  };

  const actionClass = "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-tech-gold";

  return (
    <div ref={container} className="relative" onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      <button
        ref={trigger}
        type="button"
        aria-label={`Account options for ${name}`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(!open)}
        className={`flex min-h-[44px] items-center gap-3 rounded-full border py-1.5 pl-1.5 pr-3 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-tech-gold ${open ? "border-tech-gold/40 bg-white/5" : "border-white/10 hover:border-white/25 hover:bg-white/5"}`}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-tech-gold/10 text-tech-gold"><FiUser size={17} aria-hidden="true" /></span>
        <span className="max-w-[120px] truncate text-sm font-medium text-gray-200">{name}</span>
        <FiChevronDown aria-hidden="true" className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div id={panelId} className="absolute right-0 top-full z-50 mt-3 w-60 rounded-xl border border-white/10 bg-nav-bg p-2 text-left shadow-2xl">
          <div className="mb-1 border-b border-white/10 px-3 pb-3 pt-2">
            <p className="truncate text-sm font-medium text-white">{name}</p>
            <p className="mt-1 truncate text-xs text-gray-400">{user?.email}</p>
          </div>
          {isAdmin && (
            <NavLink to="/admin" onClick={() => { setOpen(false); onNavigate?.(); }} className={actionClass}>
              <FiGrid size={17} aria-hidden="true" className="text-tech-gold" />
              Admin dashboard
            </NavLink>
          )}
          <button type="button" disabled={pending} onClick={() => void handleSignOut()} className={`${actionClass} disabled:opacity-50`}>
            <FiLogOut size={17} aria-hidden="true" />
            {pending ? "Signing out…" : "Sign out"}
          </button>
          {error && <p role="alert" className="px-3 py-2 text-xs text-red-300">{error}</p>}
        </div>
      )}
    </div>
  );
}
