// ProfileGrid.tsx
import React from "react";
import ProfileCard from './ProfileCard'; 
import { ProfileCardProps } from '../types'; 

const ProfileGrid: React.FC = () => {
  // Example data for staff members
  const staffMembers: ProfileCardProps[] = [
    { image: '', name: 'Matt G. "Sultan"', position: 'President & Competitive Gaming Director' },
    { image: '', name: 'DJ Fratt', position: 'Vice President' },
    { image: '', name: 'Francesco V.', position: 'Executive Finance Officer' },
    { image: '', name: 'Jim C.', position: 'Director of Engineering' },
    { image: '', name: 'Beeta E.', position: 'Director of Marketing & Creative' },
    { image: '', name: 'Tyler L.', position: 'Director of Events & Activations' },
  ];

  return (
    <div className="min-h-full bg-opacity-0 flex flex-col items-center">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full px-20 ">
        {staffMembers.map((member) => (
          <ProfileCard
            key={member.name}
            image={member.image}
            name={member.name}
            position={member.position}
          />
        ))}
      </div>
    </div>
  );
};

export default ProfileGrid;
