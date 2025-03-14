import React from "react";
import ProfileCard from "./ProfileCard";
import { ProfileCardProps } from "../types";

const ProfileGrid: React.FC = () => {
  // Example data for staff members
  const staffMembers: ProfileCardProps[] = [
    { image: "", name: 'Matt G. "Sultan"', position: "President" },
    { image: "", name: "DJ Fratt", position: "Vice President" },
    { image: "", name: "Francesco V.", position: "Executive Finance Officer" },
    { image: "", name: "Jim C.", position: "Head of Engineering" },
    {
      image: "",
      name: "Beeta E.",
      position: "Director of Marketing & Creative Media",
    },
    {
      image: "",
      name: "Tyler L.",
      position: "Director of Events & Activations",
    },
    {
      image: "",
      name: "Benjamin E.",
      position: "Director of Competitive Gaming",
    },
  ];

  const isOddCount = staffMembers.length % 2 !== 0;

  return (
    <div className="flex min-h-full flex-col items-center bg-opacity-0">
      <div className="grid w-full grid-cols-1 gap-6 px-20 md:grid-cols-2">
        {staffMembers.map((member, index) => (
          <div
            key={member.name}
            className={
              isOddCount && index === staffMembers.length - 1
                ? "md:col-span-2 md:flex md:justify-center"
                : ""
            }
          >
            <div
              className={
                isOddCount && index === staffMembers.length - 1
                  ? "w-3/4 md:w-1/2"
                  : "w-full"
              }
            >
              <ProfileCard
                image={member.image}
                name={member.name}
                position={member.position}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileGrid;
