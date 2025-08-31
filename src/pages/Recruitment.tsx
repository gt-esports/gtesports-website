import RecruitmentCard from "../components/RecruitmentCard";
import Footer from "../components/Footer";

import { recruitmentData } from "../data/recruitmentData";

function Recruitment() {
  return (
    <div className="h-full w-full bg-streak bg-cover pt-16">
      <div className="flex flex-col pt-20 text-white">
        <h1 className="flex justify-center font-bayon text-6xl text-white">
          RECRUITMENT
        </h1>
        <div className="flex flex-col pt-8 ">
          {Object.entries(recruitmentData).map(([name, game], index) => (
            <div className="m-6 flex items-center justify-center" key={index}>
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
      <div className="mt-36">
        <Footer />
      </div>
    </div>
  );
}

export default Recruitment;
