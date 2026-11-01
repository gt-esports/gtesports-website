import { useState } from "react";
import { useLocation } from "react-router-dom";
import { FiMail } from "react-icons/fi";
import NewsletterModal from "./NewsletterModal";

// Home and About show the full signup section, so the button is hidden there.
// Account and admin pages are hidden too, since visitors there are not browsing the site.
const hiddenOn = ["/", "/home", "/about", "/auth", "/admin"];

function NewsletterButton() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const hidden = hiddenOn.some((path) => path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`));

  if (hidden) return null;

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-haspopup="dialog"
        className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full bg-tech-gold px-5 py-3 font-outfit text-sm font-bold tracking-wide text-deep-space shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all hover:-translate-y-0.5 hover:bg-gold-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tech-gold motion-reduce:transition-none motion-reduce:hover:translate-y-0">
        <FiMail size={18} aria-hidden="true" />
        NEWSLETTER
      </button>
      <NewsletterModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}

export default NewsletterButton;