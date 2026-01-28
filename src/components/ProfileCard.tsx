// ProfileCard.tsx
import type React from "react";
import type { ProfileCardProps } from "../types";
import gamer_image from "../assets/gamer.png";
import { FaLinkedin } from "react-icons/fa";

// Default placeholder image URL
const placeholderImage = gamer_image;

const ProfileCard: React.FC<ProfileCardProps> = ({
  image,
  name,
  position,
  linkedinUrl,
}) => {
  return (
    <div className="group relative w-full h-full p-[1px] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(179,163,105,0.3)] hover:-translate-y-2">
      {/* Gradient Border Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50 transition-opacity group-hover:from-tech-gold/50 group-hover:to-transparent" />

      {/* Card Content */}
      <div className="relative flex h-full flex-col items-center rounded-2xl bg-deep-space/80 p-8 backdrop-blur-sm transition-colors group-hover:bg-deep-space/90">

        {/* Profile Image Container */}
        <div className="relative mb-6">
          {/* Animated Glow behind image */}
          <div className="absolute -inset-4 rounded-full bg-tech-gold/20 blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-white/10 shadow-xl transition-all duration-300 group-hover:border-tech-gold group-hover:scale-105">
            <img
              src={image || placeholderImage}
              alt={name}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="flex flex-1 flex-col items-center text-center">
          <h2 className="mb-2 font-outfit text-2xl font-bold tracking-wide text-white group-hover:text-tech-gold transition-colors">
            {name}
          </h2>
          <p className="mb-6 font-inter text-sm font-medium uppercase tracking-wider text-gray-400">
            {position}
          </p>

          {/* LinkedIn Button - Only shows if URL exists */}
          {linkedinUrl && (
            <div className="mt-auto">
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 transition-all hover:border-tech-gold hover:bg-tech-gold hover:text-deep-space"
                aria-label={`${name}'s LinkedIn profile`}
              >
                <FaLinkedin size={16} />
                <span>Connect</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
