import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { FaDiscord } from "react-icons/fa";
import { FiArrowUpRight, FiX } from "react-icons/fi";
import Highlight from "./Highlight";

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameName: string;
  gameDescription: string;
  gameImage: string;
  discordLink: string;
  category: "Competitive" | "Casual";
  highlightLink?: string;
}

export default function GameModal({ isOpen, onClose, gameName, gameDescription, gameImage, discordLink, category, highlightLink }: GameModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <dialog ref={dialogRef} aria-labelledby={titleId} aria-describedby={descriptionId}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-4xl overflow-y-auto overscroll-contain rounded-3xl border border-white/15 bg-deep-space p-0 text-white shadow-2xl backdrop:bg-black/80 backdrop:backdrop-blur-sm">
      <div>
        <header className="relative border-b border-white/10 bg-gradient-to-br from-tech-gold/10 via-white/[0.03] to-transparent p-6 pr-20 sm:p-8 sm:pr-24">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-tech-gold">{category} community</p>
          <h2 id={titleId} className="font-outfit text-3xl font-bold leading-tight sm:text-4xl">{gameName}</h2>
          <button type="button" aria-label={`Close ${gameName} details`} onClick={onClose}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-gray-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-tech-gold sm:right-6 sm:top-6">
            <FiX size={22} aria-hidden="true" />
          </button>
        </header>
        <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[minmax(0,1fr)_240px]">
          <div className="min-w-0">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">About the game</h3>
            <p id={descriptionId} className="text-base leading-relaxed text-gray-300">{gameDescription}</p>
            {highlightLink ? (
              <section aria-label={`${gameName} highlights`} className="mt-7">
                <h3 className="mb-3 font-outfit text-lg font-semibold">Watch a highlight</h3>
                <Highlight src={highlightLink} title={`${gameName} highlight`} isOpen={isOpen} autoPlay={false} />
              </section>
            ) : (
              <div className="relative mt-7 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <img src={gameImage} alt="" className="aspect-video w-full object-cover" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep-space/50 to-transparent" />
              </div>
            )}
          </div>
          <aside className="self-start rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-tech-gold/10 text-tech-gold"><FaDiscord size={23} aria-hidden="true" /></div>
            <h3 className="font-outfit text-xl font-semibold">Find your people</h3>
            <p className="mb-6 mt-3 text-sm leading-relaxed text-gray-400">Connect with players in GT Esports Organization. Visit the game Discord for community updates and ways to get involved.</p>
            {discordLink ? (
              <a href={discordLink} target="_blank" rel="noopener noreferrer"
                className="flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-tech-gold px-4 py-3 text-sm font-bold text-deep-space transition-colors hover:bg-gold-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tech-gold">
                Join Discord <FiArrowUpRight aria-hidden="true" />
              </a>
            ) : <p className="rounded-xl border border-white/10 px-4 py-3 text-sm text-gray-400">Community link coming soon.</p>}
            <p className="mt-4 text-xs leading-relaxed text-gray-500">{category === "Competitive" ? "Check the game community for current tryout and roster information." : "Meet other players and enjoy the game together."}</p>
          </aside>
        </div>
      </div>
    </dialog>, document.body,
  );
}
