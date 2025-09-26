import type React from "react";
import ProfileCard from "../components/ProfileCard";
import type { ProfileCardProps } from "../types";
import Footer from "../components/Footer";
import { executives, development, creative } from "../data/teamsData";

const OurTeam: React.FC = () => {
  const renderSection = (title: string, members: ProfileCardProps[]) => {
    return (
      <section className="py-12">
        <h2 className="mb-10 text-center font-bayon text-4xl tracking-wider text-white">
          {title}
        </h2>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3">
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
    <div className="min-h-screen bg-black bg-streak bg-cover pt-36">
      <div className="container mx-auto px-4">
        <h1 className="mb-16 text-center font-bayon text-6xl tracking-wider text-white">
          OUR TEAM
        </h1>

        {renderSection("EXECUTIVES", executives)}
        {renderSection("DEVELOPMENT", development)}
        {renderSection("CREATIVE", creative)}
      </div>
      <Footer />
    </div>
  );
};

export default OurTeam;
