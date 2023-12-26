import { Link, NavLink, useLocation } from "react-router-dom";

import Logo from "../assets/gt-esports-logo1.png";

import facebookLogo from "../assets/facebook-icon.svg"
import instagramLogo from "../assets/instagram-icon.svg"
import discordLogo from "../assets/discord-icon.svg"

function Footer() {
  const location = useLocation();

  const links = [
    { name: "HOME", link: "/home" },
    // { name: "TEAMS", link: "/teams" },
    { name: "GAMES", link: "/games" },
    { name: "RECRUITMENT", link: "/recruitment" },
    { name: "NEWS & EVENTS", link: "/newsandevents" },
    { name: "ABOUT", link: "/about" },
  ];

  const socialMedia = [
    { name: "facebook", img: facebookLogo, link: "/home" },
    { name: "instagram", img: instagramLogo, link: "/home" },
    { name: "discord", img: discordLogo, link: "/home" }
  ];


  return (
    <div className="flex flex-col w-full h-[300vh] bg-transparent">
        <div className="flex flex-row justify-between w-full">
            <div className="text-3xl font-bayon tracking-wide">
                <Link to="/home" className="flex items-center">
                    <img src={Logo} alt="GT Esports Logo" width={72} height={72} className="mr-2" />
                    <span className="text-tech-gold">GA TECH</span> <span className="text-white ml-2">ESPORTS</span>
                </Link>
            </div>
            <div className="text-2xl text-white flex items-center">
                <h1 className="mr-5">Connect With Us</h1>
                <ul className="flex ">
                    {socialMedia.map((icon) => (
                        <li
                        key={icon.name}
                        >
                            <Link to={icon.link}>
                                <img src={icon.img} alt={`${icon.name} logo`} width={32} height={32} className="m-2"/>
                            </Link>
                        </li>
                    ))}
                    {/* <Link to="/home" className="flex items-center">
                        <img src={Logo} alt="GT Esports Logo" width={72} height={72} className="mr-2" />
                        <span className="text-tech-gold">GA TECH</span> <span className="text-white ml-2">ESPORTS</span>
                    </Link>
                    <li>
                        <img src={facebookLogo} alt="Facebook" width={32} height={32} className="m-2"/>
                    </li> */}
                </ul>
            </div>
        </div>
        <div>
            <ul
            className="absolute left-0 z-[-1] w-full pb-4 md:static md:z-auto md:flex md:w-auto md:items-center md:pb-0 top-[64px]">
            {links.map((link) => (
                <li
                key={link.name}
                className="my-7 text-center text-xl md:my-0 md:ml-8"
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
        <div className="text-white">
            <h1>hi</h1>
        </div>
        <div className="text-white">
            <h1>hi</h1>
        </div>
    </div>
    // <div className="left-0 bottom-0 w-full h-200px">
    //   <div className="items-center justify-between bg-transparent px-7 py-2 md:flex md:px-20 md:py-6">
        // <div className="text-4xl font-bayon tracking-wide">
        //   <Link to="/" className="flex items-center">
        //     <img src={Logo} alt="GT Esports Logo" width={72} height={72} className="mr-2" />
        //     <span className="text-tech-gold">GA TECH</span> <span className="text-white ml-2">ESPORTS</span>
        //   </Link>
        // </div>
        // <ul
        //   className="absolute left-0 z-[-1] w-full bg-transparent pb-4 md:static md:z-auto md:flex md:w-auto md:items-center md:pb-0 top-[64px]">
        //   {links.map((link) => (
        //     <li
        //       key={link.name}
        //       className="my-7 text-center text-xl md:my-0 md:ml-8"
        //     >
        //       <NavLink
        //         to={link.link}
        //         className={`${
        //           location.pathname === link.link
        //             ? "text-bright-buzz"
        //             : "text-white"
        //         } ${
        //           location.pathname === link.link ? "underline" : ""
        //         } underline-offset-4 duration-500 hover:text-bright-buzz`}
        //       >
        //         {link.name}
        //       </NavLink>
        //     </li>
        //   ))}
        // </ul>
    //   </div>
    // </div>
  );
}

export default Footer;
