import { useEffect, useState, useRef } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { TfiClose } from "react-icons/tfi";
import { Link, NavLink, useLocation } from "react-router-dom";

import Logo from "../assets/gt-esports-logo1.png";

function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const menuRef = useRef<HTMLUListElement | null>(null);;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Mobile view is < 768px (md breakpoint in Tailwind)
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false); // Close menu if clicked outside
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
    // { name: "TEAMS", link: "/teams" },
    { name: "GAMES", link: "/games" },
    { name: "RECRUITMENT", link: "/recruitment" },
    // { name: "NEWS & EVENTS", link: "/newsandevents" },
    { name: "ABOUT", link: "/about" },
  ];

  return (
    <div
      className={`fixed flex z-10 w-full h-[--navbar-height] border-0 items-center justify-between bg-transparent md:flex md:px-20 md:py-6 transition-all duration-500 ${
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
            <span className="text-2xl md:text-4xl text-tech-gold">GA TECH</span>{" "}
            <span className="text-2xl ml-1 md:text-4xl md:ml-2 text-white">ESPORTS</span>
          </Link>
        </div>
        <div
          onClick={() => setOpen(!open)}
          className="cursor-pointer text-3xl mr-2 z-[2] text-bright-buzz md:hidden"
        >
          {!open ? <RxHamburgerMenu /> : <TfiClose />}
        </div>
        { isMobile ? (
          // mobile view
          <ul
            ref={menuRef}
            className={`absolute right-0 top-0 z-[1] w-2/5 h-screen bg-black/90 pt-14
              transition-all duration-300 ease-in ${open ? 
              "px-4 translate-x-0" : "opacity-0 translate-x-full"}`}
          >
            {links.map((link, index) => (
              <li
                key={link.name}
                style={{ transitionDelay: `${index * 100}ms` }}
                className={`text-md py-4 text-right w-full transition-all duration-700 ease-in-out
                  ${open ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"}`} 
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
                  onClick={() => setOpen(false)}
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        ) : (
          // desktop view
          <ul
            className={`absolute right-0 top-0 z-[1] h-screen md:pt-0 md:static md:z-auto md:flex w-auto items-center bg-trasparent`}
          >
            {links.map((link, index) => (
              <li
                key={link.name}
                style={{ transitionDelay: `${index * 100}ms` }}
                className={`text-md py-4 text-right md:py-0 md:px-4 w-full`} 
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
                  onClick={() => setOpen(false)}
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        )}
          
    </div>
  );
}

export default Navbar;
