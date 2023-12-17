import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { TfiClose } from "react-icons/tfi";
import Logo from "/logo.png";
import { Link, NavLink, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const links = [
    { name: "HOME", link: "/home" },
    // { name: "TEAMS", link: "/teams" },
    { name: "GAMES", link: "/games" },
    { name: "RECRUITMENT", link: "/recruitment" },
    { name: "NEWS & EVENTS", link: "/newsandevents" },
    { name: "ABOUT", link: "/about" }
  ];

  const [open, setOpen] = useState(false);

  return (
    <div className="fixed left-0 top-0 w-full shadow-md">
      <div className="h-[--navbar-height] items-center justify-between bg-transparent px-7 py-2 md:flex md:px-20 md:py-6">
        <div className="text-3xl font-bold">
          <Link to="/" className="flex items-center">
            <img src={Logo} alt="GT Esports Logo" width={64} height={64} className="mr-2" />
            <span className="text-tech-gold">GA Tech</span> <span className="text-white ml-2">Esports</span>
          </Link>
        </div>
        <div
          onClick={() => setOpen(!open)}
          className="absolute right-8 top-6 cursor-pointer text-3xl text-bright-buzz md:hidden"
        >
          {!open ? <RxHamburgerMenu /> : <TfiClose />}
        </div>
        <ul
          className={`absolute left-0 z-[-1] w-full bg-transparent pb-4 md:static md:z-auto md:flex md:w-auto md:items-center md:pb-0 ${
            open ? "top-[64px]" : "top-[-490px]"
          }`}
        >
          {links.map((link) => (
            <li
              key={link.name}
              className="my-7 text-center text-xl md:my-0 md:ml-8"
            >
              <NavLink
                to={link.link}
                className={`${location.pathname === link.link ? 'text-bright-buzz' : 'text-white'} ${location.pathname === link.link ? 'underline' : ''} underline-offset-4 duration-500 hover:text-white`}
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
