import type React from "react";
import ProfileCard from "../components/ProfileCard";
import type { ProfileCardProps } from "../types";
import { executives, development, creative } from "../data/teamsData";

const OurTeam: React.FC = () => {
  const renderSection = (title: string, members: ProfileCardProps[]) => {
    return (
      <section className="py-16">
        <div className="mb-12 flex flex-col items-center">
          <h2 className="mb-4 text-center font-outfit text-4xl font-bold tracking-wider text-tech-gold">
            {title}
          </h2>
          <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-tech-gold to-transparent opacity-50"></div>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {members.map((member) => (
            <div key={member.name} className="flex justify-center h-full">
              <ProfileCard {...member} />
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-deep-space pt-24 pb-20 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="pointer-events-none absolute top-0 left-1/4 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-tech-gold/5 blur-[120px]"></div>
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-[500px] w-[500px] translate-y-1/2 rounded-full bg-blue-500/5 blur-[120px]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-8 text-center">
          <h1 className="mb-6 font-outfit text-6xl font-bold tracking-tight text-white md:text-7xl">
            OUR <span className="bg-gradient-to-r from-tech-gold to-yellow-200 bg-clip-text text-transparent">TEAM</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400 font-inter">
            Meet the individuals driving the future of esports and gaming at Georgia Tech.
          </p>
        </div>

        {renderSection("EXECUTIVES", executives)}
        {renderSection("DEVELOPMENT", development)}
        {renderSection("CREATIVE", creative)}
      </div>
    </div>
  );
};

export default OurTeam;
