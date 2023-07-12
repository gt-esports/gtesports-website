import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { TfiClose } from "react-icons/tfi";
import Logo from "/logo.png";
import { NavLink } from "react-router-dom";

function Navbar() {
  const links = [
    { name: "HOME", link: "/" },
    { name: "ABOUT", link: "/about" },
    { name: "GAMES", link: "/games" },
  ];

  const [open, setOpen] = useState(false);

  return (
    <div className="fixed left-0 top-0 w-full shadow-md">
      <div className="h-[--navbar-height] items-center justify-between bg-light-purple px-7 py-2 md:flex md:px-20 md:py-6">
        <div className="flex items-center text-3xl font-bold text-bright-buzz">
          <img src={Logo} alt="GTEsports Logo" width={64} height={64} />
          <span className="ml-2">GTEsports</span>
        </div>
        <div
          onClick={() => setOpen(!open)}
          className="absolute right-8 top-6 cursor-pointer text-3xl text-bright-buzz md:hidden"
        >
          {!open ? <RxHamburgerMenu /> : <TfiClose />}
        </div>
        <ul
          className={`absolute left-0 z-[-1] w-full bg-light-purple pb-4 md:static md:z-auto md:flex md:w-auto md:items-center md:pb-0 ${
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
                className="text-bright-buzz underline-offset-4 duration-500 hover:text-white aria-[current=page]:underline"
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
