import { Link, NavLink, useLocation } from "react-router-dom";

import Logo from "../assets/gt-esports-logo1.png";

import facebookLogo from "../assets/facebook-icon.svg"
import xLogo from "../assets/x-icon.svg"
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
    { name: "discord", img: discordLogo, link: "https://discord.com/invite/gtesports" },
    { name: "x", img: xLogo, link: "https://twitter.com/gatechesports" },
    { name: "instagram", img: instagramLogo, link: "https://www.instagram.com/gatechesports_/" },
    { name: "facebook", img: facebookLogo, link: "https://www.facebook.com/groups/gtesports/" }
  ];

  return (
    <div className="flex flex-col w-full bg-footer-shadow pt-6 pb-6">
        <div className="flex flex-row justify-between w-full items-center mb-4">

            {/* gatech logo */}
            <div className="text-3xl font-bayon tracking-wide ml-10 py-4">
                <Link to="/home" className="flex items-center">
                    <img src={Logo} alt="GT Esports Logo" width={72} height={72} className="mr-2" />
                    <span className="text-tech-gold">GA TECH</span> <span className="text-white ml-2">ESPORTS</span>
                </Link>
            </div>

            {/* social media */}
            <div className="text-xl text-white flex items-center mr-10">
                <h1 className="mr-3">Connect With Us</h1>
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
                </ul>
            </div>
        </div>

        {/* nav link and info */}
        <div className="flex flex-row justify-between w-full pb-12">
            <div className="self-end">
                <ul
                className="flex ml-14">
                {links.map((link) => (
                    <li
                    key={link.name}
                    className="my-7 text-center text-lg md:my-0 md:mr-8"
                    >
                        <NavLink
                            to={link.link}
                            className={`${
                            location.pathname === link.link
                                ? "text-bright-buzz"
                                : "text-white"
                            }
                            underline-offset-4 duration-500 hover:text-bright-buzz`}
                        >
                            {link.name}
                        </NavLink>
                    </li>
                ))}
                </ul>
            </div>
            <div className="flex flex-col text-white text-l mr-12 tracking-wide">
                <h1 className="ml-auto">georgiatechesports@gmail.com</h1>
                <h1>801 Atlantic Dr NW, Atlanta, GA 30332</h1>
            </div>
        </div>
    </div>
  );
}

export default Footer;
