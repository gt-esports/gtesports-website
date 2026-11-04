import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import SubscribeForm from "./Form";

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Same dialog pattern as GameModal: native <dialog> handles focus trapping and Escape.
export default function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

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
    <dialog ref={dialogRef} aria-labelledby={titleId}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto overscroll-contain rounded-3xl border border-white/15 bg-deep-space p-0 text-white shadow-2xl backdrop:bg-black/80 backdrop:backdrop-blur-sm">
      <header className="relative border-b border-white/10 bg-gradient-to-br from-tech-gold/10 via-white/[0.03] to-transparent p-6 pr-20 sm:p-8 sm:pr-24">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-tech-gold">Stay connected</p>
        <h2 id={titleId} className="font-outfit text-3xl font-bold leading-tight">Get the GT Esports Newsletter</h2>
        <p className="mt-2 text-sm text-gray-400">Match results, community events, and recruitment news.</p>
        <button type="button" aria-label="Close newsletter signup" onClick={onClose}
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-gray-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-tech-gold sm:right-6 sm:top-6">
          <FiX size={22} aria-hidden="true" />
        </button>
      </header>
      <div className="p-6 sm:p-8">
        <SubscribeForm variant="modal" />
      </div>
    </dialog>,
    document.body,
  );
}