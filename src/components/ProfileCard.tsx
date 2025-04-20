import type React from "react";
import type { ProfileCardProps } from "../types";
import gamer_image from "../assets/gamer.png";

const placeholderImage = gamer_image;

const ProfileCard: React.FC<ProfileCardProps> = ({ image, name, position }) => {
  return (
    <div className="w-full max-w-md overflow-hidden rounded-lg bg-gradient-to-b from-navy-blue to-tech-gold shadow-lg transition-transform duration-300 hover:scale-105">
      <div className="flex items-center gap-4 p-6">
        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-2 border-tech-gold">
          <img
            src={image || placeholderImage}
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-white">{name}</h2>
          <p className="text-sm text-gray-200">{position}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
