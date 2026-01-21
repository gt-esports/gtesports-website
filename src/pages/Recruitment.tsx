import RecruitmentCard from "../components/RecruitmentCard";
import { recruitmentData } from "../data/recruitmentData";

function Recruitment() {
  return (
    <div className="min-h-screen w-full bg-deep-space pt-24">
      <div className="flex flex-col text-white">
        <h1 className="mb-4 text-center font-outfit text-5xl font-bold uppercase tracking-widest text-white md:text-6xl">
          JOIN THE <span className="text-tech-gold">TEAM</span>
        </h1>
        <div className="mx-auto mb-12 h-1 w-24 bg-tech-gold"></div>

        <div className="flex flex-col items-center">
          {Object.entries(recruitmentData).map(([name, game], index) => (
            <div className="mb-8 flex w-full justify-center px-4" key={index}>
              <RecruitmentCard
                key={index}
                image={game.image}
                name={name}
                recruitmentInfo={game.recruitmentInfo}
                description={game.description}
                discordLink={game.discordLink}
                contactEmail={game.contactEmail}
                contactDiscord={game.contactDiscord}
                applicationStatus={game.applicationStatus}
                learnMoreLink={game.learnMoreLink}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Recruitment;
