import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";

export default function RosterDialog({
  title,
  context,
  busy,
  close,
  children,
  notification,
}: {
  title: string;
  context?: string;
  busy: boolean;
  close: () => void;
  children: ReactNode;
  notification?: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected)
        previousFocus.focus();
    };
  }, []);

  useEffect(() => {
    heading.current?.focus();
  }, [title]);

  return createPortal(
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) close();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-2xl overflow-hidden rounded-2xl border border-white/15 bg-deep-space p-0 text-white shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      <div className="max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain">
        <header className="flex items-start justify-between gap-4 border-b border-white/10 bg-white/[0.04] px-5 py-4 sm:px-6">
          <div className="min-w-0 break-words">
            <h2
              ref={heading}
              id={titleId}
              tabIndex={-1}
              className="font-outfit text-2xl font-semibold focus:outline-none"
            >
              {title}
            </h2>
            {context && <p className="mt-1 text-sm text-gray-400">{context}</p>}
          </div>
          <button
            type="button"
            aria-label="Close dialog"
            disabled={busy}
            onClick={close}
            className="rounded-lg p-2 text-gray-300 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-tech-gold disabled:opacity-50"
          >
            <FiX size={22} aria-hidden="true" />
          </button>
        </header>
        <div className="p-5 sm:p-6">{children}</div>
      </div>
      {notification && (
        <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center px-4">
          {notification}
        </div>
      )}
    </dialog>,
    document.body
  );
}
