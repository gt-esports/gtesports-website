import { useEffect, useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { TfiClose } from "react-icons/tfi";
import { Link, NavLink } from "react-router-dom";
import Logo from "../assets/GTLogo.png";
import {
  SignedOut,
  SignInButton,
  SignedIn,
  UserButton,
} from "@clerk/clerk-react";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={Logo}
              alt="GT Esports Logo"
              className="h-10 w-10 transition-transform duration-300 group-hover:scale-110 sm:h-12 sm:w-12"
            />
            <div className="flex flex-col font-outfit leading-none">
              <span className="text-lg font-bold text-tech-gold tracking-wider">GEORGIA TECH</span>
              <span className="text-sm font-light text-white tracking-[0.2em]">ESPORTS ORGANIZATION</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-8 md:flex">
            <ul className="flex items-center gap-8">
              {links.map((link) => (
                <li key={link.name}>
                  <NavLink
                    to={link.link}
                    className={({ isActive }) =>
                      `text-sm font-medium tracking-wide transition-all duration-300 hover:text-tech-gold ${isActive ? "text-tech-gold" : "text-gray-300"
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Auth Buttons */}
            <div className="border-l border-white/20 pl-8">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="glass-btn rounded-md px-6 py-2 text-sm font-semibold text-white hover:text-tech-gold border border-white/10">
                    LOGIN
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton
                  userProfileMode="navigation"
                  userProfileUrl="/profile"
                  afterSignOutUrl="/"
                />
              </SignedIn>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="text-2xl text-white transition-colors hover:text-tech-gold md:hidden"
          >
            {open ? <TfiClose /> : <RxHamburgerMenu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-xl transition-transform duration-300 md:hidden ${open ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col items-center justify-center space-y-8 pt-32 text-center">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.link}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `text-2xl font-outfit font-bold tracking-widest transition-all ${isActive ? "text-tech-gold" : "text-white"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <div className="mt-8">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-xl font-medium text-white hover:text-tech-gold">
                  LOGIN
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
