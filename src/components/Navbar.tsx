import { useEffect, useRef, useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { TfiClose } from "react-icons/tfi";
import { Link, NavLink, useLocation } from "react-router-dom";
import AccountMenu from "./AccountMenu";
import Logo from "../assets/branding/gt-esports-logo.png";
import { useAuth } from "../context/AuthContext";

const primaryLinks = [
  { name: "GAMES", link: "/games" },
  { name: "NEWS", link: "/news" },
];
const aboutLinks = [
  { name: "About Us", link: "/about" },
  { name: "Leadership", link: "/leadership" },
];
const mobileLinks = [...primaryLinks, ...aboutLinks, { name: "Join Us", link: "/join-us" }];
const focusClass = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-gold focus-visible:ring-offset-4 focus-visible:ring-offset-deep-space";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, loading } = useAuth();
  const [aboutOpen, setAboutOpen] = useState(false);
  const aboutContainer = useRef<HTMLLIElement>(null);
  const aboutTrigger = useRef<HTMLButtonElement>(null);
  const mobileTrigger = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();
  const aboutActive = aboutLinks.some(({ link }) => pathname === link);

  useEffect(() => {
    if (!aboutOpen && !open) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !aboutContainer.current?.contains(event.target)) setAboutOpen(false);
    };
    const closeEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (aboutOpen) aboutTrigger.current?.focus();
      else mobileTrigger.current?.focus();
      setAboutOpen(false);
      setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeEscape);
    };
  }, [aboutOpen, open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const desktop = window.matchMedia("(min-width: 1280px)");
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.body.style.overflow = previous;
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <>
      <nav aria-label="Main navigation"
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? "bg-nav-bg backdrop-blur-md border-b border-white/10" : "bg-transparent"
          }`}
      >
        <div className="relative z-50 mx-auto flex h-[10vh] max-w-7xl items-center justify-between px-6 xl:px-8">
          {/* Logo */}
          <Link to="/" onClick={() => { setOpen(false); setAboutOpen(false); }} className="flex items-center gap-3 group lg:shrink-0">
            <img
              src={Logo}
              alt="GT Esports Organization Logo"
              className="h-10 w-10 transition-transform duration-300 group-hover:scale-110 sm:h-12 sm:w-12"
            />
            <div className="flex flex-col font-outfit leading-none">
              <span className="text-lg font-bold text-tech-gold tracking-wider">GEORGIA TECH</span>
              <span className="text-sm font-light text-white tracking-[0.2em]">ESPORTS ORGANIZATION</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-8 xl:flex">
            <ul className="flex items-center gap-8">
              {primaryLinks.map((link) => (
                <li key={link.name}>
                  <NavLink
                    to={link.link}
                    className={({ isActive }) =>
                      `whitespace-nowrap text-sm font-medium tracking-wide transition-all duration-300 motion-reduce:transition-none hover:text-tech-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-gold focus-visible:ring-offset-4 focus-visible:ring-offset-deep-space ${isActive ? "text-tech-gold" : "text-gray-300"
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
              <li ref={aboutContainer} className="relative" onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setAboutOpen(false);
              }}>
                <button ref={aboutTrigger} type="button" aria-expanded={aboutOpen} aria-controls="about-navigation"
                  onClick={() => setAboutOpen((value) => !value)}
                  className={`flex min-h-[44px] items-center gap-2 text-sm font-medium tracking-wide hover:text-tech-gold ${focusClass} ${aboutActive ? "text-tech-gold" : "text-gray-300"}`}>
                  ABOUT <span aria-hidden="true" className={`transition-transform motion-reduce:transition-none ${aboutOpen ? "rotate-180" : ""}`}>⌄</span>
                </button>
                {aboutOpen && (
                  <ul id="about-navigation" className="absolute right-0 top-full mt-3 w-48 rounded-xl border border-white/10 bg-nav-bg p-2 shadow-2xl">
                    {aboutLinks.map((link) => (
                      <li key={link.link}><NavLink to={link.link} onClick={() => setAboutOpen(false)}
                        className={({ isActive }) => `block rounded-lg px-4 py-3 text-sm hover:bg-white/5 hover:text-tech-gold ${focusClass} ${isActive ? "text-tech-gold" : "text-gray-300"}`}>
                        {link.name}
                      </NavLink></li>
                    ))}
                  </ul>
                )}
              </li>
            </ul>
            <NavLink to="/join-us" className={`rounded-full bg-tech-gold px-6 py-3 text-sm font-bold text-deep-space transition-colors hover:bg-gold-glow ${focusClass}`}>JOIN US</NavLink>

            {/* Auth Buttons */}
            <div className="shrink-0 border-l border-white/20 pl-4 xl:pl-8">
              {loading ? (
                <div className="h-9 w-20" />
              ) : user ? (
                <AccountMenu />
              ) : (
                <Link
                  to="/auth"
                  className="glass-btn rounded-md px-6 py-2 text-sm font-semibold text-white hover:text-tech-gold border border-white/10"
                >
                  LOGIN
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            ref={mobileTrigger}
            type="button"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => { setOpen((value) => !value); setAboutOpen(false); }}
            className="text-2xl text-white transition-colors hover:text-tech-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-gold xl:hidden"
          >
            {open ? <TfiClose /> : <RxHamburgerMenu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {open && (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="fixed inset-0 z-40 overflow-y-auto bg-black/95 backdrop-blur-xl xl:hidden">
          <div className="flex min-h-full flex-col items-center gap-6 px-6 pb-28 pt-32 text-center">
            {mobileLinks.map((link) => (
              <NavLink key={link.link} to={link.link} onClick={() => setOpen(false)}
                className={({ isActive }) => `${focusClass} ${link.link === "/join-us" ? "rounded-full bg-tech-gold px-8 py-3 text-xl text-deep-space" : `text-2xl hover:text-tech-gold ${isActive ? "text-tech-gold" : "text-white"}`} font-outfit font-bold tracking-wide`}>
                {link.name}
              </NavLink>
            ))}
            <div className="mt-4">
              {loading ? null : user ? <AccountMenu onNavigate={() => setOpen(false)} /> : (
                <Link to="/auth" onClick={() => setOpen(false)} className={`text-xl font-medium text-white hover:text-tech-gold ${focusClass}`}>LOGIN</Link>
              )}
            </div>
          </div>
        </nav>
      )}
    </>
  );
}

export default Navbar;
