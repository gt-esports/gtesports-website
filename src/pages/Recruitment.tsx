import RecruitmentCard from "../components/RecruitmentCard";
import Footer from "../components/Footer";

import { recruitmentData } from "../data/recruitmentData";

function Recruitment() {
  return (
    <div className="h-full w-full bg-streak bg-cover pt-16">
      <div className="flex flex-col pt-20 text-white">
        <div className="flex flex-row items-center justify-center">
          <h1 className="flex justify-center font-bayon text-6xl text-white">
            RECRUITMENT
          </h1>
        </div>
        <div className="flex flex-col items-center justify-center pt-8">
          {Object.entries(recruitmentData).map(([name, game], index) => (
            <div className="m-6 grid w-full place-items-center ">
              <RecruitmentCard
                key={index}
                image={game.image}
                name={name}
                recruitmentInfo={game.recruitmentInfo}
                discordLink={game.discordLink}
                contactEmail={game.contactEmail}
                contactDiscord={game.contactDiscord}
                tryoutDate={game.tryoutDate}
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
