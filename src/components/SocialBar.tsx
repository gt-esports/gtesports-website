import React from 'react';
import { FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

const SocialBar: React.FC = () => {
  return (
    <div className=" absolute right-[-48px] top-[60%] bg-bright-buzz p-4 rounded-r-lg rounded-br-[40px] h-[140px] ">
      <ul className="space-y-4">
        <li>
        <a href="https://www.instagram.com/gatechesports_/" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="text-white" />
          </a>
        </li>
        <li>
          <a href="https://x.com/GatechEsports" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="text-white" />
          </a>
        </li>
        <li>
          <a href="https://www.linkedin.com/company/georgia-tech-esports/" target="_blank" rel="noopener noreferrer">
            <FaLinkedinIn className="text-white" />
          </a>
        </li>
      </ul>
    </div>
  );
};

export default SocialBar;
