import React from "react";
import ProfileCard from "../components/ProfileCard";
import { ProfileCardProps } from "../types";

// Section data
const executives: ProfileCardProps[] = [
  { image: "", name: 'Matt G. "Sultan"', position: "President" },
  { image: "", name: "DJ Fratt", position: "Vice President" },
  { image: "", name: "Francesco V.", position: "Executive Finance Officer" },
  { image: "", name: "Jim C.", position: "Head of Engineering" },
  { image: "", name: "Ben E.", position: "Director of Competitive Gaming" },
  {
    image: "",
    name: "Beeta E",
    position: "Director of Marketing & Creative Media",
  },
  { image: "", name: "Tyler", position: "Director of Events & Activations" },
];

const development: ProfileCardProps[] = [
  { image: "", name: "Kevin H.", position: "Software Developer" },
  { image: "", name: "May L.", position: "Software Developer" },
  { image: "", name: "Wilson G.", position: "Software Developer" },
  { image: "", name: "Ethan L.", position: "Software Developer" },
];

const creative: ProfileCardProps[] = [
  {
    image: "",
    name: "Anthea C.",
    position: "Creative Team",
  },
  { image: "", name: "Justin W.", position: "Creative Team" },
  { image: "", name: "Emmaly N.", position: "Creative Team" },
  { image: "", name: "Oluteniola O.", position: "Creative Team" },
];

const sectionClass = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";

const OurTeam: React.FC = () => {
  const renderSection = (title: string, members: ProfileCardProps[]) => {
    const isOdd = members.length % 2 !== 0;
    return (
      <section className="py-12">
        <h2 className="mb-8 text-center font-bayon text-3xl text-white">
          {title}
        </h2>
        <div className={sectionClass}>
          {members.map((member, idx) => (
            <div
              key={member.name}
              className={
                isOdd && idx === members.length - 1
                  ? "flex justify-center sm:col-span-2 lg:col-span-1"
                  : ""
              }
            >
              <ProfileCard {...member} />
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="mt-12 min-h-screen bg-gradient-to-b from-black to-navy-blue py-16">
      <div className="container mx-auto px-6">
        <h1 className="text-center font-bayon text-6xl text-white">Our Team</h1>
        {renderSection("Executives", executives)}
        {renderSection("Development", development)}
        {renderSection("Creative", creative)}
      </div>
    </div>
  );
};

export default OurTeam;
