// ProfileCard.tsx
import React from 'react';
import { ProfileCardProps } from '../types';
import gamer_image from "../assets/gamer.png";

// Default placeholder image URL
const placeholderImage = gamer_image; // You can replace this URL with any placeholder image

const ProfileCard: React.FC<ProfileCardProps> = ({ image, name, position }) => {
  return (
    <div className="bg-gradient-to-b from-navy-blue to-tech-gold rounded-lg p-6 m-1 flex items-center space-x-4 shadow-lg">
        <img
          src={image || placeholderImage} // Use the placeholder if image is not provided
          alt={name}
          className="w-20 h-20 rounded-full object-cover"
        />
      <div className="flex flex-col">
        <h2 className="text-white text-2xl text-start ">{name}</h2>
        <p className="text-white normal-case font-barlow text-start">{position}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
