// ProfileGrid.tsx
import React, { useState } from 'react';
import ProfileCard from './ProfileCard'; 
import { ProfileCardProps } from '../types'; 

const ProfileGrid: React.FC = () => {
  // Example data for staff members
  const [staffMembers, setStaffMembers] = useState<ProfileCardProps[]>([
    { image: '', name: 'Staff Name', position: 'Staff Position' },
    { image: '', name: 'Staff Name', position: 'Staff Position' },
    { image: '', name: 'Staff Name', position: 'Staff Position' },
    { image: '', name: 'Staff Name', position: 'Staff Position' },
    { image: '', name: 'Staff Name', position: 'Staff Position' },
    { image: '', name: 'Staff Name', position: 'Staff Position' },
    { image: '', name: 'Staff Name', position: 'Staff Position' },
    { image: '', name: 'Staff Name', position: 'Staff Position' },
  ]);

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
