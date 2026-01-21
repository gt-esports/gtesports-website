import type React from "react";
import ProfileCard from "../components/ProfileCard";
import type { ProfileCardProps } from "../types";
import { executives, development, creative } from "../data/teamsData";

const OurTeam: React.FC = () => {
  const renderSection = (title: string, members: ProfileCardProps[]) => {
    return (
      <section className="py-12">
        <h2 className="mb-10 text-center font-outfit text-3xl font-bold tracking-wider text-tech-gold">
          {title}
        </h2>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <div key={member.name} className="flex justify-center">
              <ProfileCard {...member} />
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-deep-space pt-24">
      <div className="container mx-auto px-4 pb-12">
        <h1 className="mb-4 text-center font-outfit text-5xl font-bold tracking-widest text-white md:text-6xl">
          OUR <span className="text-tech-gold">TEAM</span>
        </h1>
        <div className="mx-auto mb-12 h-1 w-24 bg-tech-gold"></div>

        {renderSection("EXECUTIVES", executives)}
        {renderSection("DEVELOPMENT", development)}
        {renderSection("CREATIVE", creative)}
      </div>
    </div>
  );
};

export default OurTeam;
