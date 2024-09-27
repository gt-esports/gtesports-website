// ProfileCard.tsx
import React from 'react';
import { ProfileCardProps } from '../types';

// Default placeholder image URL
const placeholderImage = 'https://via.placeholder.com/150'; // You can replace this URL with any placeholder image

const ProfileCard: React.FC<ProfileCardProps> = ({ image, name, position }) => {
  return (
    <div className="bg-gradient-to-b from-navy-blue to-tech-gold rounded-lg p-6 m-1 flex items-center space-x-4 shadow-lg">
      <div className="flex-shrink-0">
        <img
          src={image || placeholderImage} // Use the placeholder if image is not provided
          alt={name}
          className="w-16 h-16 rounded-full object-cover"
        />
      </div>
      <div>
        <h2 className="text-white text-2xl ">{name}</h2>
        <p className="text-white normal-case font-barlow">{position}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
