import { useEffect, useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { TfiClose } from "react-icons/tfi";
import { Link, NavLink } from "react-router-dom";
import AccountMenu from "./AccountMenu";
import Logo from "../assets/branding/gt-esports-logo.png";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { name: "HOME", link: "/home" },
    { name: "ABOUT", link: "/about" },
    { name: "OUR TEAM", link: "/ourteam" },
    { name: "GAMES", link: "/games" },
    { name: "NEWS", link: "/news" },
    { name: "RECRUITMENT", link: "/recruitment" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? "bg-nav-bg backdrop-blur-md border-b border-white/10" : "bg-transparent"
          }`}
      >
        <div className="relative z-50 mx-auto flex h-[10vh] max-w-7xl items-center justify-between px-6 xl:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group lg:shrink-0">
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
              {links.map((link) => (
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
            </ul>

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
            type="button"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
            className="text-2xl text-white transition-colors hover:text-tech-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-gold xl:hidden"
          >
            {open ? <TfiClose /> : <RxHamburgerMenu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        id="mobile-navigation"
        aria-hidden={!open}
        className={`fixed inset-0 z-40 overflow-y-auto bg-black/95 backdrop-blur-xl transition-transform duration-300 motion-reduce:transition-none xl:hidden ${open ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col items-center justify-center space-y-8 pb-56 pt-32 text-center">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.link}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `text-2xl font-outfit font-bold tracking-widest transition-all motion-reduce:transition-none hover:text-tech-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-gold focus-visible:ring-offset-4 focus-visible:ring-offset-deep-space ${isActive ? "text-tech-gold" : "text-white"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <div className="mt-8">
            {loading ? null : user ? (
              <AccountMenu onNavigate={() => setOpen(false)} />
            ) : (
              <Link
                to="/auth"
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
                className="text-xl font-medium text-white hover:text-tech-gold"
              >
                LOGIN
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
