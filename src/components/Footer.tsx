import { Link, NavLink } from "react-router-dom";
import Logo from "../assets/GTlogo.png";
import facebookLogo from "../assets/facebook-icon.svg";
import xLogo from "../assets/x-icon.svg";
import instagramLogo from "../assets/instagram-icon.svg";
import discordLogo from "../assets/discord-icon.svg";

function Footer() {
  const links = [
    { name: "Home", link: "/home" },
    { name: "Games", link: "/games" },
    { name: "Recruitment", link: "/recruitment" },
    { name: "About", link: "/about" },
    { name: "Our Team", link: "/ourteam" },
  ];

  const socialMedia = [
    {
      name: "Discord",
      img: discordLogo,
      link: "https://discord.gg/uwdSHXq4sN",
    },
    { name: "Twitter", img: xLogo, link: "https://twitter.com/gatechesports" },
    {
      name: "Instagram",
      img: instagramLogo,
      link: "https://www.instagram.com/gatechesports_/",
    },
    {
      name: "Facebook",
      img: facebookLogo,
      link: "https://www.facebook.com/groups/gtesports/",
    },
  ];

  return (
    <footer className="mt-20 border-t border-white/10 bg-black/60 pt-16 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-6 pb-12 xl:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-3">
              <img src={Logo} alt="GT Esports Logo" className="h-12 w-12" />
              <div className="flex flex-col font-outfit leading-none">
                <span className="text-lg font-bold text-tech-gold tracking-wider">GEORGIA TECH</span>
                <span className="text-sm font-light text-white tracking-[0.2em]">ESPORTS</span>
              </div>
            </Link>
            <p className="max-w-xs text-sm text-gray-400">
              The official esports organization of the Georgia Institute of Technology. Fostering competitive excellence and community.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-outfit text-lg font-bold tracking-wide text-white">Navigation</h3>
            <ul className="flex flex-col gap-3">
              {links.map((link) => (
                <li key={link.name}>
                  <NavLink
                    to={link.link}
                    className="text-sm text-gray-400 transition-colors hover:text-tech-gold"
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div className="flex flex-col gap-4">
            <h3 className="font-outfit text-lg font-bold tracking-wide text-white">Community</h3>
            <ul className="flex flex-col gap-3">
              {socialMedia.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-gray-400 transition-colors hover:text-tech-gold"
                  >
                    <img src={social.img} alt={social.name} className="h-5 w-5 opacity-80" />
                    {social.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h3 className="font-outfit text-lg font-bold tracking-wide text-white">Contact</h3>
            <div className="flex flex-col gap-2 text-sm text-gray-400">
              <a href="mailto:georgiatechesports@gmail.com" className="hover:text-tech-gold">
                georgiatechesports@gmail.com
              </a>
              <p>Georgia Institute of Technology</p>
              <p>Atlanta, GA 30332</p>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Georgia Tech Esports. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
