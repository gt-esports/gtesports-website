import { useEffect, useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { TfiClose } from "react-icons/tfi";
import { Link, NavLink, useLocation } from "react-router-dom";

import Logo from "../assets/gt-esports-logo1.png";

function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
    // { name: "TEAMS", link: "/teams" },
    { name: "GAMES", link: "/games" },
    { name: "RECRUITMENT", link: "/recruitment" },
    { name: "NEWS & EVENTS", link: "/newsandevents" },
    { name: "ABOUT", link: "/about" },
  ];

  return (
    <div
      className={`fixed left-0 top-0 z-10 w-full shadow-2xl transition-all duration-500 ${
        isScrolled ? "bg-navy-blue" : "bg-transparent"
      }`}
    >
      <div className="h-[--navbar-height] items-center justify-between bg-transparent py-2 md:flex md:px-20 md:py-6">
        <div className="font-bayon text-4xl tracking-wide">
          <Link to="/" className="flex items-center">
            <img
              src={Logo}
              alt="GT Esports Logo"
              width={68}
              height={68}
              className="mr-2"
            />
            <span className="text-tech-gold">GA TECH</span>{" "}
            <span className="ml-2 text-white">ESPORTS</span>
          </Link>
        </div>
        <div
          onClick={() => setOpen(!open)}
          className="absolute right-8 top-6 cursor-pointer text-3xl text-bright-buzz md:hidden"
        >
          {!open ? <RxHamburgerMenu /> : <TfiClose />}
        </div>
        <ul
          className={`absolute left-0 z-[1] w-full bg-transparent pb-4 md:static md:z-auto md:flex md:w-auto md:items-center md:pb-0 ${
            open ? "top-[64px]" : "top-[-490px]"
          }`}
        >
          {links.map((link) => (
            <li
              key={link.name}
              className="text-md my-7 text-center md:my-0 md:ml-8"
            >
              <NavLink
                to={link.link}
                className={`${
                  location.pathname === link.link
                    ? "text-bright-buzz"
                    : "text-white"
                } ${
                  location.pathname === link.link ? "underline" : ""
                } underline-offset-4 duration-500 hover:text-bright-buzz`}
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
