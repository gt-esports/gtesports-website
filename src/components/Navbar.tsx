import { useEffect, useState, useRef } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { TfiClose } from "react-icons/tfi";
import { Link, NavLink, useLocation } from "react-router-dom";

import Logo from "../assets/gt-esports-logo1.png";
import {
  SignedOut,
  SignInButton,
  SignedIn,
  UserButton,
} from "@clerk/clerk-react";

function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  useEffect(() => {
    const handleScroll = () => {
      const threshold = 100;
      setIsScrolled(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const links = [
    { name: "HOME", link: "/home" },
    { name: "ABOUT", link: "/about" },
    { name: "OUR TEAM", link: "/ourteam" },
    { name: "GAMES", link: "/games" },
    { name: "RECRUITMENT", link: "/recruitment" },
    // { name: "NEWS & EVENTS", link: "/newsandevents" },
  ];

  return (
    <div
      className={`fixed z-10 flex h-[--navbar-height] w-full items-center justify-between border-0 bg-transparent transition-all duration-500 md:flex md:px-20 md:py-6 ${
        isScrolled ? "bg-opacity-70 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="font-bayon text-4xl tracking-wide">
        <Link to="/" className="flex items-center">
          <img
            src={Logo}
            alt="GT Esports Logo"
            width={68}
            height={68}
            className="mr-2"
          />
          <span className="text-2xl text-tech-gold md:text-4xl">GA TECH</span>{" "}
          <span className="ml-1 text-2xl text-white md:ml-2 md:text-4xl">
            ESPORTS
          </span>
        </Link>
      </div>
      <div
        onClick={() => setOpen(!open)}
        className="z-[2] mr-2 cursor-pointer text-3xl text-bright-buzz md:hidden"
      >
        {!open ? <RxHamburgerMenu /> : <TfiClose />}
      </div>

      {/* Mobile Menu */}
      <ul
        ref={menuRef}
        className={`fixed right-0 top-0 z-[1] h-screen w-2/5 bg-black/90 pt-14 transition-all duration-300 ease-in md:hidden ${
          open ? "translate-x-0 px-4" : "translate-x-full opacity-0"
        }`}
      >
        {/* LOGIN button */}
        <li
          className={`text-md w-full py-4 text-right text-white transition-all duration-700 ease-in-out hover:text-bright-buzz ${
            open ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
        >
          <SignedOut>
            <SignInButton mode="modal">
              <button>LOGIN</button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </li>
        {links.map((link, index) => (
          <li
            key={link.name}
            style={{ transitionDelay: `${index * 50}ms` }}
            className={`text-md w-full py-4 text-right transition-all duration-700 ease-in-out ${
              open ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
            }`}
          >
            <NavLink
              to={link.link}
              className={`${
                location.pathname === link.link
                  ? "text-bright-buzz underline"
                  : "text-white"
              } underline-offset-4 duration-500 hover:text-bright-buzz`}
              onClick={() => setOpen(false)}
            >
              {link.name}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Desktop Menu */}
      <ul className="hidden md:static md:z-auto md:flex md:items-center md:space-x-4">
        {links.map((link, index) => (
          <li
            key={link.name}
            style={{ transitionDelay: `${index * 100}ms` }}
            className="text-md py-4 md:py-0"
          >
            <NavLink
              to={link.link}
              className={`${
                location.pathname === link.link
                  ? "text-bright-buzz underline"
                  : "text-white"
              } underline-offset-4 duration-500 hover:text-bright-buzz`}
              onClick={() => setOpen(false)}
            >
              {link.name}
            </NavLink>
          </li>
        ))}
        {/* LOGIN button */}
        <li className="text-white duration-500 hover:text-bright-buzz">
          <SignedOut>
            <SignInButton mode="modal">
              <button>LOGIN</button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <div className="mt-2">
              <UserButton
                userProfileMode="navigation"
                userProfileUrl="/profile"
              />
            </div>
          </SignedIn>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
